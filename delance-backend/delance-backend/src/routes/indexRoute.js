const express = require('express')
const router = express.Router()
const authRouter = require('./authRoute')
const userRoute = require('./userRoute')
const adminRoute = require('./adminRoute')
const jobpostRoute = require('./jobpostRoute')
const auth = require('../../middlewares/auth')

router.use('/api', authRouter)
router.use('/api/user', auth, userRoute)
router.use('/api/admin', auth, adminRoute)
router.use('/api/job', auth, jobpostRoute)



module.exports = router



