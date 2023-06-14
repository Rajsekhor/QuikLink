const User = require('../models/user');
const Chat=require('../models/private_chat');

module.exports.chatStandby=async (req,res)=>{
    try {
        let users = await User.find({}).select('name email _id');
        res.render('private-chat', { users,
        title:"QuikLink | Private Chat",
        chatReady:false,
        target:"",
        messages:{},
        users:users,
     });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports.chatStart=async (req,res)=>{
    try {
        const {id,target}=req.params;
        let users = await User.find({}).select('name email _id');

        const messages = await Chat.find({
            users: {
              $all: [id, target],
            },
          }).sort({ updatedAt: 1 });
        const user = await User.find({});
        res.render('private-chat', { user,
        title:"QuikLink | Private Chat",
        chatReady:true,
        target:req.params.target,
        messages:messages,
        users:users,

     });
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
}

module.exports.addChat=async(req,res)=>{
    try{
        const {message,userId,targetId}=req.body;
        const data=await Chat.create({
            message:{text:message},
            users:[userId,targetId],
            sender:userId
        })
        if(data){
            console.log("Data: ",data)
        }
        else{
            console.log("Error encountered")
        }
        res.redirect("back")
    }catch(err){
        console.log("Error: ",err)
    }
}