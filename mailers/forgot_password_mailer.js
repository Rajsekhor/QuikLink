const nodeMailer=require('../config/nodemailer');
const queue = require("../config/kue");

exports.PasswordEmail=(password)=>{

    const emailContent = `
    <h1>Your Password</h1>
    <p>Dear User,</p>
    <p>We have received a request to retrieve your password. Here is your password:</p>
    <h2>${password.content}</h2>
    <p>If you did not make this request or believe it to be a mistake, we recommend that you change your password immediately to ensure the security of your account.</p>
    <p>Thank you for using our services.</p>
    <p>Sincerely,</p>
    <p>The QuikLink Team</p>
  `;

    nodeMailer.transporter.sendMail({
        from:'QuikLink',
        to:password.email,
        subject:"Your password!",
        html:emailContent
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
    });
}