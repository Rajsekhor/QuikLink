const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/posts");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },postImage: {
      type: String,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like'
    }]
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", AVATAR_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// static methods
// single means just one file will be uploaded
postSchema.statics.uploadedPostImage = multer({storage: storage}).single("postImage");
postSchema.statics.PostImagePath = AVATAR_PATH;


// Set TTL index on the createdAt field with a time to live of 24 hours (86400 seconds)
postSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1814400 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
