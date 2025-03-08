// src/components/PronunciationModal.jsx

import React from "react";

const PronunciationModal = ({ isOpen, onClose, videoTitle, videoUrl }) => {
  if (!isOpen) return null;

  // Convert a standard YouTube watch URL to an embed URL
  let embedUrl = "";
  if (videoUrl) {
    const videoId = new URL(videoUrl).searchParams.get("v");
    if (videoId) {
      // Optionally, autoplay the video by adding ?autoplay=1
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold text-gray-700 hover:text-gray-900"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">{videoTitle}</h2>
        {embedUrl ? (
          <div className="w-full aspect-video mb-4">
            <iframe
              src={embedUrl}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        ) : (
          <p className="text-center mb-4">No video found.</p>
        )}
      </div>
    </div>
  );
};

export default PronunciationModal;
