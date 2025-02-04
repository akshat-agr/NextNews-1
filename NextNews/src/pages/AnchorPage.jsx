import React, { useState } from "react";
import {
  Mic,
  MessageSquare,
  Video,
  Volume2,
  Maximize2,
  Settings,
  Radio,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Menu, Bell, User, Search, Play, Star, ArrowLeft } from "lucide-react";

const AnchorPage = () => {
  const [activeMode, setActiveMode] = useState("video");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1E1B4B]">
      <nav className="bg-[#3B0764] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/demo">
            <ArrowLeft className="text-white" />
          </Link>

          <h1 className="text-white text-lg font-medium">
            Your AI-Powered News Experience
          </h1>
        </div>
      </nav>

      <div className="bg-[#4A044E] p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-lg">
            <div className="w-32 h-32 bg-gray-600 rounded-lg flex items-center justify-center">
              <Play className="w-12 h-12" />
            </div>
            <div>
              <p className="text-lg mb-2">Meet Your Virtual Anchor</p>
              <Link to="/demo/anchor/customize">
                <button className="cursor-pointer mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
                  Customize Avatar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}

      <div className="max-w-6xl mx-auto p-4 flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mode Toggle */}
          <div className="bg-[#3B0764] p-2 rounded-lg inline-flex mb-4">
            <button
              className={`px-4 py-2 rounded flex items-center space-x-2 ${
                activeMode === "video"
                  ? "bg-[#4A044E] text-white"
                  : "text-white/70"
              }`}
              onClick={() => setActiveMode("video")}
            >
              <Video className="w-4 h-4" />
              <span>Video</span>
            </button>
            <button
              className={`px-4 py-2 rounded flex items-center space-x-2 ${
                activeMode === "audio"
                  ? "bg-[#4A044E] text-white"
                  : "text-white/70"
              }`}
              onClick={() => setActiveMode("audio")}
            >
              <Radio className="w-4 h-4" />
              <span>Audio</span>
            </button>
          </div>

          {/* Assistant Display Area */}
          <div className="bg-[#4A044E] rounded-lg overflow-hidden">
            <div className="relative">
              {/* Video/Audio Visualization Area */}
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                {activeMode === "video" ? (
                  <div className="w-64 h-64 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white/50">AI Avatar</span>
                  </div>
                ) : (
                  <div className="w-64 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                    <Volume2 className="w-16 h-16 text-white/50" />
                  </div>
                )}
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interaction Area */}
            <div className="p-6 flex items-center justify-center space-x-6">
              <button
                className={`p-4 rounded-full ${
                  isMicActive ? "bg-red-500" : "bg-white/10"
                } text-white hover:bg-white/20 transition-colors`}
                onClick={() => setIsMicActive(!isMicActive)}
              >
                <Mic className="w-6 h-6" />
              </button>
              <button
                className={`p-4 rounded-full ${
                  isChatOpen ? "bg-[#3B0764]" : "bg-white/10"
                } text-white hover:bg-white/20 transition-colors`}
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-96 bg-[#3B0764] rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-medium">Chat with Assistant</h2>
              <button
                className="text-white/70 hover:text-white"
                onClick={() => setIsChatOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 min-h-[400px] bg-[#1E1B4B] rounded-lg mb-4 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-[#4A044E] p-3 rounded-lg text-white max-w-[80%]">
                  How can I help you understand the news better?
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your question..."
                className="flex-1 bg-white/10 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <button className="p-3 bg-white/10 rounded-lg text-white hover:bg-white/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnchorPage;
