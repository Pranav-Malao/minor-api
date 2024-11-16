const mongoose = require('mongoose');

const balKandSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  script: {
    type: String,
    required: true
  },
  kanda: {
    type: Number,
    required: true
  },
  sarga: {
    type: Number,
    required: true
  },
  sloka: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    },
  },
  audio: {
    type: String,
    required: false
  }
});

const balKand = mongoose.model('balKand', balKandSchema);

module.exports = balKand;