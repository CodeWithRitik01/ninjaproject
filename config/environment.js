const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});


 const development = {
    name: 'development',
    asset_path : '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codeal_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: 'rkritik.9958',
            pass: 'azcn kngc icra xvdm'
        }
    },
    google_client_id:"41568065850-b310fjkmq2m308jtq3n4b3g2q1v980n7.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codeal',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
 }


 const production = {
    name: 'production',
    asset_path : process.env.CODEAL_ASSET_PATH,
    session_cookie_key: process.env.CODEAL_SESSION_COOKIE_KEY,
    db: process.env.CODEAL_DB,
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.CODEAL_GMAIL_USERNAME,
            pass:process.env.CODEAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
 }



 module.exports = eval(process.env.CODEAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEAL_ENVIRONMENT);