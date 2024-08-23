const { check } = require('express-validator');

const role = [
  check("name")
    .exists().withMessage('Name is required!')
    .bail()
    .trim()
    .isString()
    .notEmpty().withMessage('Name cannot be empty!'),
]

module.exports = { role }
