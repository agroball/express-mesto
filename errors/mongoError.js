module.exports = class MongoError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
