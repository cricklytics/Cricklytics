import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../index.css';
import backButton from '../../assets/kumar/right-chevron.png';
import { useNavigate } from 'react-router-dom';


const plans = [
  {
    name: 'Bronze',
    price: { yearly: 'Free', monthly: 'Free' },
    features: {
      'AI Chatbot Support': true,
      'Core Features Access': true,
      'Add Tournament': true,
      'Start a Match': true,
      'Team, Tournament, Stats, Matches': true,
      'Scores, Commentators': true,
      Umpires: false,
      Streamers: true,
      Shops: true,
      Academics: true,
      Grounds: true,
      Trophy: true,
      'T-Shirts': true,
      'Bat Manufacturing': true,
      'Event Managers': false,
      Sponsors: false,
      Physio: false,
      Coach: false,
      'Leaderboard (Player Info Limit)': 'Up to 6 Players',
      'Instagram Feed Integration': true,
      'Find a Friend': true,
      'Clubs Module': false,
      'Go Live': false,
    },
  },
  {
    name: 'Silver',
    price: { yearly: '₹2500/Year', monthly: '₹210/Month' },
    features: {
      'AI Chatbot Support': true,
      'Core Features Access': true,
      'Add Tournament': true,
      'Start a Match': true,
      'Team, Tournament, Stats, Matches': true,
      'Scores, Commentators': true,
      Umpires: true,
      Streamers: true,
      Shops: true,
      Academics: true,
      Grounds: true,
      Trophy: true,
      'T-Shirts': true,
      'Bat Manufacturing': true,
      'Event Managers': false,
      Sponsors: false,
      Physio: false,
      Coach: false,
      'Leaderboard (Player Info Limit)': 'Up to 15 Players',
      'Instagram Feed Integration': true,
      'Find a Friend': true,
      'Clubs Module': true,
      'Go Live': '1 Live Stream + All Intl Streams',
    },
  },
  {
    name: 'Gold',
    price: { yearly: '₹5000/Year', monthly: '₹420/Month' },
    features: {
      'AI Chatbot Support': true,
      'Core Features Access': true,
      'Add Tournament': true,
      'Start a Match': true,
      'Team, Tournament, Stats, Matches': true,
      'Scores, Commentators': true,
      Umpires: true,
      Streamers: true,
      Shops: true,
      Academics: true,
      Grounds: true,
      Trophy: true,
      'T-Shirts': true,
      'Bat Manufacturing': true,
      'Event Managers': false,
      Sponsors: false,
      Physio: true,
      Coach: true,
      'Leaderboard (Player Info Limit)': 'Unlimited',
      'Instagram Feed Integration': true,
      'Find a Friend': true,
      'Clubs Module': true,
      'Go Live': 'Unlimited National + All Intl Streams',
    },
  },
  {
    name: 'Platinum',
    price: { yearly: '₹7500/Year', monthly: '₹630/Month' },
    features: {
      'AI Chatbot Support': true,
      'Core Features Access': true,
      'Add Tournament': true,
      'Start a Match': true,
      'Team, Tournament, Stats, Matches': true,
      'Scores, Commentators': true,
      Umpires: true,
      Streamers: true,
      Shops: true,
      Academics: true,
      Grounds: true,
      Trophy: true,
      'T-Shirts': true,
      'Bat Manufacturing': true,
      'Event Managers': true,
      Sponsors: true,
      Physio: true,
      Coach: true,
      'Leaderboard (Player Info Limit)': 'Unlimited',
      'Instagram Feed Integration': true,
      'Find a Friend': true,
      'Clubs Module': true,
      'Go Live': 'Unlimited National + All Intl Streams',
    },
  },
];

const faqs = [
  {
    question: 'What is included in the Core Features Access?',
    answer: 'Core Features include access to basic functionalities like viewing match stats, team management, and tournament tracking.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time through your account settings.',
  },
  {
    question: 'What does "Go Live" include?',
    answer: 'Go Live allows you to stream matches. Silver includes one live stream plus international streams, while Gold and Platinum offer unlimited national and international streams.',
  },
  {
    question: 'Is the AI Chatbot available 24/7?',
    answer: 'Yes, the AI Chatbot is available 24/7 across all plans to assist with your queries.',
  },
];

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 text-gray-100 relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <img 
          src={backButton}
          alt="Back"
          className="h-10 w-10 cursor-pointer -scale-x-100"
          onClick={() => navigate('/landingpage')}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 drop-shadow-lg">Cricklytics Subscription Plans</h1>
          <p className="mt-4 text-lg text-gray-300">Choose the perfect plan to elevate your cricket experience!</p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                billingCycle === 'yearly' ? 'bg-green-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
            <button
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                billingCycle === 'monthly' ? 'bg-green-500 text-gray-900' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 rounded-lg shadow-lg bg-gray-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-green-500"
            >
              <h2 className="text-2xl font-semibold text-green-400">{plan.name}</h2>
              <p className="mt-4 text-3xl font-bold text-gray-100">{plan.price[billingCycle]}</p>
              <ul className="mt-6 space-y-2">
                {Object.entries(plan.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center text-gray-300">
                    <span className="mr-2 text-lg">{value === true ? '✅' : value === false ? '🔒' : 'ℹ️'}</span>
                    {feature}{value !== true && value !== false ? `: ${value}` : ''}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full py-2 rounded-full transition-all duration-300 ${
                  plan.name === 'Bronze'
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-green-500 text-gray-900 hover:bg-green-600'
                } font-semibold`}
              >
                {plan.name === 'Bronze' ? 'Active' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 mb-12"
        >
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Compare Features Across Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead>
                <tr className="bg-green-900">
                  <th className="p-4">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-4 text-center">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(plans[0].features).map((feature) => (
                  <tr key={feature} className="border-t border-gray-700">
                    <td className="p-4">{feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="p-4 text-center">
                        {plan.features[feature] === true ? (
                          <span className="text-2xl">✅</span>
                        ) : plan.features[feature] === false ? (
                          <span className="text-2xl">🔒</span>
                        ) : (
                          plan.features[feature]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQs Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  className="w-full text-left text-lg font-semibold text-gray-100 flex justify-between items-center hover:text-green-400 transition-colors duration-300"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  {faq.question}
                  <span className="text-2xl">{activeFaq === index ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300 mt-2"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;