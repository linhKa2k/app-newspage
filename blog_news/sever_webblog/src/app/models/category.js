import mongoose from 'mongoose';

const categoryrSchema = new mongoose.Schema(
    {
        namecategory: {
            type: String,
            required: true,
            unix: true
        },
        is_available: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
  
);


const Category = mongoose.model('category', categoryrSchema);
export default Category;