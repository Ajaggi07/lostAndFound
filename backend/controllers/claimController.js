
const Claim = require("../models/Claim");
const Item = require("../models/Item");

// CREATE CLAIM
exports.createClaim = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.itemId);

        if (!item) {
            return res.status(404).json({
                message: "Item not found."
            });
        }

        if (item.type !== "Found") {
            return res.status(400).json({
                message: "Claims can only be submitted for found items."
            });
        }

        if (item.status !== "active") {
            return res.status(400).json({
                message: "This item is no longer available for claims."
            });
        }

        if (
            String(item.reportedBy) === String(req.user._id)
        ) {
            return res.status(400).json({
                message: "You cannot claim an item you reported."
            });
        }

        const message = req.body.message?.trim();

        if (!message) {
            return res.status(400).json({
                message: "Please explain why this item belongs to you."
            });
        }

        const claim = await Claim.create({
            item: item._id,
            claimant: req.user._id,
            message
        });

        res.status(201).json({
            success: true,
            claim
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already submitted a claim for this item."
            });
        }

        next(error);
    }
};

// GET CLAIMS SUBMITTED BY CURRENT USER
exports.getMyClaims = async (req, res, next) => {
    try {
        const claims = await Claim.find({
            claimant: req.user._id
        })
            .populate("item")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            claims
        });

    } catch (error) {
        next(error);
    }
};

// GET CLAIMS RECEIVED FOR USER'S ITEMS
exports.getReceivedClaims = async (req, res, next) => {
    try {
        const ownItems = await Item.find({
            reportedBy: req.user._id
        }).select("_id");

        const itemIds = ownItems.map(item => item._id);

        const claims = await Claim.find({
            item: { $in: itemIds }
        })
            .populate("item")
            .populate("claimant", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            claims
        });

    } catch (error) {
        next(error);
    }
};

// APPROVE OR REJECT CLAIM
exports.updateClaimStatus = async (req, res, next) => {
    try {
        const claim = await Claim.findById(req.params.id)
            .populate("item");

        if (!claim) {
            return res.status(404).json({
                message: "Claim not found."
            });
        }

        const isOwner =
            String(claim.item.reportedBy) === String(req.user._id);

        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You cannot manage this claim."
            });
        }

        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be approved or rejected."
            });
        }

        if (claim.status !== "pending") {
            return res.status(400).json({
                message: "This claim has already been reviewed."
            });
        }

        if (claim.item.status !== "active") {
            return res.status(400).json({
                message: "This item is no longer available."
            });
        }

        claim.status = status;
        await claim.save();

        if (status === "approved") {
            claim.item.status = "claimed";
            await claim.item.save();

            // Reject all other pending claims for this item
            await Claim.updateMany(
                {
                    item: claim.item._id,
                    _id: { $ne: claim._id },
                    status: "pending"
                },
                {
                    status: "rejected"
                }
            );
        }

        res.status(200).json({
            success: true,
            claim
        });

    } catch (error) {
        next(error);
    }
};
