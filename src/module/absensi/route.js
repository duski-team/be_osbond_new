import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js"
const router = Router()



router.post('/register', Controller.register)
router.post('/update', Controller.update)
router.post('/list', Controller.list)

export default router