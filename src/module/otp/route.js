import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
const router = Router()


router.post('/request_otp', Controller.request_otp)
router.post('/verify_otp', Controller.verify_otp)



export default router   