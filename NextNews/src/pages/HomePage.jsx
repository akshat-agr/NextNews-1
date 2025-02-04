import React, { useState } from "react";
import { Menu, Bell, User, Search, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  
  const [gl, setGl] = useState("");
  const [q, setQ] = useState("");

  const newsCategories = [
    { name: "Politics", count: "24" },
    { name: "Sports", count: "18" },
    { name: "Entertainment", count: "15" },
    { name: "Technology", count: "20" },
  ];
  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:5000/scrape", { gl, q });
      console.log(response);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };
  const featuredNews = [
    {
      title: "Major Tech Breakthrough in AI Development",
      source: "TechDaily",
      rating: "4.8",
      time: "2h ago",
    },
    {
      title: "Global Summit Addresses Climate Change",
      source: "WorldNews",
      rating: "4.9",
      time: "3h ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1E1B4B]">
     
      <div className="p-4">
      <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Country code (gl)..."
            value={gl}
            onChange={(e) => setGl(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white/10 text-white border border-white/20 mb-4"
          />
          <input
            type="text"
            placeholder="Search query (q)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white/10 text-white border border-white/20 mb-4"
          />
          <button
            onClick={handleSearch}
            className="w-full p-3 pl-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search
          </button>
          <Search className="absolute left-3 top-3 text-white/60" />
        </div>

        <Link to="/demo/anchor">
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
          Anchor
        </button>
      </Link>


      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {newsCategories.map((category) => (
          <div
            key={category.name}
            className="bg-[#3B0764] p-4 rounded-lg text-white"
          >
            <h3 className="font-bold">{category.name}</h3>
            <p className="text-sm text-white/60">{category.count} stories</p>
          </div>
        ))}
      </div>
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-white text-xl font-bold mb-4">Featured Stories</h2>
        <div className="space-y-4">
          {featuredNews.map((news) => (
            <div
              key={news.title}
              className="bg-[#3B0764] p-4 rounded-lg text-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold mb-2">{news.title}</h3>
                  <p className="text-sm text-white/60">
                    {news.source} • {news.time}
                  </p>
                </div>
                <div className="flex items-center bg-white/10 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-sm">{news.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Link to="/">
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
          Go Back
        </button>
      </Link>
    </div>
  );
};

export default Homepage;
