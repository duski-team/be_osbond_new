import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from 'multer-s3';
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

const s3 = new S3Client({
    endpoint: process.env.ENDPOINT_S3,
    credentials: {
        accessKeyId: process.env.ACCES_KEY_ID, secretAccessKey: process.env.SECRET_ACCES_KEY
    },
    region: "us-east-1",
    forcePathStyle: true
})

const s3Storage = multerS3({
    s3: s3, // s3 instance
    bucket: process.env.BUCKET_S3, // change it as per your project requirement
    acl: "public-read", // storage access type
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname })
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

// function to sanitize files and send error for unsupported files
function sanitizeFile(file, cb) {
    // Define the allowed extension
    const fileExts = [".png", ".jpg", ".jpeg", ".gif", ".csv"];

    // Check allowed extensions
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displaye in frontend
        cb("Error: File type not allowed!");
    }
}

// our middleware
const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback)
    },
    limits: {
        fileSize: 1024 * 1024 * 2 // 2mb file size
    }
}).fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }, { name: 'file4' }, { name: 'gambar' }])

export default uploadImage
