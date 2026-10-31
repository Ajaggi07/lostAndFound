
const Item = require("../models/Item");

// CREATE ITEM
exports.createItem = async (req, res, next) => {
    try {
        const {
            title,
            type,
            category,
            description,
            location,
            date
        } = req.body;

        if (
            !title ||
            !type ||
            !category ||
            !description ||
            !location
        ) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        if (!["Lost", "Found"].includes(type)) {
            return res.status(400).json({
                message: "Type must be Lost or Found."
            });
        }

        const item = await Item.create({
            title: title.trim(),
            type,
            category: category.trim(),
            description: description.trim(),
            location: location.trim(),
            date: date || new Date(),
            image: req.file
                ? `/uploads/${req.file.filename}`
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

        res.status(200).json({
            success: true,
            message: "Item deleted successfully."
        });

    } catch (error) {
        next(error);
    }
};
