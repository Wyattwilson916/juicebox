const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllPosts, createPost } = require("../db");

postsRouter.post("/", requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost({
      authorId: req.user.id,
      title,
      content,
      tags: tagArr,
    });
    console.log(tagArr, "!@#$%^&");
    if (post) {
      res.send({ post });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get("/", async (req, res) => {
  const posts = await getAllPosts();
  res.send({
    posts: [],
  });
});

module.exports = postsRouter;
