import User from "../models/User.js";
import Blog from "../models/Blog.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User?.findById?.(req?.user?._id)
      ?.select?.("-password -refreshToken -__v")
      ?.lean?.();

    if (!user) {
      return res?.status(404)?.json({ 
        success: false,
        message: "User not found" 
      });
    }

    const avatarUrl = user?.avatar?.filename 
      ? `${process?.env?.BASE_URL}/uploads/blogs/${user?.avatar?.filename}`
      : null;

    return res?.json?.({
      success: true,
      user: {
        ...user,
        avatar: avatarUrl
      }
    });

  } catch (err) {
    console?.error?.("Get profile error:", err);
    return res?.status(500)?.json({ 
      success: false,
      message: "Failed to fetch profile" 
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { username, bio } = req?.body;

    if (username && (username?.length < 3 || username?.length > 30)) {
      return res?.status(400)?.json({ 
        success: false,
        message: "Username must be 3-30 characters" 
      });
    }

    if (bio && bio?.length > 200) {
      return res?.status(400)?.json({ 
        success: false,
        message: "Bio cannot exceed 200 characters" 
      });
    }

    const updateData = { username, bio };

    if (req?.file) {
      updateData.avatar = {
        filename: req?.file?.filename,
        path: req?.file?.path?.replace?.(/\\/g, '/'),
        mimetype: req?.file?.mimetype,
        size: req?.file?.size
      };
    }

    const updatedUser = await User?.findByIdAndUpdate?.(
      req?.user?._id,
      updateData,
      {
        new: true,
        runValidators: true,
        select: "-password -refreshToken -__v"
      }
    );

    const avatarUrl = updatedUser?.avatar?.filename
      ? `${process?.env?.BASE_URL}/uploads/blogs${updatedUser?.avatar?.filename}`
      : null;

    let updatedUserObj = updatedUser;
    if (updatedUser?.toObject) {
      updatedUserObj = updatedUser?.toObject?.();
    }

    return res?.json?.({
      success: true,
      user: {
        ...updatedUserObj,
        avatar: avatarUrl
      }
    });

  } catch (err) {
    console?.error?.("Update profile error:", err);
    
    if (err?.code === 11000) {
      return res?.status(409)?.json({ 
        success: false,
        message: err?.keyPattern?.username 
          ? "Username already taken" 
          : "Email already registered" 
      });
    }

    return res?.status(500)?.json({ 
      success: false,
      message: "Failed to update profile" 
    });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog?.find?.({ author: req?.user?._id })
      ?.sort?.({ createdAt: -1 });

    res?.status(200)?.json?.({
      success: true,
      blogs,
    });
  } catch (err) {
    console?.error?.("Failed to get user blogs:", err);
    res?.status(500)?.json?.({
      success: false,
      message: "Failed to fetch user blogs",
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req?.body;

    if (!currentPassword || !newPassword) {
      return res?.status(400)?.json({
        success: false,
        message: "Both current and new password are required"
      });
    }

    if (newPassword?.length < 6) {
      return res?.status(400)?.json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const user = await User?.findById?.(req?.user?._id)?.select?.("+password");

    let isMatch = false;
    if (user?.matchPassword) {
      isMatch = await user?.matchPassword?.(currentPassword);
    }

    if (!isMatch) {
      return res?.status(401)?.json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword;
    user.passwordChangedAt = Date?.now?.();
    if (user?.save) {
      await user?.save?.();
    }

    return res?.json?.({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    console?.error?.("Update password error:", err);
    return res?.status(500)?.json({
      success: false,
      message: "Failed to update password"
    });
  }
};
