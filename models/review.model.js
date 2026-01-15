import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

export default mongoose.model("reviews", reviewSchema)