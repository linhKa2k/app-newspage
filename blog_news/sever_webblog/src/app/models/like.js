import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const likeSchema = new mongoose.Schema(
    {
      iduser: { type: Schema.Types.ObjectId, ref: 'user' },
      idpost: { type: Schema.Types.ObjectId, ref: 'post' }  
    },
    { timestamps: true }
  
);
const Like = mongoose.model('like', likeSchema);
export default Like;