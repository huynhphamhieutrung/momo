const {MongoClient} = require('mongodb');

class Database {
  #database;

  init(username, password, host, port, dbName) {
    const url = `mongodb://${username}:${password}@${host}:${port}/admin`;
    const options = {useUnifiedTopology: true};

    return MongoClient.connect(url, options).then((client) => {
      this.#database = client.db(dbName);
      return this.#database;
    });
  }

  getCollection(tableName) {
    return this.#database.collection(tableName);
  }
}

module.exports = new Database();
