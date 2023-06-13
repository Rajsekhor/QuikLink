const queue = require("../config/kue");

const passwordMailer = require("../mailers/forgot_password_mailer");

queue.process("forget_password",function(job, done){
    console.log("On forget password worker")
    console.log("emails worker is processing a job", job.data);
    passwordMailer.PasswordEmail(job.data);
    done();
});