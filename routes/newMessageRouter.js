import express from "express";
import { body, matchedData } from "express-validator";

import checkValidation from "../middleware/checkValidationMiddleware.js";
import { addMessage } from "../database/query.js";

const newMessageRouter = express.Router();

const validateMessage = [
  body("message_title")
    .trim()
    .notEmpty()
    .withMessage("Message title is required"),
  body("message_content").notEmpty().withMessage("Message content is required"),
];

newMessageRouter.get("/", (req, res) => {
  res.render("new-message");
});

newMessageRouter.post(
  "/",
  validateMessage,
  checkValidation("new-message"),
  async (req, res) => {
    const data = matchedData(req);
    const message = { ...data, userId: req.user.id };
    await addMessage(message);
    res.redirect("/");
  }
);

export default newMessageRouter;
