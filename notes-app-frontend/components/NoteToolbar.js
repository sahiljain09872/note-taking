// components/NoteToolbar.js
"use client";

import React, { useState } from 'react';

// Define symbol data for Math, Physics, Chemistry
const symbolData = {
  math: [
    { label: 'α', latex: '\\alpha', type: 'inline-symbol' },
    { label: 'β', latex: '\\beta', type: 'inline-symbol' },
    { label: 'γ', latex: '\\gamma', type: 'inline-symbol' },
    { label: 'θ', latex: '\\theta', type: 'inline-symbol' },
    { label: 'π', latex: '\\pi', type: 'inline-symbol' },
    { label: '°', latex: '\\degree', type: 'inline-symbol' },
    { label: '∞', latex: '\\infty', type: 'inline-symbol' },
    { label: '=', latex: '=', type: 'inline-symbol' },
    { label: '+', latex: '+', type: 'inline-symbol' },
    { label: '−', latex: '-', type: 'inline-symbol' },
    { label: '×', latex: '\\times', type: 'inline-symbol' },
    { label: '÷', latex: '\\div', type: 'inline-symbol' },
    { label: '⊂', latex: '\\subset', type: 'inline-symbol' },
    { label: '∈', latex: '\\in', type: 'inline-symbol' },
    { label: '∉', latex: '\\notin', type: 'inline-symbol' },
    { label: '∂', latex: '\\partial', type: 'inline-symbol' },
    { label: '…', latex: '\\dots', type: 'inline-symbol' },
    { label: '∑', latex: '\\sum', type: 'structure' },
    { label: '∫', latex: '\\int', type: 'structure' },
    { label: 'a⁄b', latex: '\\frac{}{}', type: 'structure' },
    { label: '√', latex: '\\sqrt{}', type: 'structure' },
    { label: 'lim', latex: '\\lim', type: 'structure' },
    { label: '→', latex: '\\vec{}', type: 'structure' },
    { label: '( )', latex: '()', type: 'structure' },
    { label: '[ ]', latex: '[]', type: 'structure' },
    { label: '{ }', latex: '{}', type: 'structure' },
    { label: '|x|', latex: '|{}|', type: 'structure' },
    { label: '‖x‖', latex: '\\|{} \\|', type: 'structure' },
  ],
  physics: [
  { label: 'Δ', latex: '\\Delta', type: 'inline-symbol' },
  { label: 'λ', latex: '\\lambda', type: 'inline-symbol' },
  { label: 'μ', latex: '\\mu', type: 'inline-symbol' },
  { label: 'σ', latex: '\\sigma', type: 'inline-symbol' },
  { label: 'Ω', latex: '\\Omega', type: 'inline-symbol' },
  { label: '𝐅', latex: 'F', type: 'inline-symbol' },
  { label: '𝑚', latex: 'm', type: 'inline-symbol' },
  { label: '𝑎', latex: 'a', type: 'inline-symbol' },
  { label: '𝑣', latex: 'v', type: 'inline-symbol' },
  { label: '𝑡', latex: 't', type: 'inline-symbol' },
  { label: '𝐄', latex: 'E', type: 'inline-symbol' },
  { label: '𝐏', latex: 'P', type: 'inline-symbol' },
  { label: '𝐖', latex: 'W', type: 'inline-symbol' },
  { label: 'ℎ', latex: 'h', type: 'inline-symbol' },
  { label: '𝐆', latex: 'G', type: 'inline-symbol' },
  { label: '𝑐', latex: 'c', type: 'inline-symbol' },
  { label: '𝑅', latex: 'R', type: 'inline-symbol' },
  { label: '𝐈', latex: 'I', type: 'inline-symbol' },
  { label: '𝐕', latex: 'V', type: 'inline-symbol' },
  { label: '⋅', latex: '\\cdot', type: 'inline-symbol' },
  { label: '×', latex: '\\times', type: 'inline-symbol' },
  { label: '→', latex: '\\rightarrow', type: 'inline-symbol' },
  { label: '→⃗', latex: '\\vec{}', type: 'structure' },
  { label: 'xₐ', latex: '{}_{}', type: 'structure' },
  { label: 'xᵃ', latex: '{}^{}', type: 'structure' },
]
,
  chemistry: [
  { label: '→', latex: '\\rightarrow', type: 'inline-symbol' },
  { label: '⇌', latex: '\\rightleftharpoons', type: 'inline-symbol' },
  { label: '⟶', latex: '\\xrightarrow{}', type: 'structure' },
  { label: '⇄', latex: '\\rightleftarrows', type: 'inline-symbol' },
  { label: '(s)', latex: '(s)', type: 'inline-symbol' },
  { label: '(l)', latex: '(l)', type: 'inline-symbol' },
  { label: '(g)', latex: '(g)', type: 'inline-symbol' },
  { label: '(aq)', latex: '(aq)', type: 'inline-symbol' },
  { label: 'ΔH', latex: '\\Delta H', type: 'inline-symbol' },
  { label: 'ΔG', latex: '\\Delta G', type: 'inline-symbol' },
  { label: 'ΔS', latex: '\\Delta S', type: 'inline-symbol' },
  { label: '±', latex: '\\pm', type: 'inline-symbol' },
  { label: '≈', latex: '\\approx', type: 'inline-symbol' },
  { label: '°', latex: '^\\circ', type: 'inline-symbol' },
  { label: 'x⁺', latex: '{}^{}', type: 'structure' },
  { label: 'H₂O', latex: '{}_{}', type: 'structure' },
  { label: 'α', latex: '\\alpha', type: 'inline-symbol' },
  { label: 'β', latex: '\\beta', type: 'inline-symbol' },
  { label: 'γ', latex: '\\gamma', type: 'inline-symbol' },
]
,
};

const NoteToolbar = ({ onInsertLatex, onToggleMathEnvironment }) => {
  const [activeTab, setActiveTab] = useState('math');
  const [isMathMode, setIsMathMode] = useState(false);

  const handleToggle = () => {
    onToggleMathEnvironment(!isMathMode);
    setIsMathMode(!isMathMode);
  };

  const handleSymbolClick = (latexCode, type) => {
    if (isMathMode) {
      onInsertLatex(latexCode, type);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-300">
      {/* Toolbar Tabs (small navbar) */}
      <div className="flex border-b border-gray-200 mb-4">
        {/* Toggle Math Mode Button */}
        <button
          onClick={handleToggle}
          className={`py-2 px-4 text-sm font-medium rounded-t-lg transition duration-200 mr-2
            ${isMathMode
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white' 
            }`}
          title={isMathMode ? "Exit Math Mode ($)" : "Enter Math Mode ($)"}
        >
          {isMathMode ? 'Exit Math Mode' : 'Enter Math Mode'}
        </button>

        {Object.keys(symbolData).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`py-2 px-4 text-sm font-medium rounded-t-lg transition duration-200
              ${activeTab === key
                ? 'bg-gray-900 text-white' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Symbols Display Area */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {symbolData[activeTab].map((symbol, index) => (
          <button
            key={index}
            disabled={!isMathMode}
            onClick={() => handleSymbolClick(symbol.latex, symbol.type)}
            className={`
              text-sm py-2 px-3 rounded-md transition duration-200 flex items-center justify-center
              ${isMathMode
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-900' 
                : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-70' 
              }
            `}
            title={isMathMode ? `Insert ${symbol.label}: ${symbol.latex}` : "Enter Math Mode first to use symbols"}
          >
            {symbol.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoteToolbar;