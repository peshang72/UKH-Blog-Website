import express from 'express';
import { postBlog } from '../controllers/blogController';

const router = express.Router();

router.post('/post-blog', postBlog);

export default router;
