const AWS = require('aws-sdk');
const Attachment = require('../models/Attachment');
const Ticket = require('../models/Ticket');
const asyncHandler = require('express-async-handler');
const s3 = new AWS.S3({/*...Your configuration here...*/})


// @desc Get attachments for a specific ticket
// @route GET /attachments/ticket/:ticketId
// @access Private
const getAttachmentsForTicket = asyncHandler(async (req, res) => {
    const { ticketId } = req.params;
    const attachments = await Attachment.find({ ticket: ticketId });
    console.log(`Fetching attachments for ticket: ${ticketId}`);
    console.log(attachments);
    res.json(attachments);
});


// @desc Get a presigned URL for uploading an attachment to S3
// @route GET /attachments/presign
// @access Private
const getPresignedUrlPut = asyncHandler(async (req, res) => {
    const key = req.query.filename;
    const fileType = req.query.filetype;

    const params = {
        Bucket: 'bugtracker-file-uploads',
        Key: key,
        Expires: 60,
        ContentType: fileType,
        ACL: 'private'
    };

    s3.getSignedUrl('putObject', params, function(err, url) {
        if(err){
            console.log(err);
            res.status(500).json({error: "Failed to generate presigned URL"});
        } else {
            res.status(200).json({url: url});
        }
    });
});

// @desc Get a presigned URL for reading an attachment from S3
// @route GET /attachments/presign-get
// @access Private
const getPresignedUrlGet = asyncHandler(async (req, res) => {
    const key = req.query.filename;

    const params = {
        Bucket: 'bugtracker-file-uploads',
        Key: key,
        Expires: 60,
    };

    s3.getSignedUrl('getObject', params, function(err, url) {
        if(err){
            console.log(err);
            res.status(500).json({error: "Failed to generate presigned URL"});
        } else {
            res.status(200).json({url: url});
        }
    });
});

// @desc Get a presigned URL for deleting an attachment from S3
// @route GET /attachments/presign-delete
// @access Private
const getPresignedUrlDelete = asyncHandler(async (req, res) => {
    const key = req.query.filename;

    const params = {
        Bucket: 'bugtracker-file-uploads',
        Key: key,
        Expires: 60,
    };

    s3.getSignedUrl('deleteObject', params, function(err, url) {
        if(err){
            console.log(err);
            res.status(500).json({error: "Failed to generate presigned URL"});
        } else {
            res.status(200).json({url: url});
        }
    });
});


// @desc Delete an attachment from S3 and database
// @route DELETE /attachments/:id
// @access Private
const deleteAttachment = asyncHandler(async (req, res) => {
    const attachmentId = req.params.id;
    const attachment = await Attachment.findById(attachmentId);

    if (!attachment) {
        res.status(404);
        throw new Error('Attachment not found');
    }

    // Delete the file from the S3 bucket
    const params = {
        Bucket: 'bugtracker-file-uploads',
        Key: attachment.filename,
    };

    s3.deleteObject(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            res.status(500).json({error: "Failed to delete attachment from S3"});
        } else {
            console.log(data);
        }
    });

    // Delete the attachment from the database
    // console.log()
    // Find the related ticket and remove the attachment reference from it
    await Ticket.updateOne(
        { _id: attachment.ticket },
        { $pull: { attachments: attachmentId } }
    );
    await Attachment.findByIdAndDelete(attachmentId);

    res.status(200).json({ message: 'Attachment deleted successfully' });
});


module.exports = {
    getAttachmentsForTicket,
    getPresignedUrlPut,
    getPresignedUrlGet,
    getPresignedUrlDelete,
    deleteAttachment
};