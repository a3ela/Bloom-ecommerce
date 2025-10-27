const router = require("express").Router();
const {
    getUserProfile,
    updateUserProfile,
    getUserById,
    getUsers,
    deleteUser,
    updateUser
} = require("../controller/user.controller.js");
const { protect, admin } = require("../middleware/auth.middleware.js");

router.route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUser);

router.route("/:id")
    .get(protect, getUserById)
    .put(protect, updateUser)
    .delete(protect, deleteUser);

router.route("/")
    .get(getUsers);

module.exports = router;