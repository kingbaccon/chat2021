const AppError = require('../errors/app-error');
const { Message, MessageValidationSchema } = require('./message-model');
const { OperationType, checkPayload } = require('../utils/utils-controller');

const controller = {
  create: async (payload) => {
    checkPayload(payload, MessageValidationSchema, OperationType.Create);

    return Message.create(payload);
  },

  getAll: async () => Message.find(),

  getFiltered: async (filter) => {
    let keys = Object.keys(filter)
    keys.forEach(key => {
      if(key.startsWith('not')) {
        filter[key.substring(3)] = {$ne: filter[key]};
        delete filter[key]
      }
    });
    return Message.find(filter)
  },

  getById: async (_id) => {
    let result = Message.findById(_id);
    if (!result) throw new AppError(404, `Message with _id ${_id} not found`);

    return result;
  },

  

  deleteById: async (_id) => {
   Message.deleteOne({ _id });
    return;
  },

  update: async (_id, payload) => {
    checkPayload(payload, MessageValidationSchema, OperationType.Update);

    let result =  Message.findByIdAndUpdate(_id, payload);
    if (!result) throw new AppError(404, `Message with _id ${_id} not found`);

    // retrieve the updated user from database an deliver as result
    return Message.findById(_id);
  },
};

module.exports = controller;
