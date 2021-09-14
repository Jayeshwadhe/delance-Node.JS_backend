const db = require("../../models")
const Job_Post = db.Job_Post
const User = db.User
const Proposal = db.Proposal
const Dispute = db.Dispute
const joi = require("joi")
const sgMail = require('@sendgrid/mail')
const { Op } = require("sequelize")


async function jobpost(req, res) {
    try {
         const jobpost = joi.object({
         job_description: joi.string(),
         budget: joi.number().integer(),
         category: joi.string(),
         preferred_currency_type: joi.string(),
         currency_type: joi.string(),
         cover_letter: joi.string(),
         preferred_skills: joi.string(),
         location: joi.string(),
         duration: joi.string(),
         no_of_offers: joi.number().integer(),
         job_status:joi.string()
        })

        const { error } = jobpost.validate(req.body)
        if (error) {
            return res.status(422).send({ Message: error.details[0].message })
          }

        user_id = req.user.id
        const {
            job_description,
            budget,
            category,
            preferred_currency_type,
            currency_type,
            cover_letter,
            preferred_skills,
            location,
            duration,
            no_of_offers,
            job_status
        } = req.body

        const user = await User.findOne({
            where: { id: user_id }
        })
        if (user.role !== 1) {
            //public message
            return res.status(400).send({ Message: 'Freelancer cannot post job.' })
        }
        else {
            const job_post = await Job_Post.create({
                job_description,
                budget,
                category,
                preferred_currency_type,
                currency_type,
                cover_letter,
                preferred_skills,
                location,
                duration,
                no_of_offers,
                job_status,
                user_id_job_posted_by: user_id
            })
            return res.status(200).send({ Data: job_post })
        }
      }catch(e){
      return res.status(500).send({Message: e})
    }
}


async function getjobpost(req,res){
    try{
        user_id = req.user.id
        const job_post = await Job_Post.findAll({

            attributes: [
            "user_id_job_posted_by",
            "job_description",
            "budget",
            "category",
            "preferred_currency_type",
            "currency_type",
            "cover_letter",
            "preferred_skills",
            "location",
            "duration",
            "no_of_offers",
            "job_status"
        ],
           where: { user_id_job_posted_by : user_id },    
        })

        if(job_post==0){
            //public message
            return res.status(400).send({ Message: 'No job post found.' })
        }
        return res.status(200).send({ Job_Post : job_post })

       }catch(e){
        return res.status(500).send({Message:e})
    }  
}



async function proposalpost(req, res) {
    try {
         const proposals = joi.object({
         job_post_id: joi.number().integer(),
         proposal_price: joi.number().integer(),
         preferred_currency_type: joi.string(),
         proposal: joi.string(),
         eth_address: joi.string()
        })

        const { error } = proposals.validate(req.body)
        if (error) {
          return res.status(422).send({ Message: error.details[0].message })
        }

        user_id = req.user.id
        const {
            job_post_id,
            proposal_price,
            preferred_currency_type,
            proposal,
            eth_address
        } = req.body

        const freelancer = await User.findOne({    
            attributes: ["email","role"]  ,   
            where: { id: user_id }
        
        })
        //console.log(freelancer)
      
        if (freelancer.role !== 2) {
            //public message
            return res.status(400).send({ Message: 'Client cannot post proposal.' })
        }
        freelancer_email = freelancer.email


       const job_id = await Job_Post.findOne({
           attributes: ["user_id_job_posted_by"],
            include: [ 
                {
                    model: User,
                    attributes: ["email"]
                }
            ],
            where: { id: job_post_id }
        })
      
        console.log(job_id.User.email)
        client_email = job_id.User.email

          await Proposal.create({
             job_post_id,
             proposal_price,
             preferred_currency_type,
             proposal,
             eth_address,
             user_id_freelancer: user_id
            })

            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = [
             {
              to: freelancer_email,
              from: 'rajat.brinfotech@gmail.com',
              subject: 'DeLance proposal notification.',
              html: '<h2> Your Proposal has been submitted. </h2>'
            },
            {
                to: client_email,
                from: 'rajat.brinfotech@gmail.com',
                subject: 'DeLance proposal notification.',
                html: '<h2> Receiving a proposal. </h2>'
              },
           ]
            sgMail
              .send(msg)
              .then(() => {
                 //public message
                return res.status(200).send({ Message: 'Email has been sent.' })
              })
              .catch((error) => {
                 //public message
                return res.status(400).send({ Message: 'Invalid email address. Please try again.' })
              })
           
        }catch(e){
        console.log(e)
        return res.status(500).send({Message: e})
     }
}


async function getproposalspost(req, res) {
    try {
        const { id } = req.body
        const proposals = await Proposal.findAll({
            attributes: ['job_post_id', 'user_id_freelancer', 'proposal_price', 'preferred_currency_type', 'proposal', 'eth_address'],
            include: [
                {
                    model: User,
                    attributes: [ "first_name" ]
                },
                {
                    model: Job_Post,
                    attributes: [ "user_id_job_posted_by" ]
                }
            ],
            where: { job_post_id: id }
        })  
        
        if(proposals==0){
            //public message
            return res.status(400).send({ Message: 'No proposal yet.' })
        }
        return res.status(200).send({ "Proposal": proposals })

    }catch(e){
     return res.status(500).send({Message: e})
    }
}



async function editproposalpost(req, res){
    try {
        const pro = joi.object({
        job_post_id: joi.number().integer(),
        proposal_price: joi.number().integer(),
        preferred_currency_type: joi.string(),
        proposal: joi.string(),
        eth_address: joi.string()
       })

       const { error } = pro.validate(req.body)
       if (error) {
         return res.status(422).send({ Message: error.details[0].message })
       }

       user_id = req.user.id
       const {
          job_post_id,
          proposal_price,
          preferred_currency_type,
          proposal,
          eth_address
         } = req.body


       await Proposal.update({  
          job_post_id,
          proposal_price,
          preferred_currency_type,
          proposal,
          eth_address
         }, 
      {
         where: { user_id_freelancer : user_id }
      })
     //public message
    return res.status(200).send({ Message: 'Proposal updated successfully.' })

    }catch(e){
    return res.status(500).send({Message:e})
    }   
}



async function deleteproposalpost(req, res) {
    try{
        const delete_proposal = joi.object({
         proposal_id: joi.number().integer()
       })
        
     const { error } = delete_proposal.validate(req.body)
     if (error) {
      return res.status(422).send({ Message: error.details[0].message })
     }

    user_id=req.user.id
    const { 
           proposal_id 
         } = req.body

    const proposal = await Proposal.findOne({
        attributes : [ "id", "job_post_id" ],
        include : [
            {
              model : Job_Post,
              attributes: [ "user_id_job_posted_by" ]  
            }
        ],
        where : { id: proposal_id }
    })

   // console.log(proposal.Job_Post.user_id_job_posted_by)

    if(proposal.Job_Post.user_id_job_posted_by != user_id){
        //public message
       return res.status(400).send({ Message: 'Not found.' })
    }

    await Proposal.destroy({
        where : { id: proposal_id }
    })
    //public message
    return res.status(200).send({ Message: 'Proposal deleted successfully.' }) 

    }catch(e){
     return res.status(500).send({Message:e})
   }  
}


async function disputes(req,res){
    try{
         const dis = joi.object({
           job_id: joi.number().integer().required(),
           comment: joi.string().required(),
           status: joi.string().required()
        })
    
        const { error } = dis.validate(req.body)
        if(error) {
          return res.status(422).send({ Message: error.details[0].message })
        }
    
        raised_by_id = req.user.id
        raised_to_id = req.params.id
        const {
            job_id,
            comment,
            status
        } = req.body
    
        await User.findOne({
            where :{ id: raised_by_id } 
        })
    
        await User.findOne({
            where :{ id: raised_to_id } 
        })
    
        const dispute = await Dispute.create({
            job_id,
            comment,
            status,
            raised_by_id,
            raised_to_id
        })
       return res.status(200).send({ Data: dispute })

      }catch(e){
       return res.status(500).send({Message:e})
    } 
}



async function getorderstatus(req, res){
    try{
        user_id=req.user.id
        job_id=req.params.id
    
       const order_status = await Job_Post.findOne({
            attributes : [ "user_id_job_posted_by", "job_status" ],
            include : [
                {
                    model : User,
                    attributes : ["first_name"]
                }
            ],
            where: {
                [Op.and]: [
                  { id: job_id },
                  { user_id_job_posted_by: user_id }
                ]
              },
        })
        return res.status(200).send({ Order_status: order_status })

     }catch(e){
      return res.status(500).send({Message:e})
    } 
}


async function getordercompleted(req, res){
    try{
        user_id=req.user.id
     
        const order_list = await Job_Post.findAll({
            attributes: [ "id", "job_status" ],
            include : [
                {
                    model : User,
                    attributes : [ "first_name" ]
                }
            ],
            where: { user_id_job_posted_by: user_id }
        })
        // console.log(order_list[0].job_status)
        // console.log(order_list.length)
    
        list = []
        val = []
        for(i=0; i<order_list.length; i++)
        {
            if(order_list[i].job_status == "complete")
            {
                list.push(order_list[i])
            }
            if(order_list[i].job_status != "complete")
            {
                val.push(order_list[i])
            }
        }
        if(list.length == 0){
          //public message
          return res.status(400).send({ Message: 'No job completed.' })
        }
        return res.status(200).send({ Order_list: list })

        }catch(e){
         return res.status(500).send({Message:e})
       }
    }



    async function managebidders(req, res){
        try{
            user_id=req.user.id
            const { job_id } = req.body
    
            const job_post = await Job_Post.findOne({
                where: { id: job_id }
            })
            if(!job_post){
                //public message
               return res.status(400).send({ Message: 'Job post not found.' })
            }
            
            const job = await Job_Post.findOne({
                where: {
                    [Op.and]: [
                        { id: job_id },
                        { user_id_job_posted_by: user_id }
                    ]
                  },
            })
             if(!job){
                 //public message
                 return res.status(400).send({ Message: 'Not found.' })
              }
    
        
           const freelancer = await Proposal.findAll({
                attributes : [ "user_id_freelancer" ],
                include : [
                    {
                        model: User,
                        attributes: [ "first_name" ]
                    }  
                ],
                where: { job_post_id: job_id }
            })
    
            if(freelancer==0){
                //public message
                return res.status(400).send({ Message: 'No proposal yet.' })
            }
    
         return res.status(200).send({ Message: freelancer })

        }catch(e){
         return res.status(500).send({Message:e})
        }  
    }



    async function hirefreelancer(req, res){
      try{
          const { proposal_id } = req.body
          client_id = req.user.id

          const proposal = await Proposal.findOne({
            include : [
                {
                    model : User,
                    attributes: [ "email" ]  
                },
                {
                  model : Job_Post,
                  attributes: [ "user_id_job_posted_by" ]  
                }
            ],
            where : { id: proposal_id }
        })
    
      // console.log(proposal.Job_Post.user_id_job_posted_by)
     //  console.log(proposal.User.email)
    
        if(proposal.Job_Post.user_id_job_posted_by !== client_id){
            //public message
           return res.status(400).send({ Error: 'Invalid user.' })
        }

      const user = await User.findOne({
            where: { id: proposal.Job_Post.user_id_job_posted_by }
        })
     //  console.log(user.email)

       client_email = user.email
       client_name = user.first_name
       console.log(client_name)
   
       freelancer_email = proposal.User.email

      const accept_offer = `${process.env.URL}/api/job/accept-offer/${client_email}/${freelancer_email}`
      const reject_offer = `${process.env.URL}/api/job/reject-offer/${client_email}`

      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msgs = {
        to: freelancer_email,
        from: 'rajat.brinfotech@gmail.com',
        subject: 'DeLance proposal notification.',
        html: `<h2> <button><a href=${accept_offer}>accept offer.</a></button>
               <button><a href=${reject_offer}>reject offer.</a></button> </h2>`
       }
       sgMail
      .send(msgs)
      .then(() => {
       //public message
        return res.status(200).send({ Message: 'Email has been sent.' })
      })
      .catch((error) => {
         //public message
        return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
      })   
     }catch(e){
      return res.status(500).send({Message:e})
     }
       
    }
 

   async function acceptoffer(req, res){
     try{
         const { client_email, freelancer_email } = req.params

         await User.findOne({
          where: { email: client_email }
       })
        await User.findOne({
         where: { email: freelancer_email }
       })
    // console.log(mail.email)
     
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msgs = [
       {
         to: client_email,
         from: 'rajat.brinfotech@gmail.com',
         subject: 'DeLance proposal notification.',
         html: '<h2> Your offer has been accepted. </h2>'
      },
      {
         to: freelancer_email,
         from: 'rajat.brinfotech@gmail.com',
         subject: 'DeLance proposal notification.',
         html: '<h2> Accepted offer. </h2>'
      }
     ]
       sgMail
      .send(msgs)
      .then(() => {
      //public message
       return res.status(200).send({ Message: 'Email has been sent.' })
     })
     .catch((error) => {
      //public message
      return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
   })
   }catch(e){
    return res.status(500).send({Message:e})
   }      
}


  async function rejectoffer(req, res){
    try{
         const { client_email } = req.params

         await User.findOne({
         where: { email: client_email }
      })
       
    // console.log(mail.email)
 
   sgMail.setApiKey(process.env.SENDGRID_API_KEY)
   const msgs = {
          to: client_email,
         from: 'rajat.brinfotech@gmail.com',
         subject: 'DeLance proposal notification.',
         html: '<h2> Your offer has been rejected. <h2>' 
      }
       sgMail
      .send(msgs)
      .then(() => {
      //public message
       return res.status(200).send({ Message: 'Email has been sent.' })
     })
     .catch((error) => {
      //public message
      return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
   })
   }catch(e){
     return res.status(500).send({Message:e})
  }      
}


  async function declineproposal(req, res){
    try{

        const { proposal_id } = req.body
        client_id=req.user.id

        const proposal = await Proposal.findOne({
            include : [
                {
                    model : User,
                    attributes : [ "email" ]
                },
                {
                    model : Job_Post,
                    attributes: [ "user_id_job_posted_by" ]
                }
            ],
            where : { id: proposal_id }
        })

        console.log(proposal.User.email)
        freelancer_email = proposal.User.email

        console.log(proposal.Job_Post.user_id_job_posted_by)
        if(client_id != proposal.Job_Post.user_id_job_posted_by){
            //public message
            return res.status(400).send({ Message: 'Invalid user.' })
        }

        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msgs = {
        to: freelancer_email,
        from: 'rajat.brinfotech@gmail.com',
        subject: 'DeLance proposal notification.',
        html: '<h2> Decline your proposal. </h2>'
       }
       sgMail
      .send(msgs)
      .then(() => {
       //public message
        return res.status(200).send({ Message: 'Email has been sent.' })
      })
      .catch((error) => {
         //public message
        return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
      })   
    }catch(e){
     return res.status(500).send({Message:e})
  }      
}

    module.exports = {
       jobpost,
       getjobpost,
       proposalpost,
       getproposalspost,
       editproposalpost,
       deleteproposalpost,
       disputes,
       getorderstatus,
       getordercompleted,
       managebidders,
       hirefreelancer,
       acceptoffer,
       rejectoffer,
       declineproposal
    }

    