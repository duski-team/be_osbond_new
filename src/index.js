import { Router } from "express";

import user from "./module/user/route.js";

const router = Router()


router.use('/user', user)

export default router