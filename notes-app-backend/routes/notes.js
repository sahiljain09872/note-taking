// routes/notes.js

const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// @route   GET /api/notes
// @desc    Get all notes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({}).sort({ updatedAt: -1 }); // Sort by most recently updated
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') { // Handle invalid ID format
      return res.status(400).json({ msg: 'Invalid Note ID' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Public
router.post('/', async (req, res) => {
    console.log("came to create new note");
  const { title, subject, content } = req.body; // Ensure these fields are coming in req.body

  // Basic validation (optional, Mongoose schema handles required)
  if (!title || !subject) {
      return res.status(400).json({ msg: 'Please enter all required fields: title and subject' });
  }

  try {
    const newNote = new Note({
      title,
      subject,
      content,
    });

    const note = await newNote.save();
    res.status(201).json(note); // 201 Created
  } catch (err) {
    // Log the actual error from Mongoose/database for debugging
    console.error(err.message, err.name); // Will show Mongoose validation errors if any
    res.status(500).send('Server Error');
  }
});


router.put('/:id', async (req, res) => {
  const { title, subject, content } = req.body;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    // Update fields
    note.title = title || note.title; // If title is not provided, keep existing
    note.subject = subject || note.subject;
    note.content = content !== undefined ? content : note.content; // Allow content to be an empty string

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Note ID' });
    }
    res.status(500).send('Server Error');
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    res.json({ msg: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid Note ID' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = router;