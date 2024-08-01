const mongoose = require('mongoose');


const eventSchema = mongoose.Schema({
  label: {
    type: String,
    
  },
  starttime: {
    type: String,
  },
  endtime: {
    type: String,
  },
  description: {
    type: String,
  },
  year: {
    type: String,
  },
  month: {
    type: String,
  },
  day: {
    type: String,
  }

});


const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  events: [eventSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
