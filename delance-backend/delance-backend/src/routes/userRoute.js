const express = require('express')
const router = express.Router()
const multer = require('multer')
const userController = require('../controller/userController')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  //reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})


router.get('/getprofiledetails',userController.profiledetails)
router.put('/completeprofile', userController.completeprofile)
router.post('/profilepic', upload.single('image'), userController.profilepic)
router.get('/getprofile', userController.getprofile)
router.post('/review/:id', userController.reviews)
router.get('/getreview', userController.getreviews)
router.get('/getjobcategory', userController.getjobcategory)
router.get('/getskill', userController.getskill)
router.get('/getcurrency', userController.getcurrency)
router.get('/search-freelancer-by-name', userController.searchfreelancerbyname)
router.get('/search-freelancer-by-skill', userController.searchfreelancerbyskills)
router.get('/search-job-by-id', userController.searchjobbyid)
router.put('/updateprofile', userController.updateprofile)
router.get('/get-city',userController.getcity)
router.get('/get-all-university',userController.getalluniversity)
router.get('/get-all-course',userController.getallcourse)
router.get('/get-all-job-title',userController.getalljobtitle)
router.get('/get-all-blog-post',userController.getallblogpost)
router.post('/post-comment',userController.postcomment)
router.post('/post-like',userController.postlike)
router.delete('/post-unlike',userController.postunlike)
router.delete('/delete-post-comment',userController.deletepostcomment)

module.exports = router