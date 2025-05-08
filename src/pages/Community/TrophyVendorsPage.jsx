import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiStar, FiAward, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { FaTrophy, FaMedal, FaCertificate, FaRegMoneyBillAlt } from 'react-icons/fa';
import backButton from '../../assets/kumar/right-chevron.png'
const TrophyVendorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Sample vendor data
  const vendors = [
    {
      id: 1,
      name: 'Elite Trophy Designs',
      rating: 4.8,
      orders: 1560,
      deliveryTime: '3-5 days',
      minOrder: '$100',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2d08SvvnMpDnYPqxUfbG3E1CGWmfnq9kwNw&s',
      bio: 'Premium trophy manufacturer specializing in cricket awards with 20 years of experience in crafting exquisite pieces.',
      available: true,
      products: [
        { id: 1, type: 'trophy', name: 'Champions Cup', price: '$45', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 2, type: 'medal', name: 'Gold Medal', price: '$12', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }
      ],
      services: ['custom-engraving', 'express-delivery', 'bulk-discounts'],
      featured: true
    },
    {
      id: 2,
      name: 'Cricket Awards Co.',
      rating: 4.6,
      orders: 980,
      deliveryTime: '5-7 days',
      minOrder: '$75',
      image: 'https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      bio: 'Specialists in cricket-themed awards with a focus on quality craftsmanship and innovative designs.',
      available: true,
      products: [
        { id: 3, type: 'trophy', name: 'Golden Bat Award', price: '$65', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 4, type: 'plaque', name: 'Hall of Fame Plaque', price: '$85', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }
      ],
      services: ['custom-design', 'bulk-discounts'],
      featured: false
    },
    {
      id: 3,
      name: 'Victory Trophies',
      rating: 4.9,
      orders: 2240,
      deliveryTime: '2-4 days',
      minOrder: '$150',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmI6bdnxlFbUEl-f2lj818iqLP42ZXCSe3Vw&s',
      bio: 'Industry leader in sports trophies with a dedicated cricket collection and fastest turnaround times.',
      available: true,
      products: [
        { id: 5, type: 'medal', name: 'Silver Medal', price: '$10', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 6, type: 'certificate', name: 'Achievement Certificate', price: '$8', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }
      ],
      services: ['express-delivery', 'custom-engraving', 'custom-design'],
      featured: true
    },
    {
      id: 4,
      name: 'Golden Wickets Awards',
      rating: 4.4,
      orders: 720,
      deliveryTime: '7-10 days',
      minOrder: '$50',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      bio: 'Budget-friendly trophy solutions without compromising on quality, perfect for local cricket clubs.',
      available: true,
      products: [
        { id: 7, type: 'trophy', name: 'Player of the Series', price: '$55', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' },
        { id: 8, type: 'medal', name: 'Bronze Medal', price: '$8', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }
      ],
      services: ['bulk-discounts'],
      featured: false
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'featured') return matchesSearch && vendor.featured;
    if (activeTab === 'express') return matchesSearch && vendor.services.includes('express-delivery');
    return matchesSearch;
  });

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const getServiceIcon = (service) => {
    switch (service) {
      case 'custom-engraving': return <FiAward className="inline mr-1" />;
      case 'express-delivery': return <FiTruck className="inline mr-1" />;
      case 'custom-design': return <FaTrophy className="inline mr-1" />;
      case 'bulk-discounts': return <FaRegMoneyBillAlt className="inline mr-1" />;
      default: return <FiShield className="inline mr-1" />;
    }
  };

  const getProductIcon = (type) => {
    switch (type) {
      case 'trophy': return <FaTrophy className="inline mr-1" />;
      case 'medal': return <FaMedal className="inline mr-1" />;
      case 'plaque': return <FiAward className="inline mr-1" />;
      case 'certificate': return <FaCertificate className="inline mr-1" />;
      default: return <FiAward className="inline mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f28] to-[#06122e] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center mb-8">
          <img
                                      src={backButton}
                                      alt="Back"
                                      className="h-8 w-8 cursor-pointer -scale-x-100"
                                      onClick={() => window.history.back()}
                                    />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Cricket Trophy Vendors</h1>
            <p className="text-blue-300">Find the perfect awards for your cricket tournaments</p>
          </div>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name or service..."
              className="w-full pl-10 pr-4 py-2 bg-[#0b1a3b] border border-blue-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaTrophy className="text-blue-400" />
            <select 
              className="bg-[#0b1a3b] border border-blue-600/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="all">All Vendors</option>
              <option value="featured">Featured</option>
              <option value="express">Express Delivery</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        {selectedVendor ? (
          // Vendor Detail View
          <div className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-6 shadow-lg">
            <button 
              onClick={() => setSelectedVendor(null)}
              className="mb-4 flex items-center text-blue-400 hover:text-blue-300"
            >
              ← Back to all vendors
            </button>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img 
                  src={selectedVendor.image} 
                  alt={selectedVendor.name} 
                  className="w-full h-auto rounded-lg object-cover border-2 border-blue-500"
                />
                <div className="mt-4 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-300">
                    Min Order: {selectedVendor.minOrder}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <FiStar className="mr-1" />
                    <span>{selectedVendor.rating}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-bold text-blue-400 mb-2">Services:</h3>
                  <div className="space-y-2">
                    {selectedVendor.services.map((service, index) => (
                      <div key={index} className="flex items-center">
                        {getServiceIcon(service)}
                        <span className="ml-2 capitalize">
                          {service.split('-').join(' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold mb-2">{selectedVendor.name}</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-blue-300">
                    <FiTruck className="mr-2" />
                    <span>Delivery: {selectedVendor.deliveryTime}</span>
                  </div>
                  <div className="flex items-center text-blue-300">
                    <FaRegMoneyBillAlt className="mr-2" />
                    <span>{selectedVendor.orders}+ orders completed</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedVendor.bio}</p>
                
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-4">Available Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedVendor.products.map((product) => (
                      <div key={product.id} className="border border-blue-600/30 rounded-lg p-4 hover:border-blue-400 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {getProductIcon(product.type)}
                              {product.name}
                            </h4>
                            <p className="text-blue-400 font-bold mt-1">{product.price}</p>
                            <button 
                              onClick={() => addToCart(product)}
                              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-full flex items-center"
                            >
                              <FiShoppingCart className="mr-1" /> Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vendor List View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map(vendor => (
              <div 
                key={vendor.id} 
                className="bg-[#0b1a3b] border border-blue-600/50 rounded-xl p-4 hover:border-blue-400 transition-all cursor-pointer hover:shadow-lg group"
                onClick={() => setSelectedVendor(vendor)}
              >
                <div className="flex items-start gap-4">
                  <img 
                    src={vendor.image} 
                    alt={vendor.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-300 transition-colors"
                  />
                  <div>
                    <h3 className="font-bold">{vendor.name}</h3>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <FiStar className="mr-1" />
                      <span>{vendor.rating}</span>
                    </div>
                    <div className="flex items-center text-blue-300 text-sm mt-1">
                      <FiTruck className="mr-1" />
                      <span>{vendor.deliveryTime} delivery</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {vendor.services.slice(0, 2).map((service, index) => (
                        <span key={index} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded capitalize">
                          {service.split('-').join(' ')}
                        </span>
                      ))}
                      {vendor.services.length > 2 && (
                        <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">
                          +{vendor.services.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">From {vendor.minOrder}</span>
                  {vendor.featured && (
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-900 text-yellow-300">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Stats */}
        {!selectedVendor && (
          <div className="mt-12 bg-[#0b1a3b]/50 border border-blue-600/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Trophy Vendor Network</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{vendors.length}+</p>
                <p className="text-gray-400">Verified Vendors</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{vendors.filter(v => v.featured).length}</p>
                <p className="text-gray-400">Featured Suppliers</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{vendors.reduce((acc, v) => acc + v.orders, 0)}+</p>
                <p className="text-gray-400">Orders Completed</p>
              </div>
              <div className="bg-[#0b1a3b] border border-blue-600/30 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">4.7</p>
                <p className="text-gray-400">Average Rating</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Indicator */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
            <div className="relative">
              <FiShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrophyVendorsPage;