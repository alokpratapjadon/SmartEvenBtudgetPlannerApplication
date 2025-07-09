import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import ErrorMessage from '../../components/common/ErrorMessage';
import Logo from '../../components/common/Logo';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Star, Shield, Zap, Heart, Sparkles, Award, Users, Calendar } from 'lucide-react';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Enhanced benefits animation with images
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Create your first legendary event in under 60 seconds with our AI-powered wizard",
      color: "from-yellow-400 to-orange-500",
      image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is protected with military-grade encryption and advanced threat detection",
      color: "from-green-400 to-emerald-500",
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Users,
      title: "Loved by 100K+ Planners",
      description: "Join the largest community of professional event planners and enthusiasts worldwide",
      color: "from-pink-400 to-red-500",
      image: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Award,
      title: "Premium Features Included",
      description: "Access all pro features including AI recommendations, analytics, and priority support",
      color: "from-purple-400 to-indigo-500",
      image: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      icon: Calendar,
      title: "Smart Event Intelligence",
      description: "AI-powered insights help you create better events with predictive analytics and trends",
      color: "from-cyan-400 to-blue-500",
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate password strength
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, fullName.trim());
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        
        {/* Enhanced floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-10 animate-float"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Left Side - Enhanced Benefits Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center items-center text-white p-12 w-full">
          <div className="mb-8 animate-fadeIn text-center">
            {/* Enhanced Logo */}
            <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-amber-500/30 shadow-2xl">
              <Logo size="lg" showText={true} className="text-white drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
              Start Your Legend
            </h1>
            <p className="text-xl text-indigo-100 max-w-lg leading-relaxed drop-shadow-sm">
              Join the elite community of event planners creating extraordinary experiences
            </p>
          </div>

          {/* Enhanced Benefits Showcase with Images */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-lg w-full border border-white/20 mb-8 shadow-2xl">
            <div className="relative h-72 overflow-hidden rounded-2xl mb-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentBenefit 
                        ? 'translate-y-0 opacity-100 scale-100' 
                        : index < currentBenefit 
                          ? '-translate-y-full opacity-0 scale-95' 
                          : 'translate-y-full opacity-0 scale-95'
                    }`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-2xl" />
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center transform hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon size={32} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3 text-white drop-shadow-lg">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed drop-shadow-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Benefit Indicators */}
            <div className="flex justify-center space-x-3">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBenefit(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === currentBenefit 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-600 w-12 shadow-lg' 
                      : 'bg-white/30 w-3 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Enhanced Social Proof */}
          <div className="text-center">
            <div className="flex justify-center items-center space-x-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="text-indigo-200 text-lg drop-shadow-sm mb-2">
              "Eventra transformed our event planning process completely!"
            </p>
            <p className="text-indigo-300 text-sm drop-shadow-sm">
              - Sarah Johnson, Professional Event Coordinator
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-indigo-200">
              <span className="flex items-center">
                <Sparkles size={16} className="mr-1 text-amber-400" />
                100K+ Users
              </span>
              <span className="flex items-center">
                <Heart size={16} className="mr-1 text-pink-400" />
                99% Satisfaction
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Enhanced Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30">
              <Logo size="lg" showText={true} />
            </div>
          </div>
          
          <div className="text-center animate-slideIn">
            <h2 className="text-4xl font-bold text-white mb-2">
              Create your legend
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">
              Start planning extraordinary events today
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/20 animate-fadeIn">
            {error && <ErrorMessage message={error} />}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'fullName' ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      <User size={20} />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 transition-all duration-200 ${
                        focusedField === 'fullName' 
                          ? 'ring-2 ring-amber-400 border-transparent transform scale-105 shadow-lg' 
                          : 'hover:border-white/40 hover:bg-white/15'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                </div>

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
                      autoComplete="new-password"
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
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Enhanced Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-300">Password strength:</span>
                        <span className={`font-medium ${
                          passwordStrength < 50 ? 'text-red-400' : 
                          passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                      focusedField === 'confirmPassword' ? 'text-amber-400' : 'text-gray-400'
                    }`}>
                      <Lock size={20} />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 transition-all duration-200 ${
                        focusedField === 'confirmPassword' 
                          ? 'ring-2 ring-amber-400 border-transparent transform scale-105 shadow-lg' 
                          : 'hover:border-white/40 hover:bg-white/15'
                      } ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-red-400 ring-red-400' 
                          : confirmPassword && password === confirmPassword 
                            ? 'border-green-400 ring-green-400' 
                            : ''
                      }`}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {/* Enhanced Password Match Indicator */}
                  {confirmPassword && (
                    <div className="mt-2 flex items-center text-sm">
                      {password === confirmPassword ? (
                        <div className="flex items-center text-green-400">
                          <Check size={16} className="mr-2" />
                          Passwords match perfectly
                        </div>
                      ) : (
                        <div className="text-red-400">
                          Passwords don't match
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-colors bg-white/10"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-white">
                    I agree to the{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 font-medium hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-amber-400 hover:text-amber-300 font-medium hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group relative overflow-hidden"
                  disabled={isLoading || !agreedToTerms}
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
                      Creating your legend...
                    </div>
                  ) : (
                    <>
                      <Sparkles size={20} className="mr-2 group-hover:animate-pulse" />
                      Create Account
                      <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-indigo-200">
                Already have an account?{' '}
                <Link 
                  to="/signin" 
                  className="font-medium text-amber-400 hover:text-amber-300 transition-colors hover:underline"
                >
                  Sign in to continue
                </Link>
              </p>
            </div>

            {/* Enhanced Features List */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <h4 className="text-sm font-medium text-white mb-4 text-center">What you get with Eventra:</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Unlimited events & guests',
                  'AI budget recommendations',
                  'Real-time expense tracking',
                  'Beautiful analytics dashboard',
                  'Calendar integrations',
                  'RSVP management',
                  'Payment processing',
                  'Priority support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-indigo-200">
                    <Check size={14} className="text-green-400 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;