import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    adminCode: { type: String,
       required: true
       },
    adminSoftCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("admincreds", adminSchema);