class Environment {
  constructor({ FRONT_URL, database, ENV, TOKEN_SECRET, TOKEN_EXPIRES }) {
    this.TOKEN_SECRET = TOKEN_SECRET
    this.TOKEN_EXPIRES = TOKEN_EXPIRES
    this.ENV = ENV;
    this.FRONT_URL = FRONT_URL;
    this.database = new Database(database);
  }
}

module.exports = {
  Environment,
};

// We can add more class to connect with servise like aws
class Database {
  constructor({ URL, OPTIONS, SYNC }) {
    this.URL = URL;
    this.OPTIONS = OPTIONS;
    this.SYNC = SYNC;
  }
}
