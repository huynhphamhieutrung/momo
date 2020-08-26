const Base = require('./base');

module.exports = class extends Base {
  #_id;
  #name;
  #email;

  constructor(obj = {}) {
    super();
    this.init(obj);
  }

  get _id() {
    return this.#_id;
  }

  set _id(_id) {
    this.#_id = _id;
  }

  get email() {
    return this.#email;
  }

  set email(email) {
    this.#email = email;
  }

  get name() {
    return this.#name;
  }

  set name(name) {
    this.#name = name;
  }

  get defaultFields() {
    return ['_id', 'name', 'email'];
  }
};
