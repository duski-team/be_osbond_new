import { Router } from "express";

import user from "./module/user/route.js";
import otp from "./module/otp/route.js";

const router = Router()


router.use('/user', user)
router.use('/otp', otp)

export default router