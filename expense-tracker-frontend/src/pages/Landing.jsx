// Landing.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaChartPie, FaLock, FaRocket, FaUser, FaStar, FaPlay, FaPause, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPlaying, setIsPlaying] = useState(true);
  const statsRef = useRef(null);
  const [stats, setStats] = useState({
    users: 0,
    expenses: 0,
    savings: 0
  });

  // Check if user is already logged in
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      // If user is already logged in, redirect to dashboard
      navigate("/expenses");
    }
  }, [token, navigate]);

  // Animated counter effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate counters
          animateCounter(5000, 12500, "users");
          animateCounter(25000, 89250, "expenses");
          animateCounter(1000, 3500, "savings");
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = (start, end, key) => {
    const duration = 2000;
    const steps = 60;
    const stepValue = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setStats(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, duration / steps);
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelancer",
      content: "This app helped me save 30% more by tracking my small daily expenses!",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "Student",
      content: "As a student on a budget, this has been a game-changer for managing my finances.",
      avatar: "👨‍🎓",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Small Business Owner",
      content: "The reporting features gave me insights I never had before. Highly recommend!",
      avatar: "👩‍💻",
      rating: 4
    }
  ];

  const features = [
    {
      icon: <FaRocket className="text-4xl text-blue-600 mb-4" />,
      title: "Easy to Use",
      description: "Add expenses in seconds and view them instantly.",
      details: "One-click expense logging with smart categorization and recurring expense setup."
    },
    {
      icon: <FaChartPie className="text-4xl text-green-500 mb-4" />,
      title: "Insightful Reports",
      description: "Analyze your spending with charts and summaries.",
      details: "Interactive pie charts, spending trends, and customizable reporting periods."
    },
    {
      icon: <FaLock className="text-4xl text-red-500 mb-4" />,
      title: "Bank-Level Security",
      description: "Your data stays safe and private with encrypted storage.",
      details: "End-to-end encryption, regular security audits, and GDPR compliance."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Add Expenses",
      description: "Quickly log your expenses with our intuitive interface",
      icon: "📝"
    },
    {
      step: "2",
      title: "Categorize & Analyze",
      description: "Automatically categorize spending and view detailed reports",
      icon: "📊"
    },
    {
      step: "3",
      title: "Save & Plan",
      description: "Set budgets and savings goals based on your insights",
      icon: "🎯"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      {/* Enhanced Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating coins */}
          <div className="absolute top-20 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-float-1">💰</div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-yellow-300 rounded-full opacity-70 animate-float-2">💵</div>
          <div className="absolute bottom-20 left-20 w-7 h-7 bg-yellow-200 rounded-full opacity-50 animate-float-3">💳</div>
          
          {/* Chart icons */}
          <div className="absolute top-32 right-32 text-2xl opacity-40 animate-float-4">📈</div>
          <div className="absolute bottom-32 right-40 text-xl opacity-30 animate-float-5">📊</div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2 text-sm">
              <FaLock className="text-green-400" />
              <span>Secure • 12,500+ Users • GDPR Compliant</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fadeIn">
            Take Control of Your <span className="text-yellow-400">Finances</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 animate-fadeIn delay-200 max-w-3xl mx-auto">
            Track your expenses effortlessly and achieve your financial goals with intelligent insights
          </p>

          {/* Animated Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{stats.users.toLocaleString()}+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{stats.expenses.toLocaleString()}+</div>
              <div className="text-white/80">Expenses Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">${stats.savings.toLocaleString()}+</div>
              <div className="text-white/80">Total Saved</div>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold hover:scale-105 transition transform shadow-lg hover:shadow-xl animate-pulse-slow flex items-center gap-2"
            >
              <FaRocket />
              Start Free Trial
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition transform shadow-lg border border-white/30"
            >
              Login
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("expense-dashboard-demo");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }} // Changed from /expenses to /preview
              className="bg-transparent text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transition transform border-2 border-white/50 hover:border-white"
            >
              Live Demo
            </button>
          </div>
        </div>

        {/* Enhanced decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full opacity-15 translate-x-1/3 translate-y-1/3 animate-pulse"></div>
      </header>

      {/* Enhanced Features Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose Expense Tracker?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Powerful, secure, and simple tools to transform how you manage your finances.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group perspective-1000 border-4 border-transparent hover:border-blue-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all bg-gradient-to-br from-white to-gray-50"
            >
              <div className="relative preserve-3d group-hover:rotate-y-180 transition-transform duration-500 w-full h-80">
                {/* Front of card */}
                <div className="absolute inset-0 backface-hidden bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-4 text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Hover to learn more →
                  </div>
                </div>
                
                {/* Back of card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 flex flex-col justify-center text-center">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">{feature.title}</h3>
                  <p className="text-blue-800 mb-4">{feature.details}</p>
                  <div className="text-blue-600 text-sm font-semibold">
                    ✓ Included in all plans
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works in 3 Simple Steps</h2>
          <p className="text-gray-600 text-lg">Start managing your finances like a pro in minutes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl text-white font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Dashboard Preview */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Interactive Dashboard Preview</h2>
            <p className="text-gray-600 mb-8">Experience the power of our analytics</p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 mb-8">
              {["overview", "charts", "categories"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Play/Pause Demo */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
                {isPlaying ? "Pause Demo" : "Play Demo"}
              </button>
              <span className="text-sm text-gray-500">
                {isPlaying ? "Live data simulation running" : "Demo paused"}
              </span>
            </div>
          </div>

          {/* Interactive Dashboard */}
          <div id="expense-dashboard-demo" className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Mock Dashboard Header */}
            <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaChartPie />
                </div>
                <div>
                  <h3 className="font-bold">Expense Dashboard</h3>
                  <p className="text-gray-300 text-sm">Real-time financial overview</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <div className="text-2xl font-bold text-blue-900">$2,847</div>
                  <div className="text-blue-600">Monthly Spending</div>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500">
                  <div className="text-2xl font-bold text-green-900">$1,253</div>
                  <div className="text-green-600">Monthly Budget</div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                  <div className="text-2xl font-bold text-purple-900">27%</div>
                  <div className="text-purple-600">Savings Rate</div>
                </div>
              </div>

              {/* Chart Placeholder with Hover Effects */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-semibold text-gray-700">Spending Overview</h4>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full cursor-pointer hover:scale-125 transition" title="Food & Dining"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full cursor-pointer hover:scale-125 transition" title="Transportation"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full cursor-pointer hover:scale-125 transition" title="Entertainment"></div>
                  </div>
                </div>
                <div className="h-64 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <p className="text-gray-500">Interactive chart visualization</p>
                    <p className="text-sm text-gray-400 mt-2">Hover over dots to see details</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have transformed their financial health
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div className="text-left">
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-gray-500 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-left italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 12,500+ users who are already saving more and spending smarter
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold hover:scale-105 transition transform shadow-2xl text-lg flex items-center gap-3"
            >
              <FaRocket />
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition shadow-lg text-lg"
            >
              Sign In
            </button>
          </div>
          <p className="mt-6 text-blue-200 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Expense Tracker</h3>
              <p className="text-gray-400 mb-4">
                Take control of your finances with our intelligent expense tracking platform.
              </p>
              <div className="flex gap-4">
                <FaTwitter className="cursor-pointer hover:text-white transition" />
                <FaLinkedin className="cursor-pointer hover:text-white transition" />
                <FaGithub className="cursor-pointer hover:text-white transition" />
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/api" className="hover:text-white transition">API</Link></li>
                <li><Link to="/integrations" className="hover:text-white transition">Integrations</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
                <li><Link to="/gdpr" className="hover:text-white transition">GDPR</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>© 2025 Expense Tracker. All rights reserved. Built with ❤️ for better financial health.</p>
          </div>
        </div>
      </footer>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-1 { animation: float 6s ease-in-out infinite; }
        .animate-float-2 { animation: float 7s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float 5s ease-in-out infinite 2s; }
        .animate-float-4 { animation: float 8s ease-in-out infinite; }
        .animate-float-5 { animation: float 6s ease-in-out infinite 1.5s; }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;