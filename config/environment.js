const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");
require('dotenv').config()

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// using rfs.createStream instead of rfs. Update in the rfs library.
const accessLogStream = rfs.createStream("access.log",{
    interval: '1d',
    path: logDirectory,
})

const development = {
    name: "development",
    asset_path: "/assets",
    session_cookie_key: "quiklinkcookie",
    db: "quiklink",
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MailerEmail,
            pass: process.env.MailerPass,
        },
    },
    google_client_id: process.env.ClientID,
    google_client_secret: process.env.clientSecret,
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: "quiklinksecret",
    morgan: {
        mode: "dev",
        options: {stream: accessLogStream}
    }
}
const production = {
    name: "production",
    asset_path: process.env.QUIKLINK_ASSET_PATH,
    session_cookie_key: process.env.QUIKLINK_SESSION_COOKIE_KEY,
    db: process.env.QUIKLINK_DB,
    smtp: {
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.QUIKLINK_GMAIL_USERNAME,
            pass: process.env.QUIKLINK_GMAIL_PASSWORD,
        },
    },
    google_client_id: process.env.QUIKLINK_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.QUIKLINK_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.QUIKLINK_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.QUIKLINK_JWT_SECRET,
    morgan: {
        mode: "combined",
        options: {stream: accessLogStream}
    }
}


// module.exports = development;   
module.exports = eval(process.env.QUIKLINK_ENVIRONMENT == undefined ? development : eval(process.env.QUIKLINK_ENVIRONMENT));