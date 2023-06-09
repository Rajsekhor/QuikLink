const nodeMailer=require('../config/nodemailer');
const queue = require("../config/kue");

exports.newComment=(comment)=>{

    nodeMailer.transporter.sendMail({
        from:'QuikLink',
        to:comment.user.email,
        subject:"New Comment Published!",
        html:'<h1>Yup, your comment is now published!</h1>'
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
    });
}