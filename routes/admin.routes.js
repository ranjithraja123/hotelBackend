import express from 'express'
import { addAdminCredentials, checkAdmin, checkCode } from '../controller/admin.controller.js';
const router = express.Router();

router.post('/addAdminCredentials', addAdminCredentials)

router.post('/checkAdmin', checkAdmin)

router.post('/checkCode', checkCode)


export default router