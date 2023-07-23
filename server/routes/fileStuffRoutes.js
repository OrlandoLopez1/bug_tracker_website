const express = require('express');
const router = express.Router();
const { uploadFile, deleteFile, getFile } = require('../s3utils');

router.use(verifyJWT);

router.route('/')
    .post(async (req, res) => {
        // Handle file upload
        const bucketName = req.body.bucketName;
        const fileName = req.body.fileName;
        const fileContent = req.body.file;

        try {
            const data = await uploadFile(bucketName, fileName, fileContent);
            res.json({ message: 'Upload success', location: data.Location });
        } catch (err) {
            console.error('Upload error', err);
            res.status(500).json({ error: 'Upload failed' });
        }
    });


router.route('/:fileName')
    .get(async (req, res) => {
        // Handle file retrieval
        const fileName = req.params.fileName;
        try {
            const data = await getFile('bugtracker-file-uploads', fileName);
            res.json({ message: 'File retrieval successful', data });
        } catch (err) {
            console.error('File retrieval error', err);
            res.status(500).json({ error: 'File retrieval failed' });
        }
    })
    .delete(async (req, res) => {
        // Handle file deletion
        const fileName = req.params.fileName;
        try {
            await deleteFile('bugtracker-file-uploads', fileName);
            res.json({ message: 'File deletion successful' });
        } catch (err) {
            console.error('File deletion error', err);
            res.status(500).json({ error: 'File deletion failed' });
        }
    })

module.exports = router;
