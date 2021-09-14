const express = require('express')
const router = express.Router()
const jobpostController = require('../controller/jobpostController')


router.post('/jobpost', jobpostController.jobpost)
router.get('/get-jobpost', jobpostController.getjobpost)
router.post('/proposal-post', jobpostController.proposalpost)
router.get('/getproposalpost', jobpostController.getproposalspost)
router.put('/edit-proposalpost', jobpostController.editproposalpost)
router.delete('/delete-proposalpost', jobpostController.deleteproposalpost)
router.post('/dispute/:id', jobpostController.disputes)
router.get('/get-order-status/:id', jobpostController.getorderstatus)
router.get('/get-order-completed-list', jobpostController.getordercompleted)
router.get('/manage_bidders', jobpostController.managebidders)
router.post('/hire-freelancer', jobpostController.hirefreelancer)
router.post('/accept-offer/:client_email/:freelancer_email', jobpostController.acceptoffer)
router.post('/reject-offer/:client_email', jobpostController.rejectoffer)
router.post('/decline-proposal', jobpostController.declineproposal)

module.exports = router