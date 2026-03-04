"use client";

import Link from 'next/link'

import { useEffect } from "react";
import StickyGridScroll from "./lib/StickyGridScroll";
import Scene from './components/Scene';

export default function Home() {
  useEffect(() => {
    const grid = new StickyGridScroll();

    return () => grid.destroy();
  }, []);
  return (
    <main>
      <section className="block block--intro">
        <figure className="media">
          <img className="media__image" src="/8.jpeg" alt="Image 8" />
          <figcaption className="media__caption">Small layout experiment involving Webgl tehnology</figcaption>
        </figure>
      </section>
      <section className="block block--main">
        <div className="block__wrapper">
        <Scene />
          <div className="content">
            <h2 className="content__title">Forever Leica.</h2>
            <p className="content__description">
            Leica is a prestigious German brand known for producing high-end cameras, lenses, and optical equipment.
            </p>
            <Link className="content__button" href="/grid">Enter website</Link>
          </div>
          <div className="gallery">
            <ul className="gallery__grid">
              <li className="gallery__item">
                <img className="gallery__image" src="/1.jpeg" alt="Image 1" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/2.jpeg" alt="Image 2" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/3.jpeg" alt="Image 3" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/4.jpeg" alt="Image 4" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/5.jpeg" alt="Image 5" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/6.jpeg" alt="Image 6" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/7.jpeg" alt="Image 7" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/8.jpeg" alt="Image 8" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/9.jpeg" alt="Image 9" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/10.jpeg" alt="Image 10" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/11.jpeg" alt="Image 11" />
              </li>
              <li className="gallery__item">
                <img className="gallery__image" src="/12.jpeg" alt="Image 12" />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
