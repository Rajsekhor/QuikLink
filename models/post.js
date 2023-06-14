const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// Set TTL index on the createdAt field with a time to live of 24 hours (86400 seconds)
postSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1814400 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
