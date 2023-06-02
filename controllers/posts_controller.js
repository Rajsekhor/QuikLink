const Post = require("../models/post");
const Comment=require('../models/comment')

// module.exports.create = function (req, res) {
//   Post.create(
//     {
//       content: req.body.content,
//       user: req.user._id,
//     },
//     function (error, post) {
//       if (error) {
//         console.log("Error in creating a post");
//         return;
//       }
//       return res.redirect('back');
//     }
//   );
// };

// module.exports.destroy=function(req,res){
//   Post.findById(req.params.id,function(err,post){
//     if(post.user==req.user.id){
//       post.remove();
//       Comment.deleteMany({post:req.params.id},function(err){
//         return res.redirect('back');
//       });
//     }else{
//       return res.redirect('back');
//     }
//   });
// }

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    })


    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post created!"
      }); 
  }

    req.flash("success", "Post published!");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    console.log(req.params);
    let post = await Post.findById(req.params.id);
    console.log("Found post:", post);

    if (post.user == req.user.id) {
      console.log("User is authorized to delete the post");

      // .id means converting the object id(._id) into string.
      post.remove();
      await Comment.deleteMany({ post: req.params.id });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Post and associated comments deleted!");
      return res.redirect("back");
    } else {
      req.flash("error", "You cannot delete this post!");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("Error:", error);
    req.flash("error", error);
    return res.redirect("back");
  }
};
