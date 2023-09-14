const { Schema, model } = require('mongoose');

const ReviewSchema = new Schema({
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    wonder:{
        type: Schema.Types.ObjectId,
        ref: 'Wonder'
    }
    },
    {
    timestamps: true,
  }
);

module.exports = model("Review", ReviewSchema);