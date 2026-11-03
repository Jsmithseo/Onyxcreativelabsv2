import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Logo from '../../../public/logo.PNG';

const products = [
  { label: 'Onyx Reviews', href: '/reviews' },
  { label: 'Onyx AI Closer', href: '/ai-closer' },
  { label: 'SuSu', href: '/susu' },
];

export default function MyHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef(null);
  const productsButtonRef = useRef(null);

  const closeMenus = () => {
    setIsOpen(false);
    setProductsOpen(false);
  };

  const supportsHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const closeProductsOnBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setProductsOpen(false);
  };

  const handleProductsKeyDown = (event) => {
    if (event.key === 'Escape') {
      setProductsOpen(false);
      productsButtonRef.current?.focus();
    }
    if (event.key === 'ArrowDown' && event.target === productsButtonRef.current) {
      event.preventDefault();
      setProductsOpen(true);
      window.requestAnimationFrame(() => productsRef.current?.querySelector('a')?.focus());
    }
  };

  return (
    <header className="onyx-site-header">
      <nav className="onyx-site-nav" aria-label="Main navigation">
        <a href="/" className="onyx-nav-brand" aria-label="Onyx Creative Labs home" onClick={closeMenus}>
          <Image src={Logo} alt="Onyx Creative Labs" width={200} height={50} priority />
        </a>

        <button
          type="button"
          className="onyx-nav-toggle"
          aria-controls="onyx-main-navigation"
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => {
            setIsOpen(!isOpen);
            setProductsOpen(false);
          }}
        >
          <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
          <span>Menu</span>
        </button>

        <div id="onyx-main-navigation" className={`onyx-nav-links ${isOpen ? 'is-open' : ''}`}>
          <a className="onyx-nav-link" href="/90-day-pilot" onClick={closeMenus}>90-Day Pilot</a>
          <a className="onyx-nav-link" href="/content-marketing" onClick={closeMenus}>Content Marketing</a>
          <a className="onyx-nav-link" href="/growth-plan" onClick={closeMenus}>Growth Plan</a>
          <a className="onyx-nav-link" href="/case-studies" onClick={closeMenus}>Case Studies</a>

          <div
            className="onyx-nav-products"
            ref={productsRef}
            onMouseEnter={() => { if (supportsHover()) setProductsOpen(true); }}
            onMouseLeave={() => {
              if (supportsHover() && !productsRef.current?.contains(document.activeElement)) {
                setProductsOpen(false);
              }
            }}
            onBlur={closeProductsOnBlur}
            onKeyDown={handleProductsKeyDown}
          >
            <button
              ref={productsButtonRef}
              type="button"
              className="onyx-nav-link onyx-products-toggle"
              aria-expanded={productsOpen}
              aria-controls="onyx-products-menu"
              onClick={() => setProductsOpen(!productsOpen)}
            >
              Products <span className={`onyx-nav-chevron ${productsOpen ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
            </button>
            <ul id="onyx-products-menu" className="onyx-products-menu" hidden={!productsOpen}>
              {products.map((product) => (
                <li key={product.href}>
                  <a href={product.href} onClick={closeMenus}>{product.label}</a>
                </li>
              ))}
              <li className="onyx-all-products"><a href="/products" onClick={closeMenus}>View all products <span aria-hidden="true">↗</span></a></li>
            </ul>
          </div>

          <a className="onyx-nav-link" href="/about" onClick={closeMenus}>Our Story</a>
        </div>
      </nav>

      <style jsx global>{`
        .onyx-site-header {
          background: #f8f9fb;
          border-bottom: 1px solid #e4e4e7;
          position: relative;
          z-index: 50;
        }
        .onyx-site-nav {
          align-items: center;
          display: flex;
          gap: 1.25rem;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1320px;
          min-height: 84px;
          padding: 12px 24px;
        }
        .onyx-nav-brand {
          align-items: center;
          display: inline-flex;
          flex: 0 0 auto;
          line-height: 0;
          width: 200px;
        }
        .onyx-nav-links {
          align-items: center;
          display: flex;
          gap: 0.15rem;
        }
        .onyx-site-header .onyx-nav-link {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 5px;
          color: #18181b;
          cursor: pointer;
          display: inline-flex;
          font: inherit;
          font-size: 0.95rem;
          font-weight: 500;
          gap: 0.35rem;
          line-height: 1.4;
          padding: 0.7rem 0.6rem;
          text-decoration: none;
          transition: background-color 150ms ease, color 150ms ease;
          white-space: nowrap;
        }
        .onyx-site-header .onyx-nav-link:hover,
        .onyx-site-header .onyx-nav-link[aria-expanded='true'] {
          background: #eaf0fb;
          color: #1d4ed8;
        }
        .onyx-site-header a:focus-visible,
        .onyx-site-header button:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 3px;
        }
        .onyx-nav-toggle {
          align-items: center;
          background: transparent;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          color: #18181b;
          display: none;
          font: inherit;
          font-size: 0.9rem;
          gap: 0.5rem;
          padding: 0.55rem 0.7rem;
        }
        .onyx-nav-products { position: relative; }
        .onyx-nav-chevron {
          display: inline-block;
          font-size: 1rem;
          transition: transform 150ms ease;
        }
        .onyx-nav-chevron.is-open { transform: rotate(180deg); }
        .onyx-products-menu {
          background: #fff;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          box-shadow: 0 15px 35px rgba(24, 24, 27, 0.12);
          left: 0;
          list-style: none;
          margin: 0;
          min-width: 230px;
          padding: 0.4rem;
          position: absolute;
          top: 100%;
        }
        .onyx-products-menu[hidden] { display: none; }
        .onyx-products-menu a {
          border-radius: 4px;
          color: #27272a;
          display: block;
          font-size: 0.94rem;
          padding: 0.7rem 0.85rem;
          text-decoration: none;
        }
        .onyx-products-menu a:hover { background: #eff6ff; color: #1d4ed8; }
        .onyx-all-products { border-top: 1px solid #e4e4e7; margin-top: 0.3rem; padding-top: 0.3rem; }
        @media (max-width: 991.98px) {
          .onyx-site-nav { flex-wrap: wrap; gap: 0; padding: 10px 20px; }
          .onyx-nav-toggle { display: inline-flex; }
          .onyx-nav-links { align-items: stretch; display: none; flex: 0 0 100%; padding: 1rem 0 0.5rem; }
          .onyx-nav-links.is-open { display: flex; flex-direction: column; gap: 0.25rem; }
          .onyx-site-header .onyx-nav-link { justify-content: space-between; width: 100%; }
          .onyx-products-menu { box-shadow: none; margin: 0.25rem 0 0.5rem; min-width: 0; position: static; }
        }
        @media (prefers-reduced-motion: reduce) {
          .onyx-site-header .onyx-nav-link,
          .onyx-nav-chevron { transition: none; }
        }
      `}</style>
    </header>
  );
}
