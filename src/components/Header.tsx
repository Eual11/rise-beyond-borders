
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Heart } from 'lucide-react';

const navItems = [
  { label: 'About', section: 'about' },
  { label: 'Programs', section: 'programs' },
  { label: 'Hub', section: 'hub' },
  { label: 'Impact', section: 'impact' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img className='h-12' src='/images/logo.png'/>
              <Heart className="h-4 w-4 text-orange-500 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Rise Beyond Borders
              </h1>
              <p className="text-xs text-gray-600">Youth-Led • Ethiopia</p>
            </div>
          </div>

          {/* Desktop Navigation - expand on hover */}
          <div
            className="hidden md:block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 ease-out flex items-center gap-6 ${
                isHovered ? 'px-8 py-4' : 'px-6 py-3'
              }`}
            >
              <div
                className={`flex items-center gap-6 overflow-hidden transition-all duration-500 ease-out ${
                  isHovered ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {navItems.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.section)}
                    className={`text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 whitespace-nowrap hover:scale-105 relative group ${
                      isHovered ? 'translate-x-0' : 'translate-x-4'
                    }`}
                    style={{
                      transitionDelay: isHovered ? `${index * 50}ms` : '0ms',
                    }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                  </button>
                ))}
              </div>
              <button
                onClick={() => scrollToSection('contact')}
                className={`bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex-shrink-0 ${
                  isHovered ? 'ml-2' : 'ml-0'
                }`}
              >
                Get Involved
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200">
            <nav className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.section)}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 w-fit"
              >
                Get Involved
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
