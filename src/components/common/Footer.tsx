import React from 'react';
import { Heart, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Logo size="md" showText={true} className="text-white" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Eventra is your smart event planning companion. Create unforgettable experiences 
              with intelligent budget management, expense tracking, and seamless payment processing.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                aria-label="View our GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <Mail size={16} className="mr-3 text-indigo-400" />
                <a href="mailto:hello@eventra.com" className="hover:text-white transition-colors">
                  hello@eventra.com
                </a>
              </li>
              <li className="flex items-center text-gray-300">
                <Phone size={16} className="mr-3 text-indigo-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-start text-gray-300">
                <MapPin size={16} className="mr-3 text-indigo-400 mt-0.5 flex-shrink-0" />
                <span>
                  123 Innovation Drive<br />
                  San Francisco, CA 94105
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <p className="flex items-center">
                © {currentYear} Eventra. Made with 
                <Heart size={14} className="mx-1 text-red-500" fill="currentColor" />
                for amazing events.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;