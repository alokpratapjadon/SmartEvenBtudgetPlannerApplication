import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ErrorMessage from '../../components/common/ErrorMessage';
import Logo from '../../components/common/Logo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Calendar, DollarSign, Users, BarChart3, User } from 'lucide-react';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Demo features animation
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = [
    {
      icon: Calendar,
      title: "Smart Event Planning",
      description: "Create and manage events with intelligent budget suggestions",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description: "Track expenses in real-time with visual progress indicators",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Guest Management",
      description: "Send invitations and manage RSVPs effortlessly",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Get insights with beautiful charts and downloadable reports",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fillDemoCredentials = () => {
    setEmail('alok123@ex.com');
    setPassword('alok123');
  };
  
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* Left Side - Features Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="mb-8 animate-fadeIn">
            {/* Enhanced Logo with better contrast */}
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-amber-500/30 shadow-2xl">
              <Logo size="lg" showText={true} className="text-white drop-shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
              Welcome to Eventra
            </h1>
            <p className="text-xl text-purple-100 max-w-md text-center leading-relaxed drop-shadow-sm">
              The smart way to plan, budget, and manage your perfect events
            </p>
          </div>

          {/* Feature Showcase */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="relative h-64 overflow-hidden">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 transform ${
                      index === currentFeature 
                        ? 'translate-y-0 opacity-100' 
                        : index < currentFeature 
                          ? '-translate-y-full opacity-0' 
                          : 'translate-y-full opacity-0'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-white drop-shadow-sm">
                        {feature.title}
                      </h3>
                      <p className="text-purple-100 leading-relaxed drop-shadow-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeature ? 'bg-white w-8' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 text-center">
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-white drop-shadow-sm">10K+</div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Events Created</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-white drop-shadow-sm">$2M+</div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Budget Managed</div>
            </div>
            <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <div className="text-2xl font-bold text-white drop-shadow-sm">98%</div>
              <div className="text-sm text-purple-200 drop-shadow-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <Logo size="lg" showText={true} />
          </div>
          
          <div className="text-center animate-slideIn">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to continue planning amazing events
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 animate-fadeIn">
            {error && <ErrorMessage message={error} />}
            
            {/* Demo Credentials Banner */}
            <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-amber-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Try Demo Account</p>
                    <p className="text-xs text-amber-600">alok123@ex.com / alok123</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  Use Demo
                </button>
              </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-indigo-500' : 'text-gray-400'
                    }`}>
                      <Mail size={18} />
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
                      className={`form-input pl-10 transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'ring-2 ring-indigo-500 border-transparent transform scale-105' 
                          : 'hover:border-gray-400'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'password' ? 'text-indigo-500' : 'text-gray-400'
                    }`}>
                      <Lock size={18} />
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
                      className={`form-input pl-10 pr-10 transition-all duration-200 ${
                        focusedField === 'password' 
                          ? 'ring-2 ring-indigo-500 border-transparent transform scale-105' 
                          : 'hover:border-gray-400'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Sign in
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors hover:underline"
                >
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Secure Login
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
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