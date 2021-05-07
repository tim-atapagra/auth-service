const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);

/**
 * @class MongoDB
 */
class MongoDB {
  /**
   * @param {MongooseSchema} Schema
   */
  get Schema() {
    return mongoose.Schema;
  }

  get connectionUri() {
    return process.env.MONGODB_URI || "mongodb://localhost:27017";
  }

  get connnectionOptions() {
    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    };
  }

  /**
   * @method connect
   * @return {Promise}
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.readyState > 0) {
        const error = new Error("MongoDB - already connecting/connected");
        return reject(error);
      }

      mongoose.connect(this.connectionUri, {
        ...this.connnectionOptions,
        dbName: this.connectionDb
      });

      mongoose.connection.once("open", () => {
        console.log("MongoDB: connected");
        resolve();
      });

      mongoose.connection.on("error", err => {
        console.error("MongoDB: error", err);
        reject(err);
      });
    });
  }

  /**
   * @method disconnect
   * @return {Promise}
   */
  async disconnect() {
    return mongoose.connection.close();
  }

  /**
   * @method createModel
   * @return {MongooseModel}
   */
  createModel() {
    return mongoose.model(...arguments);
  }

  /**
   * @method createModel
   * @return {Promise}
   */
  async createConnection(
    uri = this.connectionUri,
    options = this.connnectionOptions
  ) {
    const client = new MongoClient(uri, options);
    await client.connect();
    return {
      client,
      db: client.db(options.dbName)
    };
  }
}

module.exports = new MongoDB();
