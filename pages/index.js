import React, { useState } from 'react';
import Image from 'next/image';
import Logo from '../public/logo.PNG';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from "../pages/components/Approach";
import Results from "../pages/components/Results";
import FeaturedCaseStudies from './components/FeaturedCaseStudies';

const storytellingReels = [
  {
    title: 'Storytelling in action',
    category: 'Storytelling example',
    videoSrc: '/videos/storytelling-in-action.mp4',
    poster: '/storytelling-in-action-still.png',
    posterPosition: '50% 50%',
  },
  {
    title: 'STLR Entertainment commercial',
    category: 'Commercial',
    videoSrc: '/videos/stlr-entertainment-commercial.mp4',
    poster: '/stlr-entertainment-commercial-still.png',
    posterPosition: '50% 50%',
  },
  {
    title: 'Vacation Bike Rentals story',
    category: 'Brand story',
    videoSrc: '/videos/vacation-bike-rentals-story.mp4',
    poster: '/vacation-bike-rentals-still.png',
    posterPosition: '50% 24%',
  },
];

function StorytellingCard({ reel }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <article className="storytelling-card h-100 overflow-hidden bg-white">
      <div className="position-relative" style={{ aspectRatio: '16 / 9', background: '#101828' }}>
        {isPlaying ? (
          <video
            aria-label={reel.title}
            className="d-block w-100 h-100"
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={{ objectFit: 'contain', background: '#101828' }}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={reel.videoSrc} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        ) : (
          <button
            type="button"
            aria-label={`Play ${reel.title}`}
            onClick={() => setIsPlaying(true)}
            className="storytelling-poster w-100 h-100 border-0 p-0 text-start"
          >
            <img
              src={reel.poster}
              alt=""
              className="w-100 h-100"
              loading="lazy"
              style={{ objectFit: 'cover', objectPosition: reel.posterPosition || '50% 50%' }}
            />
            <span className="storytelling-poster-shade" aria-hidden="true" />
            <span className="storytelling-play" aria-hidden="true">▶</span>
            <span className="storytelling-watch">Watch story</span>
          </button>
        )}
      </div>
      <div className="p-3 p-lg-4">
        <p className="text-uppercase fw-semibold mb-2" style={{ color: '#2563eb', fontSize: '.72rem', letterSpacing: '.08em' }}>{reel.category}</p>
        <h3 className="h5 fw-bold mb-0">{reel.title}</h3>
      </div>
      <style jsx>{`
        .storytelling-card {
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          box-shadow: 0 14px 32px rgba(15, 23, 42, .08);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .storytelling-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, .14);
        }
        .storytelling-poster {
          position: relative;
          display: block;
          overflow: hidden;
          background: #101828;
          cursor: pointer;
        }
        .storytelling-poster img {
          display: block;
          transition: transform .35s ease;
        }
        .storytelling-poster:hover img,
        .storytelling-poster:focus-visible img {
          transform: scale(1.04);
        }
        .storytelling-poster:focus-visible {
          outline: 3px solid #2563eb;
          outline-offset: -3px;
        }
        .storytelling-poster-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(16, 24, 40, .04) 24%, rgba(16, 24, 40, .72) 100%);
        }
        .storytelling-play {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          width: 4rem;
          height: 4rem;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, .85);
          border-radius: 999px;
          background: rgba(16, 24, 40, .72);
          color: #fff;
          font-size: 1.25rem;
          line-height: 1;
          transform: translate(-50%, -50%);
          box-shadow: 0 10px 24px rgba(0, 0, 0, .24);
        }
        .storytelling-watch {
          position: absolute;
          right: 1rem;
          bottom: .875rem;
          color: #fff;
          font-size: .75rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
      `}</style>
    </article>
  );
}

export default function Index() {
  return (
    <BaseLayout>
      <div style={{ overflowX: 'hidden' }}>
        <CssBaseline />
        <section className="onyx-hero">
          <Container>
            <div className="onyx-hero-logo"><Image src={Logo} alt="Onyx Creative Labs Logo" width={300} height={75} /></div>
            <h1 className="onyx-hero-title">Find your market. Tell your story. Grow with confidence.</h1>
            <p className="onyx-hero-copy">Onyx helps you create demand in two ways: test the market with human-led business development, or turn your value into story-led content that gives people a reason to care.</p>
            <div className="onyx-hero-actions" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <Link href="/90-day-pilot"><Button color="success" style={{ fontWeight: '600' }}>Test Your Market</Button></Link>
              <Link href="/content-marketing"><Button color="outline-dark" style={{ fontWeight: '600' }}>Tell Your Story</Button></Link>
            </div>
            <p className="mt-3 mb-0 text-center">Need both? <Link href="/growth-plan" style={{ color: '#2563eb', fontWeight: '600' }}>See how a Growth Plan brings them together.</Link></p>
          </Container>
        </section>

        <Container maxWidth="lg">
          <section className="onyx-intro"><Row><Col md={{ size: 12 }}><h2>The Onyx Creative Labs Way.</h2><p className="onyx-intro-copy">We help businesses understand their market, build momentum, and grow with confidence.</p></Col></Row></section>
        </Container>

        <section className="onyx-muted-section"><Results /></section>

        <section style={{ backgroundColor: '#111827', color: '#fff', padding: '5rem 0' }}>
          <Container maxWidth="lg">
            <Row className="align-items-center g-4">
              <Col lg="8">
                <p className="text-uppercase fw-semibold mb-2" style={{ color: '#60a5fa', letterSpacing: '0.08em' }}>Onyx Reviews</p>
                <h2 className="fw-bold">Turn happy customers into public proof.</h2>
                <p className="lead mb-0" style={{ color: '#d1d5db' }}>A simple, timely review-growth process for service businesses that want more customer feedback without making their team chase reviews.</p>
              </Col>
              <Col lg="4" className="text-lg-end"><Link href="/reviews"><Button color="primary" size="lg">Explore Onyx Reviews</Button></Link></Col>
            </Row>
          </Container>
        </section>

        <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
          <Container maxWidth="lg">
            <Row className="justify-content-center text-center mb-4"><Col lg="9"><p className="text-uppercase fw-semibold mb-2" style={{ color: '#2563eb', letterSpacing: '0.08em' }}>Content marketing through storytelling</p><h2 className="fw-bold">Content is King.</h2><p className="lead text-muted mb-0">The story behind your product helps customers understand what you do, why it matters, and why they should remember you. We shape that story into content that feels real and resonates.</p></Col></Row>
            <Row className="justify-content-center g-4">
              {storytellingReels.map((reel) => (
                <Col md="6" lg="4" key={reel.videoSrc}>
                  <StorytellingCard reel={reel} />
                </Col>
              ))}
            </Row>
            <div className="text-center mt-2"><Link href="/content-marketing"><Button color="success" size="lg">Tell Your Story</Button></Link></div>
          </Container>
        </section>
        <section className="onyx-content-section"><FeaturedCaseStudies /></section>
        <section className="onyx-muted-section"><Approach /></section>
      </div>
    </BaseLayout>
  );
}
