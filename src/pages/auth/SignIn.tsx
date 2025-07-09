import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ErrorMessage from '../../components/common/ErrorMessage';
import Logo from '../../components/common/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Calendar, DollarSign, Users, BarChart3, Sparkles, Star, TrendingUp, Zap } from 'lucide-react';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Enhanced features animation with more variety
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: Calendar,
      title: "Smart Event Planning",
      description: "Create and manage events with AI-powered budget suggestions and timeline management",
      color: "from-blue-500 to-cyan-500",
      image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: DollarSign,
      title: "Intelligent Budget Tracking",
      description: "Real-time expense monitoring with predictive analytics and smart categorization",
      color: "from-emerald-500 to-teal-500",
      image: "https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Users,
      title: "Advanced Guest Management",
      description: "Seamless RSVP system with dietary preferences and automated reminders",
      color: "from-purple-500 to-pink-500",
      image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Beautiful dashboards with actionable insights and performance metrics",
      color: "from-orange-500 to-red-500",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Recommendations",
      description: "Get personalized suggestions for vendors, venues, and budget optimization",
      color: "from-indigo-500 to-purple-500",
      image: "https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Left Side - Enhanced Features Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="mb-8 animate-fadeIn">
            {/* Enhanced Logo with better contrast */}
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-amber-500/30 shadow-2xl">
              <Logo size="lg" showText={true} className="text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              Welcome to Eventra
            </h1>
            <p className="text-xl text-purple-100 max-w-md text-center leading-relaxed drop-shadow-sm">
              Where legendary events come to life with intelligent planning
            </p>
          </div>

          {/* Enhanced Feature Showcase with Images */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full border border-white/20 shadow-2xl">
            <div className="relative h-80 overflow-hidden rounded-2xl mb-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentFeature 
                        ? 'translate-x-0 opacity-100 scale-100' 
                        : index < currentFeature 
                          ? '-translate-x-full opacity-0 scale-95' 
                          : 'translate-x-full opacity-0 scale-95'
                    }`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed drop-shadow-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Feature Indicators */}
            <div className="flex justify-center space-x-3">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === currentFeature 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 w-12 shadow-lg' 
                      : 'bg-white/30 w-3 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Stats with Icons */}
          <div className="grid grid-cols-3 gap-8 mt-8 text-center">
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white drop-shadow-sm">50K+</div>
              </div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Events Created</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2">
                <DollarSign className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white drop-shadow-sm">$10M+</div>
              </div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Budget Managed</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2">
                <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white drop-shadow-sm">99%</div>
              </div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30">
              <Logo size="lg" showText={true} />
            </div>
          </div>
          
          <div className="text-center animate-slideIn">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-purple-200 mb-8 text-lg">
              Sign in to continue your legendary journey
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 animate-fadeIn">
            {error && <ErrorMessage message={error} />}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      <Mail size={20} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'ring-2 ring-amber-400 border-transparent transform scale-105 shadow-lg' 
                          : 'hover:border-white/40 hover:bg-white/15'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      <Lock size={20} />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 transition-all duration-200 ${
                        focusedField === 'password' 
                          ? 'ring-2 ring-amber-400 border-transparent transform scale-105 shadow-lg' 
                          : 'hover:border-white/40 hover:bg-white/15'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-amber-400 hover:text-amber-300 transition-colors hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    <>
                      <Zap size={20} className="mr-2 group-hover:animate-pulse" />
                      Sign in
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-purple-200">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-amber-400 hover:text-amber-300 transition-colors hover:underline"
                >
                  Create your legend
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <div className="flex items-center justify-center space-x-6 text-xs text-purple-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  Secure Login
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  24/7 Support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;