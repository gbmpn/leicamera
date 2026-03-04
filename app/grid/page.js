'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import InfiniteGrid from '../components/infinite-grid';
import "../grid.scss";

export default function Grid() {
  const galleryItems = [
    {src: '1.jpeg', description: '30 knots', caption: '30 knots <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2021'},
    {src: '2.jpeg', description: 'Sad Mis-Step', caption: 'Sad Mis-Step <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024'},
    {src: '3.jpeg', description: 'Mini Orange', caption: 'Mini Orange <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2014'},
    {src: '4.jpeg', description: 'After Storm', caption: 'After Storm <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
    {src: '5.jpeg', description: 'Untitled', caption: 'Untitled <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2016'},
    {src: '6.jpeg', description: 'Toilet Paper', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
    {src: '7.jpeg', description: 'Cocoa Eggplant Tomato', caption: 'Cocoa Eggplant Tomato <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2025'},
    {src: '8.jpeg', description: 'Toilet Paper', caption: 'Toilet Paper <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2022'},
    {src: '9.jpeg', description: 'Production Fun Fact (Eggs)', caption: 'Production Fun Fact (Eggs) <br>12 x 16 inch C type hand print <br>Edition of 1 Plus an additional artist Proof <br>2024'},
  ];
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [imageOrientation, setImageOrientation] = useState('landscape');
  const [imageObjectPosition, setImageObjectPosition] = useState('50% 50%');
  const closeTimerRef = useRef(null);

  const closeSidebar = () => {
    if (!selectedItem || isClosing) return;
    setIsClosing(true);
  };

  const openItem = (item) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    setIsClosing(false);
    setImageObjectPosition('50% 50%');
    setSelectedItem(item);
  };

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const isLandscape = naturalWidth >= naturalHeight;
    setImageOrientation(isLandscape ? 'landscape' : 'portrait');
    setImageObjectPosition('50% 50%');
  };

  const handleImageMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    if (imageOrientation === 'portrait') {
      setImageObjectPosition(`50% ${clampedY}%`);
      return;
    }

    setImageObjectPosition(`${clampedX}% 50%`);
  };

  useEffect(() => {
    if (!isClosing) return;

    closeTimerRef.current = window.setTimeout(() => {
      setSelectedItem(null);
      setIsClosing(false);
      setImageObjectPosition('50% 50%');
    }, 500);

    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, [isClosing]);

  useEffect(() => {
    const resize = () => {
      document.documentElement.style.setProperty(
        '--rvw',
        `${document.documentElement.clientWidth / 100}px`
      );
    };

    window.addEventListener('resize', resize);
    resize();

    const data = [
      {x: 71, y: 58, w: 400, h: 270},
      {x: 211, y: 255, w: 540, h: 360},
      {x: 631, y: 158, w: 400, h: 270},
      {x: 1191, y: 245, w: 260, h: 195},
      {x: 351, y: 687, w: 260, h: 290},
      {x: 751, y: 824, w: 205, h: 154},
      {x: 911, y: 540, w: 260, h: 350},
      {x: 1051, y: 803, w: 400, h: 300},
      {x: 71, y: 922, w: 350, h: 260},
    ];

    const grid = new InfiniteGrid({
      el: document.querySelector('#images'),
      sources: galleryItems,
      data,
      originalSize: { w: 1522, h: 1238 },
      onItemClick: (item) => openItem(item),
    });

    return () => {
      window.removeEventListener('resize', resize);

      // If InfiniteGrid has a destroy method, call it:
      if (grid?.destroy) grid.destroy();
    };
  }, []);

  return (
    <main id="main">
       
      <section id="hero">
      <Link className="back" href="/"> Back to home </Link>
        <div id="images"></div>
      </section>
      {selectedItem && (
        <div className="grid-sidebar-overlay" onClick={closeSidebar}>
          <aside
            className={`grid-sidebar ${isClosing ? 'is-closing' : 'is-open'}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid-sidebar__image-wrap">
              <img
                className="grid-sidebar__image"
                src={selectedItem.src}
                alt={selectedItem.description}
                onLoad={handleImageLoad}
                onMouseMove={handleImageMouseMove}
                style={{ objectPosition: imageObjectPosition }}
              />
            </div>
            <div className="grid-sidebar__thumbs">
              {galleryItems.map((item) => (
                <button
                  key={item.src}
                  type="button"
                  className={`grid-sidebar__thumb ${selectedItem.src === `/${item.src}` ? 'is-active' : ''}`}
                  onClick={() => openItem({ src: `/${item.src}`, description: item.description })}
                >
                  <img
                    className="grid-sidebar__thumb-image"
                    src={`/${item.src}`}
                    alt={item.description}
                  />
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
