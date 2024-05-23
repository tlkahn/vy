import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const logoUrl = 'http://localhost:3000/images/logo.svg';

const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data));
  });

  return (
    <aside className="flex flex-col w-full md:w-1/4 lg:w-1/7 pt-4 pl-4 pr-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/home" className="logo-wrapper">
          <img src={logoUrl} alt="Logo" />
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
        >
          <i className="fa fa-bars" aria-hidden="true"></i>
        </button>
      </div>
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="space-y-4 mt-4">
          {categories.map((category) => (
            <li key={category.id} className="hover:bg-gray-800 rounded">
              <Link to={category.url} className="flex items-center space-x-2">
                <span className="inline-flex items-center justify-center w-6">
                  <i className={`fa ${category.icon}`} aria-hidden="true"></i>
                </span>
                <span className="text-2xl">{category.title}</span>
              </Link>
            </li>
          ))}
          <li key="sign-out" className="hover:bg-gray-800 rounded">
            <button
              onClick={() => handleNavigation('/logout')}
              className="block w-full text-left space-x-2 focus:outline-none whitespace-nowrap flex items-center"
            >
              <span className="inline-flex items-center justify-center w-6">
                <i className="fa fa-sign-out" aria-hidden="true"></i>
              </span>
              <span className="text-2xl">Sign out</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
