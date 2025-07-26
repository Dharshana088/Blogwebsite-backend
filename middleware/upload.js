import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath?.(import.meta.url);
const __dirname = dirname?.(__filename);

const storage = multer?.diskStorage?.({
  destination: (req, file, cb) => {
    cb?.(null, path?.join?.(__dirname, '../uploads/blogs/'));
  },
  filename: (req, file, cb) => {
    const ext = path?.extname?.(file?.originalname)?.toLowerCase?.();
    cb?.(null, `blog-${Date?.now?.()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes?.includes?.(file?.mimetype)) {
    cb?.(null, true);
  } else {
    cb?.(new Error('Only JPG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer?.({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

const uploadBlogImages = upload?.fields?.([
  { name: 'images', maxCount: 5 },
  { name: 'coverImage', maxCount: 1 }
]);

export { upload, uploadBlogImages };
