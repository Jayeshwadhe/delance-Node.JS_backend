const express = require('express')
const router = express.Router()
const multer = require('multer')
const adminController = require('../controller/adminController')

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
  

router.post('/add-job-category', adminController.addjobcategory)
router.post('/add-skill', adminController.addskill)
router.post('/add-currency', adminController.addcurrency)
router.get('/show-client', adminController.showclient)
router.get('/show-freelancer', adminController.showfreelancer)
router.get('/show-both', adminController.showboth)
router.put('/update-user/:id', adminController.updateuser)
router.post('/block-user/:id', adminController.blockuser)
router.delete('/delete-user/:id', adminController.deleteuser)
router.put('/unblock-user/:id', adminController.unblockuser)
router.post('/add-user', adminController.adduser)
router.post('/add-job-post',adminController.addjobpost)
router.delete('/delete-job-post/:id',adminController.deletejobpost)
router.put('/update-job-post/:id',adminController.updatejobpost)
router.get('/get-dispute',adminController.getdispute)
router.post('/add-university',adminController.adduniversity)
router.post('/add-course',adminController.addcourse)
router.post('/add-job-title',adminController.addjobtitle)
router.post('/blog-post', adminController.blogpost)
router.post('/blog-post-image',upload.single('image'), adminController.blogpostimage)
router.put('/edit-blog-post',adminController.editblogpost)
router.delete('/delete-blog-post',adminController.deleteblogpost)

module.exports = router