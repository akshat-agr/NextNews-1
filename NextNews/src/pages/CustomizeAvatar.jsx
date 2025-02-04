import React from "react";
import { ArrowLeft, Maximize2, Camera, Save } from "lucide-react";
import { Link } from "react-router-dom";

const CustomizeAvatar = () => {
  const characteristics = [
    { name: "Gender", options: ["Male", "Female"] },
    { name: "Age", options: ["Young", "Middle-aged", "Senior"] },
    { name: "Style", options: ["Professional", "Casual", "Formal"] },
  ];

  return (
    <div className="min-h-screen bg-[#1E1B4B]">
      {/* Header */}
      <nav className="bg-[#3B0764] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/demo/anchor">
            <ArrowLeft className="text-white" />
          </Link>

          <h1 className="text-white text-lg font-medium">
            Customize Your Anchor
          </h1>
        </div>
        <button className="bg-white/10 px-4 py-2 rounded text-white flex items-center space-x-2">
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Avatar Preview */}
          <div className="bg-[#4A044E] rounded-lg p-6">
            <div className="relative">
              <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-white/50" />
              </div>
              <button className="absolute top-2 right-2 bg-white/10 p-2 rounded-lg">
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="bg-white/20 px-4 py-2 rounded text-white">
                Preview Animation
              </button>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="space-y-6 text-white">
            {characteristics.map((char) => (
              <div key={char.name} className="bg-[#3B0764] p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3">{char.name}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {char.options.map((option) => (
                    <button
                      key={option}
                      className="bg-white/10 px-3 py-2 rounded hover:bg-white/20 transition"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Voice Settings */}
            <div className="bg-[#3B0764] p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Voice Settings</h3>
              <div className="space-y-4">
                <select className="w-full bg-white/10 p-2 rounded">
                  <option>Natural Voice 1</option>
                  <option>Natural Voice 2</option>
                  <option>Professional Voice</option>
                </select>
                <div>
                  <label className="block text-sm mb-2">Speech Rate</label>
                  <input type="range" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-2">Pitch</label>
                  <input type="range" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeAvatar;
