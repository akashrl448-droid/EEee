const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

// Read Twilio credentials from environment variables
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const twilioNumber = process.env.TWILIO_FROM;

if(!accountSid || !authToken || !twilioNumber){
    console.log("❌ Please set TWILIO_SID, TWILIO_AUTH, TWILIO_FROM environment variables");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

// Your verified phone number
const contactNumbers = [
    "+916383117046"
];

app.post("/send-alert", async (req, res) => {
    try {
        for (const number of contactNumbers) {
            await client.messages.create({
                body: "ALERT: Obstacle detected at railway crossing.",
                from: twilioNumber,
                to: number
            });
        }
        res.json({ status: "Alert sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
