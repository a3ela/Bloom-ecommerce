const asyncHandler = require("../middleware/asyncHandler.js");
const User = require("../models/user.model.js");

// get user prfile
//@route GET /api/users/profile
// @access Public
const getUserProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.userId);

  if (user) {
    response.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error("User not found");
  }
});

// Update user profile
//@route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.userId);
console.log("user", user);
    
  if (user) {
    user.name = request.body.name || user.name;
    user.email = request.body.email || user.email;
    if (request.body.password) {
      user.password = request.body.password;
    }

    const updatedUser = await user.save();

    response.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    response.status(404);
    throw new Error("User not found");
  }
});

// Get user by ID
//@route GET /api/users/:id
// @access Private/admin
const getUserById = asyncHandler(async (request, response) => {
  response.send("get user by id");
});

// delete user profile
//@route DELETE /api/users/profile
// @access private
const deleteUser = asyncHandler(async (request, response) => {
  response.send("delete user profile");
});

// get all users
//@route GET /api/users
// @access private/admin
const getUsers = asyncHandler(async (request, response) => {
  response.send("get all users");
});

//@desc update suser
//@route PUT /api/users/:id
// @access Private/admin
const updateUser = asyncHandler(async (request, response) => {
  response.send("update user");
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserById,
  getUsers,
  deleteUser,
  updateUser,
};
