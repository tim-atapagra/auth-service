const mongodb = require('../DB/mongodb')
const pluralize = require('mongoose-legacy-pluralize')
const { v4: uuidv4 } = require('uuid');

/**
 * Common Model
 *
 * @class CommonModel
 */
class CommonModel {
  /**
   * @constructor
   */
  constructor(name) {
    this._name = name
  }

  /**
   * @prop {String} name
   */
  get name() {
    return this._name
  }

  /**
   * @method schema
   * @return {Object}
   */
  schema() {
    return {
      userId: {
      type: String,
      default: uuidv4(),
      required: true
      },
    userName: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      index: {
        unique: true
      }
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      index: true
    },
    accountVerified: {
      type: Boolean,
      required: false,
      default: false
    },
    token: {
      type: String,
      required: true,
      trim: true
    },
    otp: {
      type: String,
    }
  }
  }

  /**
   * @method configure
   * @param {MongooseSchema} schema
   */
  configure(schema) {
    schema.virtual('id').get(function() {
      return this._id
    })

    schema.set('toObject', {
      virtuals: true,
      getters: true
    })

    schema.set('toJSON', {
      virtuals: true,
      getters: true,
      transform: (ret, doc) => {
        this.toJSON(doc)
        return doc
      }
    })
  }

  /**
   * @method toJSON
   */
  toJSON(doc) {
    doc._id = doc.__t = doc.__v = undefined
  }

  /**
   * @method schemaOptions
   * @return {Object}
   */
  schemaOptions() {
    return {
      autoIndex: process.env.NODE_ENV !== 'production'
    }
  }

  /**
   * @method createModel
   * @return {Class}
   */
  createModel() {
    const config = Object.assign({}, this.schema())
    const options = this.schemaOptions()

    // Create and confugure the schema
    const schema = new mongodb.Schema(config, options)
    this.configure(schema)

    // Create the mondel
    const model = mongodb.createModel(this.name, schema, pluralize(this.name))

    // Listen for index errors
    model.on('index', err => {
      if (err) throw err
    })

    return model
  }
}

module.exports = CommonModel