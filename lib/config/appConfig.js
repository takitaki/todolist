module.exports = {
    DB: process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/todos',
    PORT: process.env.PORT ? process.env.PORT : 8000,
  };