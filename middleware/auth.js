import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  
  const token = req?.headers?.authorization?.split?.(' ')?.[1];
  if (!token) {
    return res?.status(401)?.json?.({ message: "No token provided" });
  }

  try {
    
    const decoded = jwt?.verify?.(token, process?.env?.JWT_SECRET);

    
    const user = await User?.findById?.(decoded?.id);
    if (!user) {
      return res?.status(401)?.json?.({ message: "User no longer exists" });
    }

    
    if (user?.passwordChangedAfter) {
      const changed = user?.passwordChangedAfter?.(decoded?.iat);
      if (changed) {
        return res?.status(401)?.json?.({ message: "Password changed. Login again" });
      }
    }

    
    req.user = user;
    next?.();

  } catch (error) {
    
    if (error?.name === "TokenExpiredError") {
      return res?.status(401)?.json?.({ message: "Token expired. Login again" });
    }
    if (error?.name === "JsonWebTokenError") {
      return res?.status(401)?.json?.({ message: "Invalid token" });
    }
    
    
    return res?.status(401)?.json?.({ message: "Not authorized" });
  }
};

export default protect;
