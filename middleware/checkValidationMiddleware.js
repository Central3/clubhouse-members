import { validationResult } from "express-validator";

const checkValidation = (view) => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const { password, confirm_password, ...formData } = req.body;
    return res
      .status(400)
      .render(view, { data: formData, errors: errors.mapped() });
  }

  next();
};

export default checkValidation;
