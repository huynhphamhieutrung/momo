module.exports = class {
  get defaultFields() {
    return ['_id'];
  }

  init(obj = {}) {
    for (const key in obj) {
      const descriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(this), key,
      );
      if (descriptor && descriptor.set) {
        this[key] = obj[key];
      }
    }

    return this;
  }

  toObject(fields) {
    if (!fields || !fields.length) {
      fields = this.defaultFields;
    }

    const result = {};

    for (const field of fields) {
      if (field in this) {
        result[field] = this[field];
      }
    }

    return result;
  }
};
