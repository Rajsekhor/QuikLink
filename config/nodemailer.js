const nodemailer=require("nodemailer");
const ejs=require('ejs');
const path=require('path');
require('dotenv').config()

let transporter=nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    post:587,
    secure:false,
    auth:{
        user:process.env.MailerEmail,
        pass:process.env.MailerPass
    }
});

let renderTemplate=(data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){console.log('error in rendering template');
            return;    
        }
        mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}