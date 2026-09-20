import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "English",
    },

    sentiment: {
      type: String,
      default: "Neutral",
    },

    emotion: {
      type: String,
      default: "Neutral",
    },

    intent: {
      type: String,
      default: "General Discussion",
    },

    topics: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    rootCause: {
      type: String,
      default: "",
    },

    recommendedAction: {
      type: String,
      default: "",
    },

    forecast: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);