import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "../Backend/route/user.route.js";
import cors from "cors";
import twilio from "twilio";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Connect to MongoDB
try {
    mongoose.connect(process.env.MONGO_URI || "mongodb+srv://auxin:auxin@cluster0.4seli.mongodb.net/");
    console.log("connected to mongodb!");
} catch (error) {
    console.log("Error:", error);
}

// Twilio configuration
const accountSid = "AC6dc9e10d7e76bdc2cd2e5aa3c572d5c9";
const authToken = "bb82f93cc824b4c09c107cac0d97ed54";
const twilioPhoneNumber = "+15097403251";

const twilioClient = twilio(accountSid, authToken);

// Route to trigger SOS via voice call
app.post('/callSOS', async (req, res) => {
    const { latitude, longitude } = req.body;
    const phoneNumber = '+919621214402'; // Indian number with country code
    
    try {
        // Create TwiML using string template
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

        // Create call with inline TwiML
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

// Use the existing user routes
app.use("/user", userroute);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});