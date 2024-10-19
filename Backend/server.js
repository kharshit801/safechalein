import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "../Backend/route/user.route.js";
import cors from "cors";
import twilio from "twilio";  // Import Twilio

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
const accountSid = 'AC5dd9309b12e293439fe18caf110cc8be';
const authToken = 'bb82f93cc824b4c09c107cac0d97ed54';   // Twilio secret from the image
const twilioClient = twilio(accountSid, authToken);

// Route to trigger SOS via voice call
app.post('/callSOS', async (req, res) => {
    const { latitude, longitude } = req.body;
    const phoneNumber = '9621214402'; // Testing number

    if (!latitude || !longitude) {
        return res.status(400).send('Missing location data');
    }

    try {
        const response = await twilioClient.calls.create({
            twiml: `<Response><Say>This is an emergency! My location is Latitude: ${latitude}, Longitude: ${longitude}. Please send help.</Say></Response>`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
        });
        console.log(`SOS call initiated with SID: ${response.sid}`);
        res.status(200).send('SOS call initiated successfully');
    } catch (err) {
        console.error('Error initiating SOS call:', err);
        res.status(500).send('Failed to initiate SOS call');
    }
});

// Use the existing user routes
app.use("/user", userroute);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
