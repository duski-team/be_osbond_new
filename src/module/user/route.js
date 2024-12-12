import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js";
const router = Router()


router.post('/login', Controller.login)
router.post('/register', uploadImage, Controller.register)
router.post('/list', Controller.list)


export default router