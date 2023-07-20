const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/AttachmentController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .post(attachmentController.addAttachment);

router.route('/:id')
    // .get(attachmentController.getAttachment)
    // .put(attachmentController.updateAttachment)
    // .delete(attachmentController.deleteAttachment);

router.route('/ticket/:ticketId')
    .get(attachmentController.getAttachmentsForTicket);

module.exports = router;
