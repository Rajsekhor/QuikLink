const queue = require("../config/kue");

const postsMailer = require("../mailers/posts_mailer");

queue.process("emails",function(job, done){
    console.log("On post worker")
    console.log("emails worker is processing a job", job.data);
    postsMailer.newPost(job.data);
    done();
});