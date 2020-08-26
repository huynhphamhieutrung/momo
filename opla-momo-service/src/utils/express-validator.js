const {validationResult} = require('express-validator');
const {validateTimezone, validateTime} = require('./date');

module.exports = {
  validationResult: (req) => {
    return new Promise((resolve, reject) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        resolve();
      } else {
        reject({code: 400, errors: errors.array()});
      }
    });
  },
  validationFields: async(value, fields = []) => {
    for (const key in value) {
      if (!value.hasOwnProperty(key) || !fields.includes(key)) {
        return Promise.reject('object_has_invalid_fields');
      }
    }

    return Promise.resolve();
  },
  validationTime: (value) => {
    const result = validateTime(value);
    return result ? Promise.resolve() : Promise.reject();
  },
  validationTimezone: (value) => {
    const result = validateTimezone(value);
    return result ? Promise.resolve() : Promise.reject();
  },
};
