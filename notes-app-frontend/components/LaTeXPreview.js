// components/LaTeXPreview.js
"use client"; // Ensure this is a client component

import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const LaTeXPreview = ({ content }) => {
  const previewRef = useRef(null);

  useEffect(() => {
    if (previewRef.current && content) {
      let processedHtml = '';
      const regexInline = /\$(.*?)\$/g; // Matches $...$

      // Combined regex for display math delimiters: \\[...\\] or $$...$$
      const combinedDisplayRegex = /(\\\[.*?\\\]|\$\$.*?\$\$)/gs;

      let parts = [];
      let lastIndex = 0;

      let match;
      while ((match = combinedDisplayRegex.exec(content)) !== null) {
        // Add preceding non-math text
        if (match.index > lastIndex) {
          parts.push({ text: content.substring(lastIndex, match.index), type: 'text' });
        }
        // Add math block
        parts.push({ text: match[0], type: 'math' });
        lastIndex = combinedDisplayRegex.lastIndex;
      }
      // Add any remaining text
      if (lastIndex < content.length) {
        parts.push({ text: content.substring(lastIndex), type: 'text' });
      }

      // Process each part
      processedHtml = parts.map(part => {
        if (part.type === 'math') {
          // If it's a display math block, render it
          let equation = part.text;

          // Remove delimiters for rendering
          if (equation.startsWith('\\[') && equation.endsWith('\\]')) {
            equation = equation.slice(2, -2);
          } else if (equation.startsWith('$$') && equation.endsWith('$$')) {
            equation = equation.slice(2, -2);
          }

          try {
            return katex.renderToString(equation, {
              throwOnError: false,
              displayMode: true, // Render in display mode
            });
          } catch (error) {
            console.error("KaTeX rendering error (display mode):", error, "Equation:", equation);
            return `<span style="color: red;">Error: ${equation}</span>`;
          }
        } else {
          // It's a plain text part, process inline math and newlines
          let textWithInlineMath = '';
          let lastInlineIndex = 0;
          let inlineMatch;

          while ((inlineMatch = regexInline.exec(part.text)) !== null) {
            // Add preceding plain text, converting newlines to <br>
            if (inlineMatch.index > lastInlineIndex) {
              textWithInlineMath += part.text.substring(lastInlineIndex, inlineMatch.index).replace(/\n/g, '<br/>');
            }
            // Add inline math
            let inlineEquation = inlineMatch[1]; // Content inside $...$
            try {
              textWithInlineMath += katex.renderToString(inlineEquation, {
                throwOnError: false,
                displayMode: false, // Render inline
              });
            } catch (error) {
              console.error("KaTeX rendering error (inline mode):", error, "Equation:", inlineEquation);
              textWithInlineMath += `<span style="color: red;">Error: ${inlineEquation}</span>`;
            }
            lastInlineIndex = regexInline.lastIndex;
          }
          // Add any remaining plain text, converting newlines
          if (lastInlineIndex < part.text.length) {
            textWithInlineMath += part.text.substring(lastInlineIndex).replace(/\n/g, '<br/>');
          }
          return textWithInlineMath;
        }
      }).join(''); // Join all processed parts

      previewRef.current.innerHTML = processedHtml;

    } else if (previewRef.current) {
      previewRef.current.innerHTML = ''; // Clear if no content
    }
  }, [content]); // Re-run effect when content changes

  return (
    <div
      ref={previewRef}
      className="p-4 text-gray-900" // Removed bg-gray-800 and shadow-inner to match theme. Height managed by parent div.
    >
      {/* Content will be injected here */}
    </div>
  );
};

export default LaTeXPreview;