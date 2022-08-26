const mongoose = require('mongoose');

const dbContext = {
  connect: async ({ connectionString, dbConnectTimeout, recreateDatabase }) => {
    if (recreateDatabase) {
      let connection = null;

      connection = await mongoose.createConnection(connectionString, {
        serverSelectionTimeoutMS: dbConnectTimeout,
      });
      await connection.dropDatabase();
    }

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: dbConnectTimeout,
    });
  },
};

module.exports = dbContext;
