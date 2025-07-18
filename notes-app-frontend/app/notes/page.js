// app/notes/page.js
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AllNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Get the backend URL from environment variables
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await fetch(`${BACKEND_URL}/api/notes`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        setError("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [BACKEND_URL]); // Added BACKEND_URL to dependency array

  // Extract unique subjects for the filter dropdown
  const uniqueSubjects = ['All', ...new Set(notes.map(note => note.subject))];

  // Filter notes based on selected subject and search term
  const filteredNotes = notes.filter(note => {
    const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading notes...</p>
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
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 text-sm font-medium">
                  New Note
                </button>
              </Link>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900"
            >
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'All' ? 'All subjects' : subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-300 rounded-lg p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedSubject !== 'All' ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedSubject !== 'All' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start by creating your first note!'
              }
            </p>
            <Link href="/">
              <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 font-medium">
                Create Note
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                {selectedSubject !== 'All' && ` in ${selectedSubject}`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map(note => (
                <Link key={note._id} href={`/note/${note._id}`}>
                  <div className="group bg-white border border-gray-300 rounded-lg p-6 hover:shadow-xl hover:border-gray-400 transition-all duration-200 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors duration-200 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 bg-gray-900 rounded-full mr-2"></span>
                        <span className="text-sm text-gray-700 font-medium">{note.subject}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Updated {new Date(note.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}