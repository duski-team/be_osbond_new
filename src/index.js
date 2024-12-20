import { Router } from "express";

import user from "./module/user/route.js";
import otp from "./module/otp/route.js";
import banner from "./module/banner/route.js";
import berita from "./module/berita/route.js";
import broadcast from "./module/broadcast/route.js";
import club from "./module/club/route.js"
import foto_club from "./module/foto_club/route.js"

const router = Router()


router.use('/user', user)
router.use('/otp', otp)
router.use('/banner',banner)
router.use('/berita',berita)
router.use('/broadcast',broadcast)
router.use('/club',club)
router.use('/foto_club',foto_club)

export default router