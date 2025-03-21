import Blog from "../model/blog.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const postBlog = [
  upload.single("cover-img"),
  async (req, res) => {
    try {
      const {
        title,
        "blog-description": blogDescription,
        author,
        "author-description": authorDescription,
        "img-caption": imgCaption,
        category,
      } = req.body;
      const coverImage = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      const newBlog = new Blog({
        title,
        blogDescription,
        author,
        authorDescription,
        category,
        imgCaption,
        coverImage,
      });
      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating blog", error: error.message });
    }
  },
];
