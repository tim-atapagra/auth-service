class CommonService {
  /**
   * @constructor
   */
  constructor(model) {
    this._model = model.createModel();
  }

  /**
   * @prop {MongooseModel} model
   */
  get model() {
    return this._model;
  }

  /**
   * @method create
   * @param {Object} data
   * @return {Query}
   */
  create() {
    return this.model.create(...arguments);
  }

  /**
   * @method find
   * @param {Object} [query]
   * @return {Query}
   */
  find() {
    return this.model.find(...arguments);
  }

  /**
   * @method findOne
   * @param {Object} [query]
   * @return {Query}
   */
  findOne() {
    return this.model.findOne(...arguments);
  }

  /**
   * @method findOneAndUpdate
   * @param {Object} [query]
   * @return {Query}
   */
  findOneAndUpdate(query, update, options = {}) {
    return this.model.findOneAndUpdate(query, update, {
      ...options,
      new: true
    });
  }
}

module.exports = CommonService;
