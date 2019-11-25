module.exports = {
    DB: process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017/todos',
    PORT: process.env.PORT ? process.env.PORT : 8000,
  };