import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
    {
        user: {type : Schema.Types.ObjectId, ref: 'user'},
        id_post: {type: Schema.Types.ObjectId, ref: 'post'},
        content: {type: String, required: true},
    },
    { timestamps: true }
  
);


const Comment = mongoose.model('comment', commentSchema);
export default Comment;