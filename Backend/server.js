import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "./route/user.route.js"; // Fixed path
import cors from "cors";
import twilio from "twilio";

dotenv.config();
const app = express();

// CORS and middleware setup
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB connection with retry logic
const connectDB = async () => {
    let retries = 5;
    while (retries) {
        try {
            await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://auxin:auxin@cluster0.4seli.mongodb.net/");
            console.log("Connected to MongoDB!");
            break;
        } catch (error) {
            console.log(`MongoDB connection attempt failed. Retries left: ${retries}`);
            retries -= 1;
            // Wait for 5 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

connectDB();

// Twilio configuration with environment variables
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID || "AC6dc9e10d7e76bdc2cd2e5aa3c572d5c9",
    process.env.TWILIO_AUTH_TOKEN || "bb82f93cc824b4c09c107cac0d97ed54"
);

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Route to trigger SOS via voice call
app.post('/callSOS', async (req, res) => {
    const { latitude, longitude } = req.body;
    const phoneNumber = '+919621214402';
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "+15097403251";
    
    try {
        const twimlString = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say voice="alice" language="en-IN">
                This is an emergency alert from Team Auxin. A user needs immediate assistance.
            </Say>
            <Pause length="1"/>
            <Say voice="alice" language="en-IN">
                The user's location coordinates are: Latitude ${latitude}, Longitude ${longitude}. Please send help immediately.
            </Say>
        </Response>`;

        const call = await twilioClient.calls.create({
            twiml: twimlString,
            to: phoneNumber,
            from: twilioPhoneNumber,
        });
        
        console.log(`SOS call initiated with SID: ${call.sid}`);
        res.status(200).json({ 
            message: 'SOS call initiated successfully', 
            callSid: call.sid,
            location: { latitude, longitude }
        });
        
    } catch (err) {
        console.error('Error initiating SOS call:', err);
        res.status(500).json({ 
            error: 'Failed to initiate SOS call', 
            details: err.message 
        });
    }
});

// User routes
app.use("/user", userroute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});