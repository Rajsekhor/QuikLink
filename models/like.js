const mongoose=require('mongoose');

const likeSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.ObjectId,
      },
      // this defines the object id of the liked object.
      likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: "onModel",
      },
      // this field is used for defining the type of liked object since this is a dynamic reference.
      onModel: {
        type: String,
        required: true,
        enum: ["Post", "Comment"], // ensures that likeable can only be either of Post or Comment.
      },
    },
    {
      timestamps: true,
    }
  );
  likeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31104000 });

  const Like = mongoose.model("Like", likeSchema);
  module.exports = Like;