
const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "campus-lost-found",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

// CREATE ITEM
exports.createItem = async (req, res, next) => {
    let uploadedImage = null;

    try {
        const {
            title,
            type,
            category,
            description,
            location,
            date
        } = req.body;

        if (!title || !type || !category || !description || !location) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        if (!["Lost", "Found"].includes(type)) {
            return res.status(400).json({
                message: "Type must be Lost or Found."
            });
        }

        // Upload image to Cloudinary
        if (req.file) {
            uploadedImage = await uploadToCloudinary(req.file.buffer);
        }

        // Save item in MongoDB
        const item = await Item.create({
            title: title.trim(),
            type,
            category: category.trim(),
            description: description.trim(),
            location: location.trim(),
            date: date || new Date(),

            image: uploadedImage
                ? uploadedImage.secure_url
                : "",

            imagePublicId: uploadedImage
                ? uploadedImage.public_id
                : "",

            reportedBy: req.user._id
        });

        const populatedItem = await item.populate(
            "reportedBy",
            "name email"
        );

        res.status(201).json({
            success: true,
            item: populatedItem
        });

    } catch (error) {
        // Clean up Cloudinary image if item creation fails
        if (uploadedImage) {
            try {
                await cloudinary.uploader.destroy(
                    uploadedImage.public_id
                );
            } catch (cleanupError) {
                console.error(
                    "Cloudinary cleanup failed:",
                    cleanupError.message
                );
            }
        }

        next(error);
    }
};

// GET ALL ITEMS WITH SEARCH AND FILTERS
exports.getItems = async (req, res, next) => {
    try {
        const {
            search,
            category,
            type,
            status
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (category && category !== "All") {
            filter.category = category;
        }

        if (type && type !== "All") {
            filter.type = type;
        }

        if (search && search.trim()) {
            const safeSearch = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                {
                    title: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                },
                {
                    location: {
                        $regex: safeSearch,
                        $options: "i"
                    }
                }
            ];
        }

        const items = await Item.find(filter)
            .populate("reportedBy", "name")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });

    } catch (error) {
        next(error);
    }
};

// GET SINGLE ITEM
exports.getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate("reportedBy", "name email");

        if (!item) {
            return res.status(404).json({
                message: "Item not found."
            });
        }

        res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        next(error);
    }
};

// GET ITEMS REPORTED BY CURRENT USER
exports.getMyItems = async (req, res, next) => {
    try {
        const items = await Item.find({
            reportedBy: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            items
        });

    } catch (error) {
        next(error);
    }
};

// UPDATE ITEM STATUS
exports.updateItemStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["active", "claimed", "returned"].includes(status)) {
            return res.status(400).json({
                message: "Invalid item status."
            });
        }

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found."
            });
        }

        const isOwner =
            String(item.reportedBy) === String(req.user._id);

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You cannot update this item."
            });
        }

        item.status = status;

        await item.save();

        res.status(200).json({
            success: true,
            item
        });

    } catch (error) {
        next(error);
    }
};

// DELETE ITEM
exports.deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found."
            });
        }

        const isOwner =
            String(item.reportedBy) === String(req.user._id);

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You cannot delete this item."
            });
        }

        await item.deleteOne();

        // Delete associated Cloudinary image
        if (item.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(
                    item.imagePublicId,
                    { resource_type: "image" }
                );
            } catch (cloudinaryError) {
                console.error(
                    "Cloudinary image deletion failed:",
                    cloudinaryError.message
                );
            }
        }

        res.status(200).json({
            success: true,
            message: "Item deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};
