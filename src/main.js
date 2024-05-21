import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MainComponent() {
  const [categories, setCategories] = useState([]);
  const [greetingMsg, setGreetingMsg] = useState('');
  const [logo, setLogo] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost:3000/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data));

    // Fetch greeting message
    fetch('http://localhost:3000/api/greeting')
      .then(response => response.json())
      .then(data => setGreetingMsg(data.message));

    // Fetch tags
    fetch('http://localhost:3000/api/tags')
      .then(response => response.json())
      .then(data => setTags(data));
  }, []);

  let logoUrl = "http://localhost:3000/images/logo.svg";

  return (
    <div className="scene-video-background bg-gray-900 text-white">
      <video />
      <div className="main container mx-auto px-4">
        <aside className="flex flex-col">
          <Link to="/" className="logo-wrapper">
            <img src={logoUrl} alt="Logo" />
          </Link>
          <nav>
            <ul>
              {categories.map(category => (
                <li key={category.id}>
                  <Link to={category.url} className="flex items-center space-x-2">
                    <div>
                      <svg>{category.icon}</svg>
                    </div>
                    <div>{category.name}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link to="/privacy" target="_blank" className="mt-auto">Privacy Policy</Link>
        </aside>
        <main id="main-content" className="ml-4">
          <div className="header mb-8">
            <h1 className="text-3xl font-bold">{greetingMsg}</h1>
            <Link to="/app/search">
              <svg>{/* Search icon */}</svg>
            </Link>
          </div>
          {tags.map(tag => (
            <div className="tag-container mb-8" key={tag.id}>
              <div className="tag-header">
                <h2 className="text-xl font-bold">{tag.title}</h2>
              </div>
              <div className="tag-contents">
                <ul>
                  {tag.sequences.map(sequence => (
                    <li key={sequence.id} className="mb-4">
                      <Link to={sequence.url} className="sequence-btn flex space-x-4 items-center">
                        <div>
                          <img src={sequence.cover} alt={sequence.title} className="w-16 h-16 object-cover rounded-md" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{sequence.title}</h3>
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
