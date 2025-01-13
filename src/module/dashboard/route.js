import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js"
const router = Router()



router.post('/member_aktif_perbulan',authentification, Controller.member_aktif_perbulan)
router.post('/daily_check_in', authentification,Controller.daily_check_in)
router.post('/new_member', authentification,Controller.new_member)

export default router