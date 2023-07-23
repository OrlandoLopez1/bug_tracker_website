const express = require('express');
const router = express.Router();
const commentController = require('../controllers/CommentController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .post(commentController.addComment);

router.route('/:id')
    .get(commentController.getComment)
    .put(commentController.updateComment)
    .delete(commentController.deleteComment);

router.route('/ticket/:ticketId')
    .get(commentController.getCommentsForTicket);

router.route('/:id/reply')
    .post(commentController.addReplyToComment);

router.route('/:id/upvote')
    .post(commentController.upvoteComment);

module.exports = router;
