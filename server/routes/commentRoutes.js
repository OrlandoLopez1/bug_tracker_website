const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .post(commentController.addComment);

router.route('/:commentId')
    .get(commentController.getComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

router.route('/ticket/:ticketId')
    .get(commentController.getCommentsForTicket);

module.exports = router;
