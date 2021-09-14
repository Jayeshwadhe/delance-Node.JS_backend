const db = require("../../models")
const Job_Category = db.Job_Category
const Skill = db.Skill
const Currency = db.Currency
const User = db.User
const Profile = db.Profile
const Job_Post = db.Job_Post
const Dispute = db.Dispute
const University = db.University
const Course = db.Course
const Job_Title = db.Job_Title
const Blog_Post = db.Blog_Post
const { Op } = require("sequelize")
const bcrypt = require("bcrypt")
const joi = require("joi")



async function addjobcategory(req, res) {
  try {
    const jobcategory = joi.object({
      category_type: joi.string().required()
    })
    
    const { error } = jobcategory.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const { category_type } = req.body
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    await Job_Category.create({
      category_type
    })
    //public message
    return res.status(200).send({ Message: 'Added job category successfully.' })

  }catch(e){
    return res.status(500).send({Message: e})
  }
}



async function addskill(req, res) {
  try {
      const skill = joi.object({
      skill_type: joi.string().required()
    })

    const { error } = skill.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const { skill_type } = req.body
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    await Skill.create({
      skill_type
    })
    //public message
  return res.status(200).send({ Message: 'Added skills successfully.' })

  }catch(e){
    return res.status(500).send({Message: e})
  }
}



async function addcurrency(req, res) {
  try {
      const currency = joi.object({
      currency_type: joi.string().required(),
      user_address: joi.string().required(),
      currency_decimals: joi.number()
    })

    const { error } = currency.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const {
      currency_type,
      user_address,
      currency_decimals
    } = req.body

    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    await Currency.create({
      currency_type,
      user_address,
      currency_decimals
    })
    //public message
    return res.status(200).send({ Message: 'Added currency successfully.' })
    
  }catch(e){
    return res.status(500).send({Message: e})
  }
}


async function showclient(req, res) {
  try {
      admin_id = req.user.id
      const admin = await User.findOne({
       where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const client = await User.findAndCountAll({
      attributes: ["id", "first_name", "role"],
      where: { role: 1 },
      order: [
        ['id', 'DESC']
      ]
    })
    return res.status(200).send({ Client: client })

  }catch(e){
    return res.status(500).send({Message: e})
  }
}


async function showfreelancer(req, res) {
  try {
    admin_id = req.user.id
    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const freelancer = await User.findAndCountAll({
      attributes: ["id", "first_name", "role"],
      where: { role: 2 },
      order: [
        ['id', 'DESC']
      ]
    })
    return res.status(200).send({ Freelancer: freelancer })

   }catch(e){
    return res.status(500).send({Message: e})
  }
}


async function showboth(req, res) {
  try {
    admin_id = req.user.id
    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const data = await User.findAndCountAll({
      attributes: ["id", "first_name", "role"],
      where: {
        [Op.or]: [
          { role: 2 },
          { role: 1 }
        ]
      },
      order: [
        ['id', 'DESC']
      ]
    })
    return res.status(200).send({ Data: data })

  }catch(e) {
    return res.status(500).send({Message: e})
  }
}



async function updateuser(req, res) {
  try {
      const update = joi.object({
      first_name: joi.string(),
      last_name: joi.string(),
      city: joi.string(),
      country: joi.string(),
      profile_description: joi.string().required(),
      github_link: joi.string(),
      linkedin_link: joi.string(),
      portfolio_site_link: joi.string(),
      skills: joi.array().items(joi.string()),
      education: joi.string(),
      hourly_rate: joi.number().integer(),
      add_tagline: joi.string(),
      role: joi.string()
    })

    const { error } = update.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const {
      first_name,
      last_name,
      city,
      country,
      profile_description,
      github_link,
      linkedin_link,
      portfolio_site_link,
      skills,
      education,
      hourly_rate,
      add_tagline,
      role
    } = req.body

    let len = profile_description.split(" ").length;
	
	  if(len<50){
	   //public message
	  return res.send({ Message: 'Description must be minimum 50 words.' })
	  }

    if(len>500){
	  //public message
	  return res.send({ Message: 'Description must be maximum 500 words.' })
	  }

    s = skills.join(",")

    user_id = req.params.id
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    await Profile.update(
      {
        first_name,
        last_name,
        city,
        country,
        profile_description,
        github_link,
        linkedin_link,
        portfolio_site_link,
        skills: s,
        education,
        hourly_rate,
        add_tagline
      },
      {
        where: { user_id: user_id }
      }
    )

    await User.update(
      { role: role },
      {
        where: { id: user_id }
      }
    )
    //public message
    return res.status(200).send({ Message: 'User updated successfully.' })

   }catch(e){
    return res.status(500).send({Message: e})
  }
}


async function blockuser(req, res) {
  try {
    user_id = req.params.id
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const user = await User.findOne({
      where: { id: user_id }
    })

    if(user.role == 0){
      //public message
      return res.send(403).send({ Message: 'Invalid operation.' })
    }
    await User.update(
      { is_block: true },
      {
        where: { id: user_id }
      }
    )
    //public message
    return res.status(200).send({ Message: 'User is blocked.' })

   }catch(e){
    return res.status(500).send({Message: e})
  }
}



async function deleteuser(req, res) {
  try {
    user_id = req.params.id
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const user = await User.findOne({
      where: { id : user_id }
    })

   if(user.role == 0){
     //public message
     return res.status(403).send({ Message: 'Invalid operation.' })
   }

    await User.destroy({
      where: { id: user_id }
    })
    //public message
    return res.status(200).send({ Message: 'User deleted successfully.' })

   }catch(e){
    return res.status(500).send({Message: e})
  }
}


async function unblockuser(req, res) {
  try {
    user_id = req.params.id
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    await User.update(
      { is_block: false },
      {
        where: { id: user_id }
      }
    )
    //public message
    return res.status(200).send({ Message: 'User is unblocked.' })

  }catch(e){
   return res.status(500).send({Message: e})
  }
}


async function adduser(req, res) {
  try {
      const adduser = joi.object({
      email: joi.string().email().required(),
      role: joi.string().required(),
      password: joi.string().min(8).required(),
      first_name: joi.string().required()
    })

    const { error } = adduser.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const { first_name, email, role, password } = req.body
    admin_id = req.user.id

    const admin = await User.findOne({
      where: { id: admin_id }
    })

    if (admin.role !== 0) {
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const user_name = await User.findOne({
      where: { first_name: first_name }
    })

    if (user_name) {
      //public message
      return res.status(422).send({ Message: 'User is already register.' })
    }

    const user_email = await User.findOne({
      where: { email: email }
    })

    if (user_email) {
      //public message
      return res.status(422).send({ Message: 'User is already register.' })
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    await User.create({
      first_name,
      email,
      role,
      password: hash,
      is_verified: true,
      is_admin: false
    })
    //public message
    return res.status(200).send({ Message: 'User added successfully.' })

  }catch(e){
    return res.status(500).send({Message: e})
  }
}



async function addjobpost(req,res){
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
    no_of_offers: joi.number().integer()
})

const { error } = jobpost.validate(req.body)
if(error) {
return res.status(422).send({ Message: error.details[0].message })
}

admin_id = req.user.id
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
    no_of_offers
} = req.body

const admin = await User.findOne({
    where: { id: admin_id }
})
if(admin.role !== 0) {
  //public message
  return res.status(403).send({ Message: 'Invalid operation.' })
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
        user_id_job_posted_by: admin_id
    })
  return res.status(200).send({ Data: job_post })
}
}catch(e) {
return res.status(500).send({Message: e})
}
}



async function deletejobpost(req,res){
  try{
    admin_id = req.user.id
    job_post_id = req.params.id

    const admin = await User.findOne({
    where: { id : admin_id }
  })

  if(admin.role !== 0){
    //public message
    return res.status(403).send({ Message: 'Invalid operation.' })
  }

  const job_id = await Job_Post.findOne({
    where : { id :job_post_id }
  })

  if(job_id==null){
    //public message
    return res.status(422).send({ Message: 'Not found.' })
  }

  await Job_Post.destroy({
    where : { id : job_post_id }
  })
  //public message
  return res.status(200).send({ Message: 'Deleted successfully.' })

   }catch(e){
    return res.status(500).send({Message:e})
   } 
}



async function updatejobpost(req,res){
  try{
         const job_post = joi.object({
          job_description: joi.string(),
          budget: joi.number().integer(),
          category: joi.string(),
          preferred_currency_type: joi.string(),
          currency_type: joi.string(),
          cover_letter: joi.string(),
          preferred_skills: joi.string(),
          location: joi.string(),
          duration: joi.string(),
          no_of_offers: joi.number().integer()
      })
  
  const { error } = job_post.validate(req.body)
  if(error) {
    return res.status(422).send({ Message: error.details[0].message })
   }
  
    admin_id = req.user.id
    job_post_id= req.params.id
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
      no_of_offers
  } = req.body

  const admin = await User.findOne({
    where : { id : admin_id }
  })

  if(admin.role !== 0){
    //public message
    return res.status(403).send({ Message: 'Invalid operation.' })
  }

  await Job_Post.update(
    {
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
     user_id_job_posted_by:admin_id
  },
  {
    where: { id: job_post_id }
  })
   //public message
  return res.status(200).send({ message: 'Updated successfully.' })

  }catch(e){
   return res.status(500).send({Message:e})
  } 
}


async function getdispute(req, res){
  try{
        admin_id=req.user.id
        const admin = await User.findOne({
           where : { id: admin_id }
        })
 
       if(admin.role !== 0 ) {
        //public message
        return res.status(403).send({ Message: 'Invalid Operation.' })
      }
     
    const dispute = await Dispute.findAll({
      attributes : [ "job_id", "raised_by_id", "raised_to_id", "comment", "status" ],
      include : [
        {
           model : User,
           attributes: [ "first_name","role" ]
        }
     ] ,
     order: [
       ['id', 'DESC']
     ]
    })
     //  console.log(dispute.length)
    //console.log(dispute[0].dataValues.User.first_name)
     
    for(i=0; i<dispute.length; i++)
    {
      if(dispute[i].dataValues.User.role==2)
      {
         dispute[i].dataValues.User.role = "freelancer"
      }
     else if(dispute[i].dataValues.User.role==1)
      {
         dispute[i].dataValues.User.role = "client"
      }                                                                                                                                                                                                                                                                                                                                     
    }
    return res.status(200).send({ Data: dispute })

   }catch(e){
    return res.status(500).send({Message:e})
  }
}



async function adduniversity(req, res){
  try{
      const university = joi.object({
      university_name: joi.string().required()
    })
    
    const { error } = university.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    admin_id=req.user.id
    const { university_name } = req.body

    const admin = await User.findOne({
        where : {
          id: admin_id
        } 
    })

    console.log(admin)
    if(admin.role!==0){
      //public message
      return res.status(403).send({ Message:'Invalid operation.' })
    }

    const universities = await University.create({
         university_name
    })
 
     return res.status(200).send({Message: universities})
 
  }catch(e){
    console.log(e)
    return res.status(500).send({Message:e})
  } 
}



async function addcourse(req, res){
 try{
     const course = joi.object({
      course_name: joi.string().required()
   })
  
  const { error } = course.validate(req.body)
  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }
      admin_id = req.user.id
      const { course_name } = req.body

      const admin = await User.findOne({
       where: {
         id: admin_id
      }
   })
      console.log(admin)
      if(admin.role!==0){
        //public message
         return res.status(403).send({ Message:'Invalid operation.' })
    }

    const courses = await Course.create({
        course_name
    })
    return res.status(200).send({Message:courses})

   }catch(e){
    return res.status(500).send({Message:e})
  }
}



async function addjobtitle(req, res){
  try{
      const jobtitle = joi.object({
      job_title: joi.string().required()
   })
  
  const { error } = jobtitle.validate(req.body)
  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }
       admin_id = req.user.id
       const { job_title } = req.body
  
       const admin = await User.findOne({
        where: { id:admin_id }
      })
       console.log(admin)
       if(admin.role!==0){
         //public message
        return res.status(403).send({ Message:'Invalid operation.' })
      }
  
       const job_titles = await Job_Title.create({
         job_title
      }) 
      return res.status(200).send({ Message:job_titles })
  
    }catch(e){
     return res.status(500).send({Message:e})
  }
}



async function blogpost(req, res){
  try{
      const blog_post = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
   })
  
  const { error } = blog_post.validate(req.body)
  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }

    admin_id = req.user.id
    const admin = await User.findOne({
        where: { id: admin_id }
    })
   
    if(admin.role!==0){
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }
  
    const { title, description } = req.body
    await Blog_Post.create({
      title,
      description
    })
  
    //public message
    return res.status(200).send({ Message: 'Blog post added successfully.' })
   }catch(e){
    console.log(e)
    return res.status(500).send({Message:e})
  }
}


async function blogpostimage(req, res){
  try{
     admin_id = req.user.id
     const admin = await User.findOne({
       where : { id: admin_id }
    })
    if(admin.role!==0){
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }

    const { post_id } = req.body
    var image
    if (req.file){
      path = req.file.path
  
      image= await Blog_Post.update(
      { image: path },
      {
        where: { id: post_id }
      }
      )}
  //public message
  return res.status(200).send({ Message: 'Image post successfully.' })

  }catch(e){
   return res.status(500).send({Message:e})
  } 
}


async function editblogpost(req, res){
  try{
      const blog_post = joi.object({
      title: joi.string().required(),
      description: joi.string().required()
   })
  
  const { error } = blog_post.validate(req.body)
  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }

   admin_id = req.user.id
   const { post_id, title, description } = req.body
   const admin = await User.findOne({
      where: {
         id: admin_id
      }
   })
  
    if(admin.role!==0){
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }
  
    await Blog_Post.update({
        title, 
        description 
     },
      {
         where: { id: post_id }
      }
    )
    //public message
    return res.status(200).send({ Message: 'Blog post updated successfully.' })

   }catch(e){
    return res.status(500).send({Message:e})
  }
}


async function deleteblogpost(req, res) {
  try{
       admin_id = req.user.id
       const admin = await User.findOne({
         where : {
           id : admin_id
       }
    })
   
    if(admin.role!==0){
      //public message
      return res.status(403).send({ Message: 'Invalid operation.' })
    }
    
    const { post_id } = req.body
    await Blog_Post.destroy({
      where: {
        id : post_id
      }
    })
    //public message
   return res.status(200).send({ Message: 'Blog post deleted successfully.' })

  }catch(e){
   return res.status(500).send({Message:e})
  }
}



module.exports = {
  addjobcategory,
  addskill,
  addcurrency,
  showclient,
  showfreelancer,
  showboth,
  updateuser,
  blockuser,
  deleteuser,
  unblockuser,
  adduser,
  addjobpost,
  deletejobpost,
  updatejobpost,
  getdispute,
  adduniversity,
  addcourse,
  addjobtitle,
  blogpost,
  blogpostimage,
  editblogpost,
  deleteblogpost
}