import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "YouTube", type: "route" },
    { href: "/instagram", label: "Instagram", type: "route" },
    { href: "#about", label: "About", type: "hash" }
  ];

  const linkClasses =
    "px-3 py-2 text-gray-700 text-base font-medium transition-all duration-200 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600";

  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', href);
    }
  };

  const renderNavItems = (isMobile = false) => {
    return navItems.map((item, index) => {
      const additionalClasses = isMobile ? " block" : "";
      const handleClick = isMobile ? () => setIsMobileMenuOpen(false) : undefined;

      if (item.type === "hash") {
        return (
          <a
            key={index}
            href={item.href}
            className={`${linkClasses}${additionalClasses}`}
            onClick={(e) => {
              handleHashClick(e, item.href);
              if (isMobile) setIsMobileMenuOpen(false);
            }}
          >
            {item.label}
          </a>
        );
      }
      return (
        <NavLink
          key={index}
          to={item.href}
          className={({ isActive }: { isActive: boolean }) =>
            `${linkClasses}${additionalClasses} ${isActive ? "border-blue-600 text-blue-600" : ""}`
          }
          onClick={handleClick}
        >
          {item.label}
        </NavLink>
      );
    });
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 rounded-full mx-4 mt-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-800 text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-500 text-white text-xl font-bold mr-1 shadow-sm">
              R
            </span>
            <span className="text-gray-800">azTube</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {renderNavItems()}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {renderNavItems()}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
