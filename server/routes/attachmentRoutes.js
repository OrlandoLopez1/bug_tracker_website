const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/AttachmentController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/:id')
    .delete(attachmentController.deleteAttachment);

router.route('/ticket/:ticketId')
    .get(attachmentController.getAttachmentsForTicket);

router.route('/presign')
    .get(attachmentController.getPresignedUrlPut);

router.route('/presign-get')
    .get(attachmentController.getPresignedUrlGet);

router.route('/presign-delete')
    .get(attachmentController.getPresignedUrlDelete);



module.exports = router;
