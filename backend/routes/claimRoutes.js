
const router = require("express").Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createClaim,
    getMyClaims,
    getReceivedClaims,
    updateClaimStatus
} = require("../controllers/claimController");

// Submit a claim for a found item
router.post(
    "/item/:itemId",
    protect,
    createClaim
);

// Claims submitted by logged-in user
router.get(
    "/my-claims",
    protect,
    getMyClaims
);

// Claims received on user's reported items
router.get(
    "/received",
    protect,
    getReceivedClaims
);

// Approve or reject a claim
router.patch(
    "/:id/status",
    protect,
    updateClaimStatus
);

module.exports = router;
