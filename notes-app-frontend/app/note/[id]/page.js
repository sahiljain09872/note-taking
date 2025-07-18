// app/note/[id]/page.js
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import LaTeXPreview from '../../../components/LaTeXPreview';
import NoteToolbar from '../../../components/NoteToolbar';

export default function NoteEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const noteId = params.id;
  const isNewNote = noteId === 'new';

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef(null);

  // Get the backend URL from environment variables
  const BACKEND_URL = "https://note-taking-1-idk7.onrender.com";
  
  console.log(BACKEND_URL);

  useEffect(() => {
    const loadNoteData = async () => {
      setLoading(true);
      setError(null);
      if (isNewNote) {
        const urlTitle = searchParams.get('title');
        const urlSubject = searchParams.get('subject');
        if (!urlTitle || !urlSubject) {
          alert('Note details are missing. Please create a new note from the home page.');
          router.push('/');
          return;
        }
        setTitle(decodeURIComponent(urlTitle));
        setSubject(decodeURIComponent(urlSubject));
        setNoteContent('');
        setLoading(false);
      } else {
        try {
          const response = await fetch(`${BACKEND_URL}/api/notes/${noteId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch note with ID ${noteId}. Status: ${response.status}`);
          }
          const data = await response.json();
          setTitle(data.title);
          setSubject(data.subject);
          setNoteContent(data.content);
        } catch (err) {
          console.error("Error fetching note:", err);
          setError("Failed to load note. It might not exist or there's a server issue.");
        } finally {
          setLoading(false);
        }
      }
    };

    loadNoteData();
  }, [noteId, isNewNote, searchParams, router, BACKEND_URL]); // Added BACKEND_URL to dependency array

  const handleSaveNote = async () => {
    if (title.trim() === '' || subject.trim() === '') {
      alert('Title and Subject are required to save the note.');
      return;
    }

    setIsSaving(true);
    const method = isNewNote ? 'POST' : 'PUT';
    const url = isNewNote ? `${BACKEND_URL}/api/notes` : `${BACKEND_URL}/api/notes/${noteId}`;

    console.log(`${method}ing note:`, { title, subject, content: noteContent });
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, subject, content: noteContent }),
      });

      if (response.ok) {
        const savedNote = await response.json();
        alert('Note saved successfully!');
        console.log('Note saved:', savedNote);
        router.push('/notes');
      } else {
        const errorData = await response.json();
        alert(`Failed to save note: ${errorData.msg || response.statusText}`);
        console.error('Failed to save note:', errorData);
      }
    } catch (error) {
      alert('An error occurred while saving the note. Check console for details.');
      console.error('Save note error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (isNewNote) {
      alert("Cannot delete a note that hasn't been saved yet.");
      return;
    }

    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Note deleted successfully!');
        router.push('/notes');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete note: ${errorData.msg || response.statusText}`);
        console.error('Failed to delete note:', errorData);
      }
    } catch (error) {
      alert('An error occurred while deleting the note. Check console for details.');
      console.error('Delete note error:', error);
    }
  };

  const insertLatex = (latexCode, type) => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const currentContent = editor.value;

    const newContent = currentContent.substring(0, start) + latexCode + currentContent.substring(end);
    setNoteContent(newContent);

    let adjustedCursorPosition = start + latexCode.length;

    const placeholderIndex = latexCode.indexOf('{}');
    const parenIndex = latexCode.indexOf('()');
    const bracketIndex = latexCode.indexOf('[]');
    const sqrtIndex = latexCode.indexOf('\\sqrt{}');

    if (placeholderIndex !== -1) {
      adjustedCursorPosition = start + placeholderIndex + 1;
    } else if (parenIndex !== -1) {
      adjustedCursorPosition = start + parenIndex + 1;
    } else if (bracketIndex !== -1) {
      adjustedCursorPosition = start + bracketIndex + 1;
    } else if (sqrtIndex !== -1) {
      // Find the first ' {} ' after '\sqrt'
      adjustedCursorPosition = start + latexCode.indexOf('{}', sqrtIndex) + 1;
    } else if (latexCode.includes('{}_{}') || latexCode.includes('{}^{}')) {
      // For subscript/superscript, place cursor inside the first brace
      const firstBraceIndex = latexCode.indexOf('{');
      if (firstBraceIndex !== -1) {
        adjustedCursorPosition = start + firstBraceIndex + 1;
      }
    }

    setTimeout(() => {
      editor.selectionStart = adjustedCursorPosition;
      editor.selectionEnd = adjustedCursorPosition;
      editor.focus();
    }, 0);
  };

  const onToggleMathEnvironment = (entering) => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const currentContent = editor.value;

    let textToInsert = '';
    let newCursorPosition = start;
    let newContent = '';

    if (entering) {
      // Insert new line then "$ $" and place cursor between '$ $'
      textToInsert = '\n$ $';
      newContent = currentContent.substring(0, start) + textToInsert + currentContent.substring(end);
      newCursorPosition = start + '\n$ '.length; // Position after the first $ and space
    } else {
      // If exiting, we just update the content and cursor might not move much
      // For a more robust solution, one might check if the cursor is currently inside a math block
      // and intelligently remove the delimiters. For now, we just proceed.
      newContent = currentContent.substring(0, start) + textToInsert + currentContent.substring(end);
      newCursorPosition = start + textToInsert.length;
      newContent += '\n'; // Add a newline after exiting math environment
      newCursorPosition += '\n'.length;
    }

    setNoteContent(newContent);

    // Set cursor position after content update
    setTimeout(() => {
      editor.selectionStart = newCursorPosition;
      editor.selectionEnd = newCursorPosition;
      editor.focus();
    }, 0);
  };

  const handleUndo = () => {
    if (editorRef.current) {
      document.execCommand('undo');
    }
  };

  const handleRedo = () => {
    if (editorRef.current) {
      document.execCommand('redo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Apply max-w-7xl here */}
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/notes')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">{subject}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleUndo}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Undo (Ctrl+Z)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                onClick={handleRedo}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Redo (Ctrl+Y)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              {!isNewNote && (
                <button
                  onClick={handleDeleteNote}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Delete Note"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={handleSaveNote}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  isNewNote ? 'Create Note' : 'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"> {/* Apply max-w-7xl here */}
        {/* Toolbar */}
        <div className="mb-6">
          <NoteToolbar onInsertLatex={insertLatex} onToggleMathEnvironment={onToggleMathEnvironment} />
        </div>

        {/* Editor and Preview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="bg-white border border-gray-300 rounded-lg">
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Editor</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>LaTeX supported</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <textarea
                ref={editorRef}
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 resize-none font-mono text-sm text-gray-900 placeholder-gray-500"
                placeholder={`Start typing your notes here...

• Use the 'Enter Math Mode' button in the toolbar to start/end inline math ($ $).
• For display math, type $$...$$ or \\[...\\] directly.

Example: The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
Display: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$`}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white border border-gray-300 rounded-lg">
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Live Preview</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Auto-updating</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="h-96 overflow-y-auto">
                <LaTeXPreview content={noteContent} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}