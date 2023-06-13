const nodeMailer=require('../config/nodemailer');
const queue = require("../config/kue");

exports.newPost=(post)=>{

    nodeMailer.transporter.sendMail({
        from:'QuikLink',
        to:post.user.email,
        subject:"New Post Published!",
        html:'<h1>Yup, your post is now published!</h1>'
    },(err,info)=>{
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
    });
}