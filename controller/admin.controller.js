import express from 'express';
import mongoose from 'mongoose';
import { default as adminModel } from '../models/admin.model.js';

const addAdminCredentials = async (req, res) => {
    try {
        const { admin, admincode, softcode, status } = req.body;
        console.log("Received data:", { admin, admincode, softcode, status });
        
        // Create new admin document
        const adminData = new adminModel({
            admin,
            adminCode: admincode,
            adminSoftCode: softcode,
            status,
        });

        console.log("Created admin data:", adminData);
        
        // Save to database
        await adminData.save();
        return res.status(200).json({
            message: 'Admin credentials added successfully',
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ message: 'Error in addAdminCredentials', error: error.message });
    }
};


const checkAdmin = async (req,res) => {
    try{
        const { admin,admincode } = req.body;
                const adminDataall = await adminModel.find({});
                console.log(adminDataall)

        const adminData = await adminModel.findOne({ admin: admin,adminCode:admincode });
        if(adminData) {
            return res.status(200).json({message: 'Admin found', adminData});
        }
        return res.status(404).json({message: 'Admin not found'});

    } catch(error) {
        console.error('Error:', error);
        return res.status(400).json({ message: 'Error in checkAdmin', error: error.message });
    }
}


const checkCode = async (req,res) => {
    try{
        const { admin,admincode,adminsoft } = req.body;
        const adminData = await adminModel.findOne({ admin: admin,adminCode:admincode,adminSoftCode:adminsoft });
        if(adminData) {
            return res.status(200).json({message: 'Admin found', adminData});
        }
        return res.status(404).json({message: 'Admin not found'});


    } catch(error){
        console.error('Error:', error);
        return res.status(400).json({ message: 'Error in checkCode', error: error.message });
    }
}

export { addAdminCredentials,checkAdmin,checkCode };
