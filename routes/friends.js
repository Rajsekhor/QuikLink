const express=require('express');

const router =express.Router();
const FriendController=require('../controllers/friends_controller');
router.post('/addFriend',FriendController.addFriend);
router.post('/removeFriend',FriendController.removeFriend);

module.exports=router;