
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120
        },

        type: {
            type: String,
            enum: ["Lost", "Found"],
            required: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        // Cloudinary secure image URL
        image: {
            type: String,
            default: ""
        },

        // Cloudinary public ID for deleting images
        imagePublicId: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["active", "claimed", "returned"],
            default: "active"
        },

        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Item", itemSchema);
