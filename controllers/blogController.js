import Blog from "../models/Blog.js";

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req?.body || {};

    if (!title || !content) {
      return res?.status(400)?.json({ message: "Title and content are required" });
    }

    if (title?.length > 100) {
      return res?.status(400)?.json({ message: "Title too long (max 100 chars)" });
    }

    const images = [];
    let coverImage = null;

    if (req?.files?.images) {
      req?.files?.images?.forEach?.(file => {
        images?.push?.({
          filename: file?.filename,
          path: file?.path,
          mimetype: file?.mimetype,
          size: file?.size
        });
      });
    }

    if (req?.files?.coverImage?.[0]) {
      const file = req?.files?.coverImage?.[0];
      coverImage = {
        filename: file?.filename,
        path: file?.path,
        mimetype: file?.mimetype,
        size: file?.size
      };
    }

    const processedTags =
      typeof tags === "string"
        ? tags?.split?.(",")?.map?.(t => t?.trim())?.filter?.(Boolean)
        : Array?.isArray?.(tags)
        ? tags
        : [];

    const newBlog = await Blog?.create?.({
      title,
      content,
      tags: processedTags,
      images,
      coverImage,
      author: req?.user?._id
    });

    return res?.status(201)?.json({
      blog: {
        _id: newBlog?._id,
        title: newBlog?.title,
        content: newBlog?.content,
        tags: newBlog?.tags,
        images: newBlog?.images,
        coverImage: newBlog?.coverImage,
        createdAt: newBlog?.createdAt,
        author: {
          _id: req?.user?._id,
          username: req?.user?.username,
        },
      },
    });

  } catch (err) {
    console?.error?.("Blog creation error:", err);
    return res?.status(500)?.json({ message: "Blog creation failed" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise?.all?.([
      Blog?.find?.()
        ?.populate?.("author", "username avatar")
        ?.sort?.({ createdAt: -1 })
        ?.skip?.(skip)
        ?.limit?.(limit),
      Blog?.countDocuments?.()
    ]);

    return res?.json?.({
      blogs,
      currentPage: page,
      totalPages: Math?.ceil?.(total / limit),
      totalBlogs: total
    });
  } catch (err) {
    console?.error?.("Fetch blogs error:", err);
    return res?.status(500)?.json({ message: "Failed to fetch blogs" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog?.findById?.(req?.params?.id)
      ?.populate?.("author", "username avatar");

    if (!blog) {
      return res?.status(404)?.json({ message: "Blog not found" });
    }

    return res?.json?.({ blog });
  } catch (err) {
    console?.error?.("Fetch blog error:", err);
    return res?.status(500)?.json({ message: "Failed to fetch blog" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog?.findById?.(req?.params?.id);
    if (!blog) {
      return res?.status(404)?.json({ message: "Blog not found" });
    }

    if (blog?.author?.toString?.() !== req?.user?._id?.toString?.()) {
      return res?.status(403)?.json({ message: "Unauthorized to update this blog" });
    }

    const { title, content, tags } = req?.body;
    const images = [];
    let coverImage = blog?.coverImage;

    if (req?.files?.length > 0) {
      for (let i = 0; i < req?.files?.length; i++) {
        const file = req?.files?.[i];
        if (!file?.mimetype?.startsWith?.("image/")) {
          return res?.status(400)?.json({ message: "Only image files are allowed" });
        }

        const imageInfo = {
          filename: file?.filename,
          path: file?.path,
          mimetype: file?.mimetype,
          size: file?.size,
        };

        images?.push?.(imageInfo);
        if (i === 0) coverImage = imageInfo;
      }
    }

    const processedTags = typeof tags === "string"
      ? tags?.split?.(',')?.map?.(t => t?.trim())?.filter?.(t => t?.length > 0)
      : Array?.isArray?.(tags) ? tags : blog?.tags;

    const updated = await Blog?.findByIdAndUpdate?.(
      req?.params?.id,
      {
        title: title || blog?.title,
        content: content || blog?.content,
        tags: processedTags,
        images: images?.length > 0 ? images : blog?.images,
        coverImage,
        updatedAt: new Date()
      },
      { new: true }
    )?.populate?.("author", "username avatar");

    return res?.json?.(updated);
  } catch (err) {
    console?.error?.("Update blog error:", err);
    return res?.status(500)?.json({ message: "Failed to update blog" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog?.findById?.(req?.params?.id);
    if (!blog) {
      return res?.status(404)?.json({ message: "Blog not found" });
    }

    if (blog?.author?.toString?.() !== req?.user?._id?.toString?.()) {
      return res?.status(403)?.json({ message: "Unauthorized to delete this blog" });
    }

    if (blog?.deleteOne) {
      await blog?.deleteOne?.();
    }

    return res?.json?.({ message: "Blog deleted successfully" });
  } catch (err) {
    console?.error?.("Delete blog error:", err);
    return res?.status(500)?.json({ message: "Failed to delete blog" });
  }
};
