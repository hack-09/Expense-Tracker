// Placeholder.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaArrowLeft, FaRocket, FaClock } from "react-icons/fa";

const Placeholder = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white mx-auto shadow-2xl animate-bounce-slow">
            <FaRocket />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
            <FaClock className="text-white text-sm" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We're working hard to bring you something amazing! This page is currently under construction and will be available soon.
          </p>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Features Coming Soon */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {['Modern Design', 'User Friendly', 'Powerful Features'].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2 mx-auto">
                  {index + 1}
                </div>
                <div className="text-sm font-semibold text-gray-700">{feature}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-3 bg-gray-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaArrowLeft />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <FaHome />
              Back to Home
            </button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 mb-2">Need immediate assistance?</p>
            <a 
              href="mailto:support@expensetracker.com"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              support@expensetracker.com
            </a>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-6 h-6 bg-yellow-400 rounded-full opacity-60 animate-float-1"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400 rounded-full opacity-40 animate-float-2"></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-purple-400 rounded-full opacity-50 animate-float-3"></div>
        <div className="absolute bottom-10 right-10 w-7 h-7 bg-green-400 rounded-full opacity-30 animate-float-4"></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-1 { animation: float 7s ease-in-out infinite; }
        .animate-float-2 { animation: float 5s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float 6s ease-in-out infinite 2s; }
        .animate-float-4 { animation: float 8s ease-in-out infinite 1.5s; }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Placeholder;