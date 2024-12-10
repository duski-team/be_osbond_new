
import multer from 'multer'

const storage = multer.diskStorage({
    destination: './asset/file/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({
    storage: storage
}).fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }, { name: 'file4' },{ name: 'gambar' }])

export default  upload