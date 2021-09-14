const db = require("../../models")
const User = db.User
const Refresh_Token = db.Refresh_Token
const joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail')
forget_user = null
login_user = null



async function signup(req, res) {
  try {
      const reg = joi.object({
      first_name: joi.string().required(),
      last_name: joi.string().required(),
      password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
      confirm_password: joi.ref('password'),
      email: joi.string().email().required(),
      role: joi.number().required(),
      country:joi.string().required(),
      state:joi.string().required(),
      city: joi.string().required(),
      send_useful_emails: joi.boolean(),
      terms_of_use: joi.boolean().required()
    })
    const { error } = reg.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const { first_name, last_name, password, confirm_password, email, role, city, send_useful_emails, terms_of_use,country,state } = req.body

    const find_user = await User.findOne({
      where: [{
        email:email
      }]
    })
    
    if (find_user) {
       if(find_user.dataValues.is_verified==false){
         //public message
        return res.status(422).send({Message:'Account verification is pending.'})
       }
      //public message
      return res.status(422).send({ Message: 'User is already registered.' })
    }

    const salt = bcrypt.genSaltSync(10) 
    const hash = bcrypt.hashSync(password, salt) 
    
    const user=await User.create({
      first_name,
      last_name,
      password: hash,
      email,
      role,
      country,
      state, 
      city,
      send_useful_emails,
      terms_of_use,
      is_verified: false
    })

   values=user.dataValues 
   
   const access_token = jwt.sign({ email, role }, process.env.JWT_SECRET)
    
    const verify_url = `${process.env.URL}/api/activate/${access_token}`
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msgs = {
      to: email,
      from: 'rajat.brinfotech@gmail.com',
      subject: 'Complete your DeLance signup',
      html: `<h2>Click the button below to complete your signup.</h2><br>
      <a href=${verify_url}>Confirm signup.</a>`
    }
    sgMail
      .send(msgs)
      .then(() => {
        //public message
       return res.status(200).send({ Message: 'Please complete your signup by checking your email and confirming your account.'  })
      })
      .catch((e) => {
           //public message
          return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
        })

  }catch(e){
    console.log(e)
    return res.status(500).send({Message: 'Something went wrong.'})
  }
}


async function activate(req, res) {
  try {
    const { access_token } = req.params
    const access_to = await jwt.verify(access_token, process.env.JWT_SECRET)
    const { email } = access_to
    const user=await User.findOne({
      where:{
        email:email
      }
    })
    if(user.dataValues.is_verified==true){
      res.writeHead(422,{'Content-Type': 'text/html'})
      res.write("<h2>Already verified.</h2>")
      res.write(`<a href=${process.env.REDIRECT_URL}/login>Click Here.</a>`)  
      return res.end()  
    }else{
      await User.update({ is_verified: true }, {
        where: {
         email: email
       }
     })  
       res.writeHead(200,{'Content-Type': 'text/html'})
       res.write("<h2><b>Succesfully verified.</b></h2>")
       res.write(`<a href=${process.env.REDIRECT_URL}/login>Click Here.</a>`)  
       return res.end()  
    }
   }catch(e){
    return res.status(500).send({Message: 'Something went wrong.'})
  }
}


async function login(req, res) {
  try {
    let login = joi.object({
      email: joi.string().email().required(),
      password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required()
    })
    const { error } = login.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }
    let { email, password } = req.body
    login_user = await User.findOne({
      where: { email }
    })

    if (!login_user) {
       //public message
      return res.status(422).send({ Message: 'User not found.' })
    }
    const compare = bcrypt.compareSync(password, login_user.password)

    if (!compare) {
       //public message
      return res.status(422).send({ Message: 'Please enter valid credentials.' })
    }

    if (login_user.is_block === true) {
       //public message
      return res.status(422).send({ Message: 'User is blocked.' })
    }

    if (login_user.is_verified === false) {
     //  public message
      return res.status(422).send({ Message: 'Please verify your account.' })
    }

    const login_otp = (Math.floor(100000 + Math.random() * 900000))
    console.log(login_otp)

    await User.update({ otp:login_otp  }, 
    {
      where: {
        email:email
      }
    })
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msgs = {
      to: email,
      from: 'rajat.brinfotech@gmail.com',
      subject: 'Welcome to DeLance!',
      html: "<h2> Your DeLance 2-factor authentication one-time password is " + login_otp + "</h2>"
    }
    sgMail
      .send(msgs)
      .then(() => {
       //public message
        return res.status(200).send({ Message: 'Email has been sent.' })
      })
      .catch((e) => {
        console.log(e)
         //public message
        return res.status(422).send({ Message: 'Invalid email address. Please try again.' })
      })
   }catch(e){
     console.log(e)
    return res.status(500).send({Message: 'Something went wrong.'})
  }
}



async function resendotp(req, res){
  try{
      let resendotp = joi.object({
      email:joi.string().required()
    })

    const { error } = resendotp.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

      const { email } = req.body

      const resend_otp = (Math.floor(100000 + Math.random() * 900000))
      console.log(resend_otp)
  
      await User.update({ otp:resend_otp }, 
        {
          where: {
            email:email
          }
        })
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      const msgs = {
      to: email,
      from: 'rajat.brinfotech@gmail.com',
      subject: 'Welcome to DeLance!',
      html: "<h2> Your DeLance 2-factor authentication one-time password is " + resend_otp + "</h2>"
    }
    sgMail
      .send(msgs)
      .then(() => {
       //public message
        return res.status(200).send({ Message: 'Email has been sent.' })
      })
      .catch((e) => {
         //public message
        return res.status(422).send({ Message: 'Invalid email address. Please try again.' })
      })
  }catch(e){                                                                                                                                                                          
   return res.status(422).send({Message: 'Something went wrong.'})
}
}


async function twofactor(req, res) {
  try {
    let twofactor = joi.object({
      get_otp: joi.number().required().min(6),
      email:joi.string().required()
    })

    const { error } = twofactor.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }
    const { get_otp,email } = req.body

    const user=await User.findOne({where:{email:email}})

    if (get_otp != user.otp) {
       //public message
      return res.status(422).send({ Message: 'Invalid login.' })
    }
    if(!email){
      return res.status(422).send({Message:'Email not found.'})
    }
    
    else {
      const access_token = jwt.sign({ id: login_user.id, is_admin: login_user.is_admin, is_complete: login_user.is_complete, role: login_user.role, email: login_user.email }, process.env.JWT_SECRET, { expiresIn: '15m' })
      const refresh_token = jwt.sign({ id: login_user.id, is_admin: login_user.is_admin, is_complete: login_user.is_complete, role: login_user.role, email: login_user.email  }, process.env.REFRESH_SECRET, { expiresIn: '1y' })

      await Refresh_Token.create({
        token: refresh_token
      })
      return res.status(200).send({ access_token, refresh_token })
    }
  }catch(e){
    console.log(e)
   return res.status(500).send({Message:'Something went wrong.'})
  }
}


async function forgot(req, res) {
  try {
    let forget = joi.object({
      email: joi.string().email().required()
    })
    const { error } = forget.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }
    let { email } = req.body

    forget_user = await User.findOne({
      where: { email: email }
    })

    if (!forget_user) {
       //public message
      return res.status(422).send({ Message: 'Email address not found.' })
    }

    const access_token = jwt.sign({ id: forget_user.id, email: forget_user.email }, process.env.JWT_RESET_PASSWORD_SECRET, { expiresIn: '30m' })
   
    const verify_url = `${process.env.REDIRECT_URL}/changepassword/${access_token}`
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'rajat.brinfotech@gmail.com',
      subject: 'Reset your DeLance Password',
      html: `<h2>Click the button below to reset your password.</h2><br><a href=${verify_url}>Click here to reset your password.</a>`
    }
    sgMail
      .send(msg)
      .then(() => {
         //public message
        return res.status(200).send({ Message: 'Email has been sent. Please reset your password.' })
      })
      .catch((e) => {
         //public message
        return res.status(500).send({ Message: 'Invalid email address. Please try again.' })
      })

  }catch(e){
   return res.status(500).send({Message:'Something went wrong.'})
  }
}


async function forgotpassword(req, res) {
  try {
      let changepassword = joi.object({
        new_password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
        confirm_password: joi.ref('new_password'),
        email: joi.string().required()
    })
    const { error } = changepassword.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    let { new_password, confirm_password , email } = req.body

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(new_password, salt)

    await User.update({ password: hash }, {
      where: {
        email:email
      }
    })
     //public message
    return res.status(200).send({ Message: 'Password changed successfully.' })

  }catch(e){
    return res.status(500).send({Message:'Something went wrong.'})
  }
}


async function refreshtoken(req, res) {

    const ref = joi.object({
    ref_token: joi.string().required()
  })

  const { error } = ref.validate(req.body)

  if (error) {
    return res.status(422).send({ Message: error.details[0].message })
  }

  const { ref_token } = req.body

  try {
    const refresh = await Refresh_Token.findOne({
      where: { token: ref_token }
    })

    if (!refresh) {
       //public message
      return res.status(422).send({ Message: 'Invalid refresh token.' })
    }

    let user_Id

    try {

      const decoded = jwt.verify(refresh.token, process.env.REFRESH_SECRET)

      user_Id = decoded.id

    }catch(e){
       //public message
      return res.status(422).send({ Message: 'Invalid refresh token.' })
    }

    const user = await User.findOne({ where: { id: user_Id } })

    if (!user) {
       //public message
      return res.status(422).send({ Message: 'User not found.' })
    }

    const access_token = jwt.sign({ id: user.id, is_admin: user.is_admin, is_complete: user.is_complete, role: user.role, email: login_user.email  }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const refresh_token = jwt.sign({ id: user.id, is_admin: user.is_admin, is_complete: user.is_complete, role: user.role, email: login_user.email  }, process.env.REFRESH_SECRET, { expiresIn: '1y' })

    return res.status(200).send({ access_token, refresh_token })

  }catch(e){
   return res.status(500).send({Message:'Something went wrong.'})
  }
}


async function logout(req, res, next) {
  try {
    const logout = joi.object({
    refresh_token: joi.string().required()
    })

    const { error } = logout.validate(req.body)
    if (error) {
      return res.status(422).send({ Message: error.details[0].message })
    }

    const { refresh_token } = req.body
    await Refresh_Token.destroy(
      {
        where: { token: refresh_token }
      })
      //public message
    return res.status(200).send({ Message: 'User logged out successfully.' })   

  }catch(e){
   return res.status(500).send({Message: 'Something went wrong.'})
  }
}


async function deleterefreshtoken(req, res){
  try{

    id= req.params.id
    await Refresh_Token.destroy(
      {
        where: { id: id }
      })
      //public message
    return res.status(200).send({ Message: 'Delete refresh token.' }) 

  }catch(e){
    return res.status(500).send({Message:'Something went wrong.'})
  }
}


async function resetpassword(req, res){
 try{
     let reset_password = joi.object({
     current_password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),  
     new_password: joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")).required(),
     confirm_password: joi.ref('new_password')
  })
    const { error } = reset_password.validate(req.body)
    if (error) {
    return res.status(422).send({ Message: error.details[0].message })
   }

    user_id = req.user.id
    const { current_password, new_password, confirm_password } = req.body

    const user = await User.findOne({
       where: { id: user_id }
    })
    
   const compare = bcrypt.compareSync(current_password, user.password)
   if(!compare){
     //public message
     return res.status(422).send({ Message: 'Please enter valid credentials.' })
   }

   const salt = bcrypt.genSaltSync(10)
   const hash = bcrypt.hashSync(new_password, salt)
   await User.update(
    {
      password: hash
    },
    {
     where: {
        id: user_id
      }
   })
   //public message
   return res.status(200).send({ Message: 'Reset password successfully.' })
  }catch(e){
   console.log(e)
   return res.status(500).send({ Message: 'Something went wrong.' })
  }
}

module.exports = {
  signup,
  activate,
  login,
  resendotp,
  twofactor,
  forgot,
  forgotpassword,
  refreshtoken,
  logout,
  deleterefreshtoken,
  resetpassword
}