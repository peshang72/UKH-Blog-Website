import Blog from "../model/blog";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const postBlog = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, author, category, tags } = req.body;
      const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      const newBlog = new Blog({
        title,
        content,
        author,
        category,
        tags: tags.split(","),
        image,
      });
      await newBlog.save();
      res.status(201).json({ message: "Blog created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error creating blog", error: error.message });
    }
  },
];
