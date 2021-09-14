const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const auth = require('../../middlewares/auth')

router.post('/signup', authController.signup)
router.get('/activate/:access_token', authController.activate)
router.post('/login', authController.login)
router.put('/resend-otp',authController.resendotp)
router.post('/two-factor', authController.twofactor)
router.post('/forgot', authController.forgot)
router.put('/forgot-password', authController.forgotpassword)
router.post('/refresh', authController.refreshtoken)
router.delete('/logout', auth, authController.logout)
router.delete('/delete-refresh-token/:id',authController.deleterefreshtoken)
router.put('/reset-password', auth, authController.resetpassword)

module.exports = router
