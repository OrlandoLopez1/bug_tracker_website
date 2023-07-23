const AWS = require('aws-sdk');
const Attachment = require('../models/Attachment');
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
    console.log('getPresignedUrlGet route hit');  // Debugging log statement
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

module.exports = {
    getAttachmentsForTicket,
    getPresignedUrlPut,
    getPresignedUrlGet,
    getPresignedUrlDelete
};