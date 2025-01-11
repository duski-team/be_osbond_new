import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js";
const router = Router()


router.post('/register', Controller.register)
router.post('/update', authentification, Controller.update)
router.post('/list', Controller.list)
router.post('/delete', authentification, Controller.delete)
router.post('/cek_referral', Controller.cek_referral)



export default router