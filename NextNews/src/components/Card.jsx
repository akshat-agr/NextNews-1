import React from "react";

const Card = ({ icon, title, description }) => {
  return (
    <div className="border border-gray-500 p-6 rounded-xl text-center bg-white/10 backdrop-blur-lg shadow-lg transition-transform transform hover:scale-105 hover:border-gray-300 hover:shadow-2xl">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
  );
};

export default Card;
