const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    capsule: {
      type: Schema.Types.ObjectId,
      ref: "Capsule",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;

