import { Router } from "express";
import { Controller } from './controller.js'
import authentification from "../../middleware/authentification.js";
import upload from "../../helper/upload.js";
import uploadImage from "../../helper/uploadImage.js";
const router = Router()


router.post('/login', Controller.login)
router.post('/register', uploadImage, Controller.register)
router.post('/update', Controller.update)
router.post('/list', Controller.list)
router.post('/change_password', Controller.change_password)
router.post('/reset_password', Controller.reset_password)
router.post('/me',authentification, Controller.me)
router.post('/list_member_aktif',authentification, Controller.list_member_aktif)
router.post('/member_by_code', Controller.member_by_code)
router.post('/search',authentification,Controller.search)
router.post('/list_pembelian_produk',authentification,Controller.list_pembelian_produk)
router.post('/list_pembelian_pt',authentification,Controller.list_pembelian_pt)


export default router