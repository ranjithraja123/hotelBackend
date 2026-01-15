import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import adminRoute from './routes/admin.routes.js';
import roomRoute from './routes/rooms.routes.js';


dotenv.config();

const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: true, // Fixed typo from "orgin" to "origin"
};

const uploadsDir = process.env.ROOM_PATH;

// Routes

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use('/uploads', express.static('E:/Hotel/Uploads'));
// app.use(cookieParser()); // Uncomment if you need cookie-parser
// app.use('/api/v1/auth', authRoute);
// app.use('/api/v1/users', userRoute);
// app.use('/api/v1/doctors', doctorRoute);
// app.use('/api/v1/reviews', reviewRoute);
// app.use('/api/v1/bookings', bookingRoute);
app.use('/admin', adminRoute);
app.use('/rooms',roomRoute)

app.get('/', (req, res) => {
    res.send('App Started');
});

mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB is connected');
    } catch (err) {
        console.log('Connection failed', err);
    }
};

app.listen(port, () => {
    connectDB();
    console.log('ROOM_PATH:', process.env.ROOM_PATH);

    console.log('Server is running on port '+port);
});
