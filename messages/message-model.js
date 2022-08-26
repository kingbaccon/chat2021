const mongoose = require('mongoose');

const mongooseMessageSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'subject is missing'],
    trim: true,
  },
  tag: [{
    type: String,
    default: '',
  }],
  msgText: {
    type: String,
    default: '',
  },
  userId:{
    type: mongoose.Types.ObjectId,
    required: [true, 'user id is empty'],
  },
});

const MessageValidationSchema = {
  subject: {
    type: 'string',
    required: true,
  },
  tag: {
    type: 'string | object',
  },
  msgText: {
    type: 'string',
    
  },
  userId:{
    type: 'string',
    required: true,
  },
};

const Message = mongoose.model('Message', mongooseMessageSchema);

module.exports.Message = Message;
module.exports.MessageValidationSchema = MessageValidationSchema;
