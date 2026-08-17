import express from "express";
const newMessageRouter = express.Router();
newMessageRouter.get("/", (req, res) => {
  res.render("new-message");
});

export default newMessageRouter;
