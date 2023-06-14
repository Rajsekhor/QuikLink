const express=require('express');

const router =express.Router();
const chatsController=require('../controllers/chats_controller');

router.get('/private-chat',chatsController.chatStandby);
router.post('/addChat',chatsController.addChat);
router.get('/private-chat/:id/:target',chatsController.chatStart);

module.exports=router;