import React from 'react';

export default function HistoryModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Full History</h2>
        <p className="mb-2"><strong>Question:</strong></p>
        <p className="text-gray-800 mb-4">{item.question}</p>
        <p className="mb-2"><strong>Answer:</strong></p>
        <p className="text-gray-800 mb-4">{item.answer}</p>
        <p className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()} at{' '}
          {new Date(item.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
