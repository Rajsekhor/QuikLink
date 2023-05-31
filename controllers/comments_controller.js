const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function (req, res) {
  Post.findById(req.body.post, function (error, post) {
    if (post) {
      Comment.create(
        {
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        },
        function (error, comment) {
          // handle error
          post.comments.push(comment);
          post.save();

          res.redirect("/");
        }
      );
    }
  });
};