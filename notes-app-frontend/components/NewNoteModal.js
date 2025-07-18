// components/NewNoteModal.js
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

const NewNoteModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const router = useRouter();

  const handleCreateNote = () => {
    if (title.trim() === '' || subject.trim() === '') {
      alert('Title and Subject are required!');
      return;
    }
    onClose(); // Close the modal
    // Redirect to the new note editor page, passing title and subject as query params
    router.push(`/note/new?title=${encodeURIComponent(title)}&subject=${encodeURIComponent(subject)}`);
    // Reset form for next time
    setTitle('');
    setSubject('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Note</h2>
        <div className="mb-4">
          <label htmlFor="modal-title" className="block text-gray-700 text-sm font-bold mb-2">
            Note Title:
          </label>
          <input
            type="text"
            id="modal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50 transition-all duration-200"
            placeholder="e.g., Thermodynamics Principles"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="modal-subject" className="block text-gray-700 text-sm font-bold mb-2">
            Subject:
          </label>
          <input
            type="text"
            id="modal-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-gray-50 transition-all duration-200"
            placeholder="e.g., Physics, Chemistry"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateNote}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 text-sm font-medium"
          >
            Create Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewNoteModal;