import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

function MainComponent() {
  const [categories, setCategories] = useState([]);
  const [greetingMsg, setGreetingMsg] = useState('');
  const [logo, setLogo] = useState('');
  const [tags, setTags] = useState([]);

  const scrollContainerRefs = useRef(new Map());
  const listItemRefs = useRef(new Map());

  const setRefs = (tagId, element, isScrollContainer) => {
    (isScrollContainer ? scrollContainerRefs : listItemRefs).current.set(
      tagId,
      element,
    );
  };
  const scrollBack = (tagId) => {
    const scrollContainer = scrollContainerRefs.current.get(tagId);
    const listItem = listItemRefs.current.get(tagId);
    if (!scrollContainer || !listItem) return;
    const itemWidth = listItem.offsetWidth;
    scrollContainer.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  };

  const scrollForward = (tagId) => {
    const scrollContainer = scrollContainerRefs.current.get(tagId);
    const listItem = listItemRefs.current.get(tagId);
    if (!scrollContainer || !listItem) return;
    const itemWidth = listItem.offsetWidth;
    scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Fetch greeting message
    fetch('http://localhost:3000/api/greeting')
      .then((response) => response.json())
      .then((data) => setGreetingMsg(data.message));

    // Fetch tags
    fetch('http://localhost:3000/api/tags')
      .then((response) => response.json())
      .then((data) => setTags(data));
  }, []);

  let logoUrl = 'http://localhost:3000/images/logo.svg';

  return (
    <div className="scene-video-background bg-gray-700 text-white min-h-screen">
      <div className="main container mx-auto px-4 py-8 flex flex-col md:flex-row h-full space-y-4 md:space-y-0 md:space-x-8">
        <aside className="flex flex-col w-full md:w-1/4 p-4 space-y-4">
          <Link to="/" className="logo-wrapper">
            <img src={logoUrl} alt="Logo" />
          </Link>
          <nav>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={category.url}
                    className="flex items-center space-x-2"
                  >
                    <div>
                      <i
                        className={`fa ${category.icon}`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>{category.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main id="main-content" className="w-full md:w-3/4">
          <div className="header mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">{greetingMsg}</h1>
            <Link to="/app/search">
              <i className="fa fa-search" aria-hidden="true" />
            </Link>
          </div>
          {tags.map((tag, index) => (
            <div className="tag-container mb-2 space-y-2">
              <div
                className="tag-header flex justify-between items-center"
                key={index}
              >
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
                  className="flex overflow-x-scroll space-x-4"
                >
                  {tag.sequences.map((sequence, index) => (
                    <li
                      key={sequence.id}
                      className="mb-4 flex-shrink-0"
                      ref={(el) => setRefs(index, el, false)}
                    >
                      <Link
                        to={sequence.url}
                        className="sequence-btn flex-col space-y-4"
                      >
                        <div>
                          <img
                            src={sequence.cover}
                            alt={sequence.title}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {sequence.title}
                          </h3>
                          <p className="text-sm">{sequence.author}</p>
                          <p className="text-sm">{sequence.updateDateTime}</p>
                        </div>
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
