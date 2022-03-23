import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            maxLength: 20000,
        },
        title:{
            type: String,
            required: true,
            maxLength: 150,
        },
        description: {
            type: String,
            required: true,
            maxLength: 350,
        },
        imagepost: {
            type: String,
            default: 'http://dangky3gmobi.vn/wp-content/uploads/2018/04/1685973.jpg'
        },
        poster: { type: Schema.Types.ObjectId, ref: 'user' },
        category: { type: Schema.Types.ObjectId, ref: 'category' },
        likecount: {
            type: Number,
            default: 0
        },
        views: {
            type: Number,
            default: 0
        },
        is_available: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        censor: { 
            type: Schema.Types.ObjectId, 
            ref: 'user', 
            default: null 
        },
        createAtpost: {
            type: Date,
            default: null,
        }, 
        updateAtpost: {
            type: Date,
            default: null,
        },
        is_detroy: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);


const Post = mongoose.model('post', postSchema);
export default Post;


