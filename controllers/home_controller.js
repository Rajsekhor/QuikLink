const Post = require("../models/post");
const User = require("../models/user");

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
    let posts=await Post.find({}).populate('user').populate({
      path:"comments",
      populate:{
        path:'user'
      }
    });

    let users=await User.find({});

    return res.render('home',{
      title:"QuikLink | Home",
      posts:posts,
      all_users:users
    })
  }catch(err){
    console.log("Error",err);
    return;
  }
}