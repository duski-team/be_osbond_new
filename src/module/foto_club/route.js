import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js"
const router = Router()


router.post('/register', authentification, uploadImage, Controller.register)
router.post('/update', authentification, uploadImage, Controller.update)
router.post('/list', Controller.list)
router.post('/delete', authentification, Controller.delete)



export default router