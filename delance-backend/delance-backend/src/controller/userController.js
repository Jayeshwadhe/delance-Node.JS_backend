const db = require("../../models")
const User = db.User
const Profile = db.Profile
const Review = db.Review
const Job_Category = db.Job_Category
const Skill = db.Skill
const Currency = db.Currency
const Job_Post = db.Job_Post
const University = db.University
const Course = db.Course
const Job_Title = db.Job_Title
const Blog_Post = db.Blog_Post
const Comment = db.Comment
const Like = db.Like
const { Op } = require("sequelize")
const joi = require("joi")


async function profiledetails(req,res){
  try{
	const user_id = req.user.id
    const details=await User.findOne({
	attributes: ['first_name','last_name', 'email','role','country','state','city'],
	where:{id:user_id}
  })
  return res.status(200).send({Message:details})
}
  catch(e){
	  //public message
	return res.status(500).send({Message:'Something went wrong.'})
  }
}

async function completeprofile(req, res) {
  try {
	  const profile = joi.object({
	  first_name:joi.string().required(),
	  last_name:joi.string().required(),
	  email:joi.string().email().required(),
	  country: joi.string().required(),
	  state:joi.string(),
	  city:joi.string(),
	  role:joi.number().integer().required(),
	  profile_description: joi.string().required(),
	  github_link: joi.string(),
	  linkedin_link: joi.string(),
	  portfolio_site_link: joi.string(),
	  skills: joi.array().items(joi.string()),
	  hourly_rate: joi.number().integer(),
	  add_tagline: joi.string(),
	  university_name:joi.string(),
	  course_name:joi.string(),
	  course_year_from:joi.number(),
	  course_year_to:joi.number(),
	  designation:joi.string(),
	  company_name:joi.string(),
	  job_duration_month_from:joi.string(),
	  job_duration_year_from:joi.number(),
	  job_duration_month_to:joi.string(),
	  job_duration_year_to:joi.number()

	})

	const { error } = profile.validate(req.body)
	if (error) {
	  return res.status(422).send({ Error: error.details[0].message })
	}
	
	const {
	first_name,
	last_name,
	role,
	email,
	country,
	city,
	state,
	profile_description,
	github_link,
	linkedin_link,
	portfolio_site_link,
	skills,
	hourly_rate,
	add_tagline,
	university_name,
	course_name,
	course_year_from,
	course_year_to,
	designation,
	company_name,
	job_duration_month_from,
	job_duration_year_from,
	job_duration_month_to,
	job_duration_year_to
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

	user_id = req.user.id
	s = skills.join(",")

	user = await User.findOne({
	  where: { id: user_id }
	})

	if (user.dataValues.is_complete == true) {
	  //public message
	  return res.status(400).send({ Message: 'Profile is already completed.' })
	}


   	await Profile.create({
	  profile_description,
	  github_link,
	  linkedin_link,
	  portfolio_site_link,
	  skills: s,
	  hourly_rate,
	  add_tagline,
	  university_name,
	  course_name,
	  course_year_from,
	  course_year_to,
	  designation,
	  company_name,
	  job_duration_month_from,
	  job_duration_year_from,
	  job_duration_month_to,
	  job_duration_year_to,
	  user_id
	})

   await User.update(
	  { is_complete: true,  
	
	 },
	  {
		where: { id: user_id }
	  }
	)
  //public message
 return res.status(200).send({ Message: 'User profile updated.', is_complete: true })

  }catch(e){
	  console.log(e);
	return res.status(500).send({Message: e})
  }
}



async function profilepic(req, res) {
  try {
	user_id = req.user.id
	var image
	if (req.file) {
	  path = req.file.path

	  image= await Profile.update(
		{ image: path },
		{
		  where: {
			user_id: user_id
		  }
		}
	  )
	}
	const imagepath=await Profile.findOne({
			attributes: ['image'],
			where:{
				user_id:user_id
			}
		})
		const url=(imagepath.dataValues.image);
		//public message
	return res.status(200).send({ Message: 'Profile picture updated.',imagepath:url })
	
   }catch(e){
	console.log(e)
   return res.status(500).send({Message: e})
  }
}


async function reviews(req, res) {
  try {
	  const reviews = joi.object({
	  delivered_on_budget:joi.boolean().required(),
	  delivered_on_time:joi.boolean().required(),
	  text_reviews: joi.string(),
	  star_reviews: joi.number().integer().required()
	})

	const { error } = reviews.validate(req.body)
	if (error) {
	  return res.status(422).send({ Message: error.details[0].message })
	}

	const {
	  delivered_on_budget,
	  delivered_on_time,
	  text_reviews,
	  star_reviews
	} = req.body

	user_id_review_given_to = req.params.id
	user_id_review_given_by = req.user.id

	await User.findOne({
	  where: { id: user_id_review_given_by }
	})

	users = await User.findOne({
	  where: { id: user_id_review_given_to }
	})

	if (!users) {
	  //public message
	  return res.status(400).send({ Message: 'User not found.' })
	}

	const review = await Review.create({
	  delivered_on_budget,
	  delivered_on_time,
	  text_reviews,
	  star_reviews,
	  user_id_review_given_to,
	  user_id_review_given_by
	})
	return res.status(200).send({ message: review })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}



async function getreviews(req, res) {
  try {
	user_id = req.user.id
	const rating = await Review.findAll({
	  include: [
		{
		  model: User,
		  attributes: ['first_name']
		}
	  ],
	  where: { user_id_review_given_by: user_id }
	})
	return res.status(200).send({ "Reviews": rating })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}


async function getprofile(req, res) {
  try {
	  user_id = req.user.id
	  const profile = await User.findOne({
	  attributes: ["first_name","last_name","email","role","city","state","country"],
	  include: [
		{
		  model: Profile,
		  attributes: ["image", "profile_description", "github_link", "linkedin_link", "portfolio_site_link", "skills","hourly_rate", "add_tagline","university_name","course_name","course_year_from","course_year_to","designation","company_name","job_duration_month_from","job_duration_year_from","job_duration_month_to","job_duration_year_to"]
		},
		{
		  model: Review,
		  attributes: ["delivered_on_budget","delivered_on_time","text_reviews", "star_reviews", "user_id_review_given_to", "user_id_review_given_by"]
		}
	  ],
	  where: { id: user_id }
	})

	var len = (profile.dataValues.Reviews).length
	sum = 0
	for (i = 0;  i < len;  i++) {
	  sum = sum + profile.dataValues.Reviews[i].star_reviews
	}
	let average = sum / len

	return res.status(200).send({ "Userprofile": profile, 'averageReview': average })

	}catch(e){
	return res.status(500).send({Message: e})
  }
}


async function getjobcategory(req, res) {
  try {
	user_id = req.user.id
	const job_category = await Job_Category.findAll({
	  attributes: ["category_type"]
	})
	return res.status(200).send({ "JobCategory": job_category })

	}catch(e){
	return res.status(500).send({Message: e})
  }
}


async function getskill(req, res) {
  try {
	user_id = req.user.id
	const skill = await Skill.findAll({
	  attributes: ["id","skill_type"]
	})
	return res.status(200).send({ "Skill": skill })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}


async function getcurrency(req, res) {
  try {
	user_id = req.user.id
	const currency = await Currency.findAll({
	  attributes: ["currency_type","user_address","currency_decimals"]
	})
	return res.status(200).send({ "Currency": currency })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}


async function searchfreelancerbyname(req, res) {
  try {
	 const search_name = joi.object({
	  name: joi.string().required()
	})

	const { error } = search_name.validate(req.body)
	if(error) {
	  return res.status(422).send({ Message: error.details[0].message })
	}

	const { name } = req.body
	const user = await User.findOne({
	  attributes: ["id", "first_name", "role"],
	  where: { 
		first_name: { [Op.like]: '%' + name + '%' } 
	  }
	})

	console.log(user.dataValues.role)
	if(user.dataValues.role !== 2 ) {
	  //public message
	  return res.status(400).send({ Message: 'User not found.' })
	}
	else {
	  return res.status(200).send({ User: user })
	}
	}catch(e){
	return res.status(500).send({Message: e})
  }
}



async function searchfreelancerbyskills(req, res) {
  try{
	 const search_skills = joi.object({
	  skill: joi.string().required()
	})

	const { error } = search_skills.validate(req.body)
	if(error) {
	  return res.status(422).send({ Message: error.details[0].message })
	}

	  const { skill } = req.body
	  const user = await Profile.findAll({
	   attributes: ["skills" ],
	   include: [
			{
			  model: User,
			  attributes: ["first_name","role"]
			}
		  ],   
	  where: { skills: { [Op.like]: '%' + skill + '%' } }
	})
  
	//console.log(user[0].dataValues.skills)
	//console.log(user[0].dataValues.User.dataValues.role) 
  
	role = []
	val = []
  
	for(i=0; i<user.length; i++)
  {
	 if( user[i].dataValues.User.dataValues.role == 2 )
	 {
	   role.push(user[i].dataValues)
	 }
	 else{
		 val.push(user[i].dataValues)
	   }       
  }
  console.log(role)
  if(role.length !== 0) 
  { 
	return res.status(200).send({ 'user': role })
  }
  //public message
  return res.status(400).send({ Message: 'User not found.' })

  }catch(e){
   return res.status(500).send({Message: e})
  }
}


async function searchjobbyid(req, res) {
  try {
	const { job_id } = req.body
	job_post = await Job_Post.findOne(
	  {
		where: { id: job_id },
		attributes: [
		  "id", 
		  "job_description",
		  "user_id",
		  "budget",
		  "category",
		  "preferred_currency_type",
		  "currency_type",
		  "cover_letter",
		  "preferred_skills",
		  "location",
		  "duration",
		  "no_of_offers"
		]
	  }
	)
	return res.status(200).send({ Job_Post: job_post })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}


async function updateprofile(req, res) {
  try {
	  const updateprofile = joi.object({
	  country: joi.string(),
	  profile_description: joi.string().required(),
	  github_link: joi.string(),
	  linkedin_link: joi.string(),
	  portfolio_site_link: joi.string(),
	  skills: joi.array().items(joi.string()),
	  education: joi.string(),
	  hourly_rate: joi.number().integer(),
	  add_tagline: joi.string()
	})

	const { error } = updateprofile.validate(req.body)
	if (error) {
	  return res.status(422).send({ Message: error.details[0].message })
	}

	const {
	  country,
	  profile_description,
	  github_link,
	  linkedin_link,
	  portfolio_site_link,
	  skills,
	  education,
	  hourly_rate,
	  add_tagline
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
	user_id = req.user.id
	
	

   if(!c_name){ 
	 //public message 
	return res.status(400).send({ Message: 'Country not found.' })
   }

	await Profile.update({
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
		where: { id: user_id }
	  })
	  //public message
	return res.status(200).send({ Message: 'Profile updated successfully.' })

  }catch(e){
	return res.status(500).send({Message: e})
  }
}



  async function getcity(req,res){
	const city = await Time_Zone.findAll({
	  
	 })
	 return res.status(200).send({Message:city})
  } 
   
   
   
   async function getalluniversity(req, res){
	   try{
			 const university = await University.findAll({
			 attributes: ["id","university_name"]
		  })
	   
		   return res.status(200).send({Message:university})
   
		}catch(e){
		 return res.status(500).send({Message:e})
	   }
   }
   
   
   
   async function getallcourse(req, res){
	   try{
			 const course = await Course.findAll({
			 attributes : ["id","course_name"]
		   })
		   
			return res.status(200).send({Message:course})
   
		 }catch(e){
			 console.log(e)
		  return res.status(500).send({Message:e})
	   }
   }
   
   
   async function getalljobtitle(req, res){
	   try{
			  const job_title = await Job_Title.findAll({
			  attributes:["id","job_title"]
		 })
		   return res.status(200).send({Message:job_title})
   
		}catch(e){
		 return res.status(500).send({Message:e})
	   }  
   }
		

async function getallblogpost(req, res){
   try{
		const blog_post = await Blog_Post.findAll({
			attributes: [ "id", "title", "description", "image" ],
			include: [
				{
					model: Comment,
					attributes: [ "post_id", "comment", "user_id_comment_by" ]
				},
				{
					model: Like,
					attributes: [ "user_id_liked_by" ]
				}
			]
		})
		return res.status(200).send({ Message: blog_post })

	  }catch(e){
	   return res.status(500).send({Message:e})
	 }
  }


async function postcomment(req, res){
    try{
		const post_comment = joi.object({
			post_id: joi.number().integer().required(),
			comment: joi.string().required()
		})
	  
		const { error } = post_comment.validate(req.body)
		if(error) {
		  return res.status(422).send({ Message: error.details[0].message })
		}
	  
		user_id_comment_by = req.user.id
		const { post_id, comment } = req.body
	  
		const blog_post = await Blog_Post.findOne({
			where: { id: post_id }
		})
		if(!blog_post){
			//public message
		  return res.status(422).send({Message: 'Blog post not found.' })
		}
	  
		await Comment.create({
		  post_id,
		  comment,
		  user_id_comment_by
		})
		//public message
		return res.status(200).send({ Message: 'Comment post successfully.' })

	  }catch(e){
	   return res.status(500).send({Message:e})
	}
}


async function deletepostcomment(req, res){
	try{
		  const delete_comment = joi.object({
		  post_id: joi.number().integer().required()
		})
		  
		  const { error } = delete_comment.validate(req.body)
		  if(error) {
		   return res.status(422).send({ Message: error.details[0].message })
		}

         user_id = req.user.id
	     const { post_id } = req.body
	     const blog_post = await Blog_Post.findOne({
	     	where : { id: post_id}
	    })

	     if(!blog_post){
		  //public message
	      return res.status(422).send({ Message: 'Blog post not found.' })
	   }

	     await Comment.destroy({
		    where: {
		    	[Op.and]: [
			      { post_id: post_id },
			      { user_id_comment_by: user_id }
			  ]
		   }
	   })
	   //public message
	   return res.status(200).send({ Message: 'Comment deleted successfully.' })
      }catch(e){
	   return res.status(500).send({Message:e})
	}
}


async function postlike(req, res){
    try{
		 const post_like = joi.object({
	  	 post_id: joi.number().integer().required()
	  })
	  
		const { error } = post_like.validate(req.body)
		if(error) {
		 return res.status(422).send({ Message: error.details[0].message })
		}

		user_id = req.user.id
		const { post_id } = req.body
		const blog_post = await Blog_Post.findOne({
			where: { id: post_id }
		})

	   if(!blog_post){
		  //public message
		 return res.status(422).send({ Message: 'Blog post not found.' })
	   }
	
	   await Like.create({
		 post_id: post_id,
		 user_id_liked_by: user_id
	 })
	 //public message
	  return res.status(200).send({ Message: 'Blog post liked successfully.' })

	}catch(e){
	 return res.status(500).send({Message:e})
	}
}


async function postunlike(req, res){
	try{
		 const post_unlike = joi.object({
		 post_id: joi.number().integer().required()
	   })
	   
		 const { error } = post_unlike.validate(req.body)
		 if(error) {
		  return res.status(422).send({ Message: error.details[0].message })
		 }
 
		user_id = req.user.id
		const { post_id } = req.body
	
		const blog_post = await Blog_Post.findOne({
		   where : { id : post_id }
		})
		if(!blog_post){
			//public message
		   return res.status(422).send({ Message: 'Blog post not found.' })
		}
		await Like.destroy({
			where: {
                [Op.and]: [
                  { post_id: post_id },
                  { user_id_liked_by: user_id }
                ]
              }
		})
		//public message
		return res.status(200).send({ Message: 'Blog post unlike successfully.' })
	}catch(e){
	 return res.status(500).send({Message:e})
	}
}



module.exports = {
  profiledetails,
  completeprofile,
  profilepic,
  reviews,
  getprofile,
  getreviews,
  getjobcategory,
  getskill,
  getcurrency,
  searchfreelancerbyname,
  searchfreelancerbyskills,
  searchjobbyid,
  updateprofile,
  getcity,
  getalluniversity,
  getallcourse,
  getalljobtitle,
  getallblogpost,
  postcomment,
  deletepostcomment,
  postlike,
  postunlike

}

