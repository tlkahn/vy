import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  return currentHour < 4 || currentHour >= 18
    ? 'Good night'
    : currentHour < 12
    ? 'Good morning'
    : 'Good afternoon';
};

function MainComponent() {
  const [categories, setCategories] = useState([]);
  const [logo, setLogo] = useState('');
  const [greetingMsg, setGreetingMsg] = useState('');
  const [tags, setTags] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  const handleLogin = () => {
    // Perform your login logic here, and then update the state:
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform your logout logic here, and then update the state:
    setIsLoggedIn(false);
  };

  const updateGreetingMessage = () => {
    const greeting = getGreetingMessage();
    const personalizedGreeting = isLoggedIn
      ? `${greeting}, ${userName}`
      : greeting;
    setGreetingMsg(personalizedGreeting);
  };

  const scrollContainerRefs = useRef(new Map());
  const listItemRefs = useRef(new Map());
  const searchInputRef = useRef(null);

  const handleSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const setRefs = (tagId, element, isScrollContainer) => {
    (isScrollContainer ? scrollContainerRefs : listItemRefs).current.set(
      tagId,
      element
    );
  };

  const scroll = (tagId, direction) => {
    const scrollContainer = scrollContainerRefs.current.get(tagId);
    const listItem = listItemRefs.current.get(tagId);
    if (!scrollContainer || !listItem) return;
    const itemWidth = listItem.offsetWidth * direction;
    scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  const scrollBack = (tagId) => scroll(tagId, -1);
  const scrollForward = (tagId) => scroll(tagId, 1);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data));

    updateGreetingMessage();

    // Fetch tags
    fetch('http://localhost:3000/api/tags')
      .then((response) => response.json())
      .then((data) => setTags(data));
  }, []);

  const logoUrl = 'http://localhost:3000/images/logo.svg';

  return (
    <div className="scene-video-background bg-gray-700 text-white min-h-screen">
      <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0 md:space-x-8">
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
                  <Link
                    to={category.url}
                    className="flex items-center space-x-2"
                  >
                    <span className="inline-flex items-center justify-center w-6">
                      <i
                        className={`fa ${category.icon}`}
                        aria-hidden="true"
                      ></i>
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
        <main id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
          <div className="header mb-8 flex justify-between items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                ref={searchInputRef}
                placeholder={greetingMsg}
                className="text-3xl font-bold border-0 focus:ring-0 focus:outline-none bg-transparent w-full"
              />
              <button
                onClick={handleSearchFocus}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                <i className="fa fa-search" aria-hidden="true" />
              </button>
            </div>
          </div>
          {tags.map((tag, index) => (
            <div className="tag-container mb-2 space-y-2" key={index}>
              <div className="tag-header flex justify-between items-center">
                <div className="tag-title">
                  <h2 className="text-xl font-bold">{tag.title}</h2>
                </div>
                <div className="tag-scroller">
                  <div className="horizontal-scroller px-1">
                    <button
                      className="scroll-btn scroll-back"
                      onClick={() => scrollBack(index)}
                    >
                      <i className="fa fa-chevron-left" aria-hidden="true"></i>
                    </button>
                    <button
                      className="scroll-btn scroll-forward px-1"
                      onClick={() => scrollForward(index)}
                    >
                      <i className="fa fa-chevron-right" aria-hidden="true"></i>
                    </button>
                    <button className="show-all-btn px-1">
                      <i className="fa fa-th" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="tag-contents">
                <ul
                  ref={(el) => setRefs(index, el, true)}
                  className="flex overflow-x-scroll space-x-4 text-left"
                >
                  {tag.sequences.map((sequence, index) => (
                    <li
                      key={sequence.id}
                      className="mb-4 flex-shrink-0 w-2/3 md:w-2/5 lg:w-2/7"
                      ref={(el) => setRefs(index, el, false)}
                    >
                      <Link
                        to={sequence.url}
                        className="sequence-btn flex-col space-y-4"
                      >
                        <div className="w-full relative overflow-hidden rounded-md aspect-w-1 aspect-h-1">
                          <img
                            src={sequence.cover}
                            alt={sequence.title}
                            className="absolute inset-0 w-full h-auto object-cover transform transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {sequence.title}
                        </h3>
                        <p className="text-sm">{sequence.updateDateTime}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default MainComponent;
