const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  content: { // This will store the raw text and LaTeX input
    type: String,
    default: '',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;