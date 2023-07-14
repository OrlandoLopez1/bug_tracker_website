const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

function uploadFile(bucketName, fileName, fileContent) {
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent
    };

    return s3.upload(uploadParams).promise()
        .catch(error => {
            console.error('Error during file upload:', error);
            throw error;
        });
}


function getFile(bucketName, fileName) {
    var getParams = {
        Bucket: bucketName,
        Key: fileName
    };

    return s3.getObject(getParams).promise();
}

function deleteFile(bucketName, fileName) {
    var deleteParams = {
        Bucket: bucketName,
        Key: fileName
    };

    return s3.deleteObject(deleteParams).promise();
}

async function testS3Connection() {
    const bucketParams = {
        Bucket: "bugtracker-file-uploads"
    };

    try {
        const data = await s3.headBucket(bucketParams).promise();
        console.log("Connection to S3 successful.");
    } catch (error) {
        console.log("Error connecting to S3: ", error);
    }
}

testS3Connection();
module.exports = { uploadFile, getFile, deleteFile };
