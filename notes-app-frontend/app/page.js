// app/page.js
"use client";

import React, { useState } from 'react';
import NewNoteModal from '../components/NewNoteModal';
import Link from 'next/link';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Notes</h1>
            </div>
            <nav className="flex items-center space-x-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors duration-200 text-sm font-medium"
              >
                New Note
              </button>
              <Link href="/notes">
                <button className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium">
                  All Notes
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-20">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Notes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Organize your thoughts with powerful LaTeX support. Create, edit, and manage your notes with ease.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
            <div 
              onClick={() => setIsModalOpen(true)}
              className="group bg-white border border-gray-300 rounded-xl p-8 hover:shadow-xl hover:border-gray-400 transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-black transition-colors duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Note</h3>
              <p className="text-gray-600 text-sm">Start writing your ideas with LaTeX support</p>
            </div>

            <Link href="/notes">
              <div className="group bg-white border border-gray-300 rounded-xl p-8 hover:shadow-xl hover:border-gray-400 transition-all duration-200 cursor-pointer h-full">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors duration-200">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Notes</h3>
                <p className="text-gray-600 text-sm">View and manage your existing notes</p>
              </div>
            </Link>
          </div>

        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Notes?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to enhance your note-taking experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">LaTeX Support</h4>
              <p className="text-gray-600 text-sm">Write mathematical expressions and formulas with ease</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Organized by Subject</h4>
              <p className="text-gray-600 text-sm">Keep your notes organized with subject-based categorization</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Quick Search</h4>
              <p className="text-gray-600 text-sm">Find your notes instantly with powerful search functionality</p>
            </div>
          </div>
        </div>
      </main>

      {/* New Note Modal */}
      <NewNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}