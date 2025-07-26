import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [50, "Content must be at least 50 characters"]
    },
    images: {
      type: [
        {
          filename: String,
          path: String,
          mimetype: String,
          size: Number
        }
      ],
      default: [],
      validate: {
        validator: images => {
          if (images?.length !== undefined) return images.length <= 5;
        },
        message: "Maximum 5 images allowed"
      }
    },
    coverImage: {
      type: {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
      },
      default: null
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: tags => {
          if (tags?.every) return tags.every(tag => tag?.length <= 20);
        },
        message: "Each tag must be 20 characters or less"
      }
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"]
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret?.__v;
        return ret;
      }
    }
  }
);

export default mongoose.model("Blog", blogSchema);
