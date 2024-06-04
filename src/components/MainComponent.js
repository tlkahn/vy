import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';
import api from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faSearch,
  faTh,
} from '@fortawesome/free-solid-svg-icons';

const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  return currentHour < 4 || currentHour >= 18
    ? 'Good night'
    : currentHour < 12
    ? 'Good morning'
    : 'Good afternoon';
};

function MainComponent() {
  const [greetingMsg, setGreetingMsg] = useState('');
  const [tags, setTags] = useState([]);
  const [userJwt, setUserJwt] = useState(null);

  useEffect(() => {
    const greeting = getGreetingMessage();
    const personalizedGreeting = userJwt
      ? `${greeting}, ${userJwt.displayName}`
      : greeting;
    setGreetingMsg(personalizedGreeting);
  }, [userJwt]);

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
    api.get('/tags').then((response) => setTags(response.data));
  }, []);

  useEffect(() => {
    let localUserJwt = JSON.parse(localStorage.getItem('userJwt'));
    if (localUserJwt?.uid) {
      setUserJwt(localUserJwt);
    }
  }, []);

  return (
    <div className="scene-video-background bg-gray-700 text-white min-h-screen">
      <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full">
        <SideMenu />
        <main id="main-content" className="w-full md:w-3/4 lg:w-6/7 pt-4">
          <div className="header mb-8 flex justify-between items-center">
            <div className="relative flex-grow flex items-center">
              <button
                onClick={handleSearchFocus}
                className="text-2xl absolute left-0 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <input
                type="text"
                ref={searchInputRef}
                placeholder={greetingMsg}
                className="text-2xl font-bold border-0 focus:ring-0 focus:outline-none bg-transparent w-full pl-8"
              />
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
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button
                      className="scroll-btn scroll-forward px-1"
                      onClick={() => scrollForward(index)}
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <button className="show-all-btn px-1">
                      <FontAwesomeIcon icon={faTh} />
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
