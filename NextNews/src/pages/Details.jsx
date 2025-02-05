import { useLocation, Link } from "react-router-dom";
import React from "react";

const NewsDetail = () => {
  const location = useLocation();
  const news = location.state?.news;

  // Check if news is available, otherwise show a message
  if (!news) {
    return <div className="text-white text-center">Click the link to refer to source.</div>;
  }

  // Destructure the necessary properties
  const { title, thumbnail, description, link } = news;

  return (
    <div className="min-h-screen bg-[#1E1B4B] p-6 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Title with Increased Size */}
        <h1 className="text-4xl font-bold text-center mb-6">{title}</h1>

        {/* Horizontal Line Above Image Card */}
        <hr className="border-t-2 border-white/30 mb-4" />

        {/* Image Card with Reduced Border Radius and Padding */}
        {thumbnail && (
          <div className="bg-[#5B2A89] p-2 rounded-xl shadow-lg mx-auto max-w-md mb-6">
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-96 object-cover rounded-lg mb-2"
            />
          </div>
        )}

        {/* Horizontal Line Below Image Card */}
        <hr className="border-t-2 border-white/30 mb-4" />

        {/* Description Styling */}
        <p className="mt-4 text-lg text-center">{description || "Click the link to refer to the source."}</p>

        {/* Read Full Article Link */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 mt-4 block text-center"
          >
            Read Full Article
          </a>
        )}

        {/* Go Back Button */}
        <Link
          to="/"
          className="block mt-6 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;
