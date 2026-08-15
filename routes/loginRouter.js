import express from "express";
import { validationResult, matchedData } from "express-validator";

import { validateLogIn } from "../validators/authValidator.js";

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
  res.render("login", { data: {}, errors: {} });
});

loginRouter.post("/", validateLogIn, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { password, ...formData } = req.body;
    return res
      .status(400)
      .render("login", { data: formData, errors: errors.mapped() });
  }

  const data = matchedData(req);
  console.log(data);
});

export default loginRouter;
