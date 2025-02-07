import React, { useEffect, useState } from "react";
import { Menu, Bell, User, Search, Play, Star, StarHalf, StarOff } from "lucide-react";
import { Link, redirect } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { Star, StarHalf, StarOff } from "lucide-react";

const Homepage = () => {
  const [gl, setGl] = useState("");
  const [q, setQ] = useState("");

  const [featuredNews, setFeaturedNews] = useState([]);
  const navigate = useNavigate(); // Correct way to handle navigation in React Router

  const renderStars = (rating) => {
    if (!rating || rating === 0) {
      return <span className="text-gray-400 text-sm">N/A</span>;
    }
  
    const stars = [];
    const maxStars = 5;
  
    for (let i = 1; i <= maxStars; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} className="text-yellow-400 w-5 h-5" />);
      } else if (i - 0.5 === rating) {
        stars.push(<StarHalf key={i} className="text-yellow-400 w-5 h-5" />);
      } else {
        stars.push(<StarOff key={i} className="text-gray-400 w-5 h-5" />);
      }
    }
  
    return stars;
  };
  
  // Fetch Trending News from Flask
  const fetchTrendingNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/extract_top_trending_news");
      setFeaturedNews(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetching trending news:", error);
    }
  };

  useEffect(() => {
    fetchTrendingNews();
  }, []);

  // Search Handler
  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:5000/scrape", { gl, q });
      window.scrollTo(0, document.body.scrollHeight);
      console.log(response);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const newsCategories = [
    { name: "Politics", count: "24" },
    { name: "Sports", count: "18" },
    { name: "Entertainment", count: "15" },
    { name: "Technology", count: "20" },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      {/* Search Inputs */}
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">AI News Scraper</h1>
        <p className="text-white/70 mb-6">
          Get the latest news by entering a country code and a search query.
        </p>
</div>
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
      </div>

      {/* Categories Section */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {newsCategories.map((category) => (
          <div key={category.name} className="bg-[#3B0764] p-4 rounded-lg text-white">
            <h3 className="font-bold">{category.name}</h3>
            <p className="text-sm text-white/60">{category.count} stories</p>
          </div>
        ))}
      </div>

      {/* Featured News Section */}
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-white text-xl font-bold mb-4">Featured Stories</h2>
        <div className="space-y-4">
  {featuredNews.length > 0 ? (
    featuredNews.map((news, index) => (
      <Link key={index} to={`/news/${index}`} state={{ news }}>
        <div className="bg-[#3B0764] p-4 rounded-lg text-white flex cursor-pointer hover:bg-[#5B2A89] transition">
          {/* Image */}
                <img src={news.thumbnail} alt={news.title} className="w-24 h-24 object-cover rounded-lg mr-4" />
          {/* News Content */}
          <div className="flex-1">
            <h3 className="font-bold mb-2">{news.title}</h3>
          </div>
          <div className="flex items-center space-x-1">
              {renderStars(news.rating)}
              <span className="ml-2 text-gray-300 text-sm">({news.rating})</span>
            </div>
        </div>
      </Link>
    ))
  ) : (
    <p className="text-white text-center">Loading news...</p>
  )}
</div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <Link to="/demo/anchor">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
            Anchor
          </button>
        </Link>
        <Link to="/">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
