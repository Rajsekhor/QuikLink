const Post = require("../models/post");
const User = require("../models/user");
const Friendship = require('../models/friendship');

//  module.exports.home = function (request, response) {
//   console.log("Home controller action is working");

//   // Populate the user of each post.
//   Post.find({})
//     .populate("user")
//     .populate({
//       path: "comments",
//       populate: {
//         path: "user",
//       },
//     })
//     .exec(function (error, posts) {
//       User.find({}, function (error, users) {
//         if (error) {
//           return response.render("back");
//         }
//         return response.render("home", {
//           title: " Home",
//           posts: posts,
//           all_users: users,
//         });
//       });
//     });
// };

module.exports.home=async function(req,res){
  try{
    let userSearch = await User.find({}).select('name email _id');
    let posts=await Post.find({}).populate('user').populate({
      path:"comments",
      populate:{
        path:'user'
      }
    }).populate({
      path: 'comments',
      populate: {
          path: 'likes'
      }
  }).populate('likes');

    let user=await User.find({});
    let allFriends=await Friendship.find({});

    return res.render('home',{
      title:"QuikLink | Home",
      posts:posts,
      all_users:user,
      userSearch:userSearch,
      allFriends:allFriends
    })
  }catch(err){
    console.log("Error",err);
    return;
  }
}