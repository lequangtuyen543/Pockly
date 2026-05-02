import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Setting = mongoose.model("Setting", settingSchema, "settings");

export default Setting;

