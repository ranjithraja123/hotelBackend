import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomType: {
      type: String,
      required: true,
    },
    members: { type: Number,
       required: true
       },
    amenities: {
      type: [String],
      required: true,
    },
    filepaths: {
      type: [String],
    },
    availabilities:{
      type: String,
    },
    areaInSqft:{
      type:String,
      required:true
    },
    itemsProvided:{
      type:[String],

    }
  },
  { timestamps: true }
);

export default mongoose.model("rooms", roomSchema);