import roomsModel from "../models/rooms.model.js"
import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer'
import ejs from 'ejs'
import moment from 'moment-timezone'
import { fileURLToPath } from "url";
import reviewModel from "../models/review.model.js";
import inquiryModel from "../models/inquiry.model.js";


const addRooms = async (req, res) => {
    try {
        const { roomtype, amenities, members, availablities, areaInSqft, itemsprovided } = req.body
        if (!roomtype || !amenities || !members) {
            return res.status(400).json({ message: "Please fill in all fields." })
        }
        // let filepaths = []
        // if (req.files) {

        //     let sourceFiles = req.files
        //     filepaths = sourceFiles.map((file) => path.relative('E:/Hotel/Uploads', file.path));
        // }

        let images = [];

        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => (file.path));
        }


        const newRooms = new roomsModel({
            roomType: roomtype,
            amenities: amenities,
            members: members,
            filepaths: images,
            availabilities: availablities,
            areaInSqft: areaInSqft,
            itemsProvided: itemsprovided
        })
        await newRooms.save()
        return res.status(200).json({ message: "Success", newRooms })
    } catch (error) {
        return res.status(400).json({ message: 'Error in addRooms', error: error.message });

    };

}


const createInquiry = async (req, res) => {
    try {
        const {
            fromDate,
            toDate,
            email,
            phoneNumber,
            adults,
            children,
            roomType,
        } = req.body;

        if (!fromDate || !toDate || !email || !phoneNumber || !adults || !roomType) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        const inquiry = await inquiryModel.create({
            fromDate,
            toDate,
            email,
            phoneNumber,
            adults,
            children,
            roomType,
        });

        res.status(201).json({
            success: true,
            message: "Inquiry submitted successfully",
            data: inquiry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}



const getAllInquiries = async (req, res) => {
    try {
        const inquiries = await inquiryModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};



const getRooms = async (req, res) => {
    try {
        const existingRooms = await roomsModel.find({})
        if (!existingRooms) {
            return res.status(404).json({ message: "No rooms found." })
        }
        return res.status(200).json({ message: "Success", existingRooms })

    } catch (error) {
        return res.status(400).json({ message: 'Error in addRooms', error: error.message });
    }
}

const getRoomsById = async (req, res) => {
    try {
        const { id } = req.body
        const existingRooms = await roomsModel.findOne({ _id: id })
        if (!existingRooms) {
            return res.status(404).json({ message: "No rooms found." })
        }
        return res.status(200).json({ message: "Success", existingRooms })

    } catch (error) {
        return res.status(400).json({ message: 'Error in addRooms', error: error.message });
    }
}


const deleteRoomById = async (req, res) => {
    try {
        const { id } = req.body
        await roomsModel.findByIdAndDelete(id)

        return res.status(200).json({ message: "Deleted Successfully" })
    } catch (error) {
        return res.status(400).json({ message: 'Error in deleteRoomById', error: error.message });
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const requestMail = async (req, res) => {
    try {
        const { from, to, email, phno, adult, children, room } = req.body;

        if (!from || !to || !email || !phno || !adult || !children || !room) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { success: false, message: "Valid email format required" };
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "Gmail", // Use any other SMTP service if needed
            auth: {
                user: "ranjithraja413@gmail.com", // Replace with your email
                pass: "nywx pfrh daai ytzv", // Use an app password if needed
            },
        });

        const localtimeFrom = moment.tz(from, "Asia/Kolkata").format("YYYY-MM-DD");
        const localtimeTo = moment.tz(to, "Asia/Kolkata").format("YYYY-MM-DD");


        const templatepath = path.join(__dirname, "..", "views", "requestMail.ejs")
        const htmlContent = await ejs.renderFile(templatepath, { localtimeFrom, localtimeTo, email, phno, adult, children, room })

        // Email options
        const mailOptions = {
            from: "ranjithraja413@gmail.com",
            to: email,
            subject: "Room Booking Request",
            html: htmlContent,
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent successfully", info });
    } catch (error) {
        return res.status(400).json({ message: "Error in requestMail", error: error.message });
    }
};


const userReviews = async (req, res) => {
    try {
        const { name, feedback } = req.body;
        if (!name || !feedback) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }

        const reviews = await reviewModel.create({ name, feedback });

        return res.status(200).json({ message: "Review added successfully" });

    } catch (error) {
        return res.status(400).json({ message: "Error in requestMail", error: error.message });
    }
}

const getReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({});
        console.log(reviews)

        return res.status(200).json({ reviews, message: "Success" });

    } catch (error) {
        return res.status(400).json({ message: "Error in requestMail", error: error.message });
    }
}






export { getAllInquiries, createInquiry, addRooms, getRooms, deleteRoomById, getRoomsById, requestMail, userReviews, getReviews };
