export const validateRegister = (req, res, next) => {
  const { username, email, password } = req?.body;

  
  if (!username?.trim?.() || !email?.trim?.() || !password) {
    return res?.status?.(400)?.json?.({ message: "All fields are required" });
  }

  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test?.(email)) {
    return res?.status?.(400)?.json?.({ message: "Invalid email address" });
  }

  
  if (password?.length < 6) {
    return res?.status?.(400)?.json?.({ message: "Password needs 6+ characters" });
  }

  if (next) next?.();
};

export const validateBlog = (req, res, next) => {
  const { title, content } = req?.body;

  
  if (!title?.trim?.() || !content?.trim?.()) {
    return res?.status?.(400)?.json?.({ message: "Title and content are required" });
  }

  
  if (title?.trim?.()?.length < 3) {
    return res?.status?.(400)?.json?.({ message: "Title too short (min 3 chars)" });
  }


  if (content?.trim?.()?.length < 50) {
    return res?.status?.(400)?.json?.({ message: "Content too short (min 50 chars)" });
  }

  if (next) next?.();
};


export const validateLogin = (req, res, next) => {
  const { email, password } = req?.body;

  
  if (!email?.trim?.() || !password) {
    return res?.status?.(400)?.json?.({ 
      success: false,
      message: "Email and password are required" 
    });
  }

  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test?.(email)) {
    return res?.status?.(400)?.json?.({ 
      success: false,
      message: "Invalid email format" 
    });
  }

  
  if (password?.length < 6) {
    return res?.status?.(400)?.json?.({ 
      success: false,
      message: "Password must be at least 6 characters" 
    });
  }

  if (next) next?.();
};
