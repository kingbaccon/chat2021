const AppError = require('../errors/app-error');
const { User, UserValidationSchema } = require('./User-module');
const { OperationType, checkPayload } = require('../utils/utils-controller');

const controller = {

  create: async (payload) => {
    checkPayload(payload, UserValidationSchema, OperationType.Create);
    await checkDuplicate(payload.username);
    return await User.create(payload);
  },

  getAll: async () => await User.find(),

  getFiltered: async (filter) => await User.find(filter),

  getById: async (_id) => {
    let result = await User.findById(_id);
    if (!result) throw new AppError(404, `User with _id ${_id} not found`);

    return result;
  },

  deleteById: async (_id) => {
    await User.deleteOne({ _id });
    return;
  },

  update: async (_id, payload) => {
    checkPayload(payload, UserValidationSchema, OperationType.Update);

    let result = await User.findByIdAndUpdate(_id, payload);
    if (!result) throw new AppError(404, `User with _id ${_id} not found`);

    // retrieve the updated user from database an deliver as result
    return await User.findById(_id);
  },
};
async function checkDuplicate(username) {
  let userDuplicate = await User.findOne({ username });
  if (userDuplicate) throw new AppError(400, `Username "${username}" already exists.`)
}

module.exports = controller;

