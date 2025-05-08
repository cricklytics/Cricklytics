import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiStar,
} from 'react-icons/fi';
import MRFlogo from "../../assets/yogesh/communityimg/MRFlogo.jpg"
import Kookaburra from "../../assets/yogesh/communityimg/Kookaburralogo.jpg"
import SSCricketHelmet from "../../assets/yogesh/communityimg/SS Cricket Helmet.jpg"
import IndiaODIJersey  from "../../assets/yogesh/communityimg/IndiaODIJersey 2023.jpg"
import BatGripTape from "../../assets/yogesh/communityimg/batgriptape.jpg"
import backButton from '../../assets/kumar/right-chevron.png'

const ShopsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('gear');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [cartItems, setCartItems] = useState({});

  const products = {
    gear: [
      {
        id: 1,
        name: 'MRF Genius Grand Edition Bat',
        price: 150,
        rating: 4.8,
        reviews: 124,
        image: MRFlogo,
        isNew: true,
      },
      {
        id: 2,
        name: 'Kookaburra Cricket Ball',
        price: 49,
        rating: 4.5,
        reviews: 89,
        image: Kookaburra,
        isNew: false,
        discount: 0,
      },
      {
        id: 3,
        name: 'SS Cricket Helmet',
        price: 79,
        rating: 4.6,
        reviews: 67,
        image: SSCricketHelmet,
        isNew: true,
      },
    ],
    jerseys: [
      {
        id: 4,
        name: 'India ODI Jersey 2023',
        price: 69.99,
        rating: 4.9,
        reviews: 215,
        image: IndiaODIJersey,
        isNew: true,
        discount: 0,
      },
    ],
    accessories: [
      {
        id: 5,
        name: 'Bat Grip Tape',
        price: 8.99,
        rating: 4.1,
        reviews: 28,
        image: BatGripTape,
        isNew: true,
      },
    ],
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addToCart = (id) => {
    setCartItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <section className="bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Red Back Button */}
        <img
                                    src={backButton}
                                    alt="Back"
                                    className="h-8 w-8 cursor-pointer -scale-x-100"
                                    onClick={() => window.history.back()}
                                  />

        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-400 mb-2">
            CricketZone Shop
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Explore top-quality cricket gear and accessories
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100" />
            <input
              type="text"
              placeholder="Search cricket products..."
              className="pl-10 pr-4 py-2 rounded-full text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide justify-center">
          {['gear', 'jerseys', 'accessories'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 mx-2 rounded-full ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products[activeTab].map((item) => (
            <div key={item.id} className="bg-[#111936] p-4 rounded-xl border border-blue-600/20 shadow-md relative group">
              {item.discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                  {item.discount}% OFF
                </span>
              )}
              {item.isNew && (
                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                  NEW
                </span>
              )}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
              <p className="text-blue-400 font-semibold mb-1">₹{item.price.toFixed(2)}</p>
              <div className="flex items-center text-yellow-400 text-sm mb-2">
                {[...Array(Math.round(item.rating))].map((_, idx) => (
                  <FiStar key={idx} />
                ))}
                <span className="text-gray-300 ml-2">({item.reviews})</span>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className={`p-2 rounded-full ${
                    favorites[item.id] ? 'bg-red-500' : 'bg-white text-black'
                  }`}
                >
                  <FiHeart />
                </button>
                <button
                  onClick={() => addToCart(item.id)}
                  className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
                >
                  <FiShoppingCart />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsPage;