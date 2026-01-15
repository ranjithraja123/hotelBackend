import express from 'express'
import uploadMultipleRooms from '../multer/roomConfig.js'; // Importing the middleware
import { addRooms, deleteRoomById, getReviews, getRooms, getRoomsById, requestMail, userReviews } from '../controller/rooms.controller.js';
const router = express.Router();

router.post('/addrooms',uploadMultipleRooms, addRooms)
router.get('/getRooms',getRooms)
router.post('/deleteRoomById',deleteRoomById)
router.post('/getRoomsById',getRoomsById)

router.post('/requestMail',requestMail)
router.post('/reviews',userReviews)
router.get('/getReviews',getReviews)





export default router