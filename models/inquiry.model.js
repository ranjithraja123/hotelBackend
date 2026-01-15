import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    adults: {
      type: Number,
      required: true,
      min: 1,
    },
    children: {
      type: Number,
      default: 0,
      min: 0,
    },
    roomType: {
      type: String,
      required: true,
    //   enum: ["Standard", "Deluxe", "Suite", "Villa"],
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED"],
      default: "NEW",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inquiry", inquirySchema)