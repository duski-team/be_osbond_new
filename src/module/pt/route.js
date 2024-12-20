import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js"
const router = Router()



router.post('/list', Controller.list)
router.post('/details_by_club_id', Controller.details_by_club_id)
router.post('/sync_pt', Controller.sync_pt)

export default router