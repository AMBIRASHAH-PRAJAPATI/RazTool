import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "YouTube" },
    { href: "/instagram", label: "Instagram" },
    { href: "#about", label: "About" }
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const buttonClasses = "px-3 py-2 text-gray-700 hover:text-red-500 text-lg";

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-800 text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500 text-white text-xl font-bold mr-1 shadow-sm">
              R
            </span>
            <span className="text-gray-800">azTube</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 md:space-x-6">
            {navItems.map((item, index) => (
              <Button 
                key={index}
                variant="ghost" 
                className={buttonClasses}
              >
                <a href={item.href} className="px-3 py-2">{item.label}</a>
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  className={`${buttonClasses} justify-start`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
