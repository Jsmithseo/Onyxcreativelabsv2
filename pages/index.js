import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import BaseLayout from './components/layouts/BaseLayouts.js';
import { Row, Col, Button } from 'reactstrap';
import Approach from './components/Approach';
import FractionalBdrOverview from './components/Results';
import FeaturedCaseStudies from './components/FeaturedCaseStudies';

const storytellingReels = [
  {
    title: 'Roll-b Founder Story',
    category: 'Brand story',
    videoSrc: '/videos/roll-b-founder-story.mp4',
    poster: '/videos/roll-b-founder-story.jpg',
    posterFit: 'contain',
  },
  {
    title: 'STLR Entertainment commercial',
    category: 'Commercial',
    videoSrc: '/videos/stlr-entertainment-commercial.mp4',
    poster: '/stlr-entertainment-commercial-still.jpg',
    posterPosition: '50% 50%',
  },
  {
    title: 'Vacation Bike Rentals story',
    category: 'Brand story',
    videoSrc: '/videos/vacation-bike-rentals-story.mp4',
    poster: '/vacation-bike-rentals-still.jpg',
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
              style={{ objectFit: reel.posterFit || 'cover', objectPosition: reel.posterPosition || '50% 50%' }}
            />
            <span className="storytelling-poster-shade" aria-hidden="true" />
            <span className="storytelling-play" aria-hidden="true">▶</span>
            <span className="storytelling-watch">Watch story</span>
          </button>
        )}
      </div>
      <div className="p-3 p-lg-4">
        <p className="text-uppercase fw-semibold mb-2" style={{ color: 'var(--onyx-accent)', fontSize: '.72rem', letterSpacing: '.08em' }}>{reel.category}</p>
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
          outline: 3px solid var(--onyx-accent);
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
      <Head>
        <title>Fractional BDR Services | Onyx Creative Labs</title>
        <meta name="description" content="Onyx Creative Labs provides part-time business development for lean B2B teams. Get help with prospecting, cold calling, lead follow-up, and appointment setting." />
      </Head>
      <div style={{ overflowX: 'hidden' }}>
        <CssBaseline />
        <section className="onyx-hero onyx-hero-inverse">
          <Container>
            <h1 className="onyx-hero-title">Fractional BDR for lean B2B teams</h1>
            <p className="onyx-hero-copy">
              Onyx gives you part-time business development support. We find the right prospects, make the calls, and follow up consistently so your team can spend more time in qualified sales conversations.
            </p>
            <div className="onyx-hero-actions flex-wrap gap-3">
              <Link href="/contact?service=fractional-bdr" className="btn btn-lg fw-semibold onyx-bdr-primary">Talk about outbound</Link>
              <a href="#fractional-bdr" className="btn btn-lg fw-semibold">See how it works</a>
            </div>
          </Container>
        </section>

        <FractionalBdrOverview />
        <section className="onyx-content-section"><FeaturedCaseStudies /></section>

        <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
          <Container maxWidth="lg">
            <Row className="justify-content-center text-center mb-4"><Col lg="9"><p className="text-uppercase fw-semibold mb-2" style={{ color: 'var(--onyx-accent)', letterSpacing: '0.08em' }}>Content marketing through storytelling</p><h2 className="fw-bold">Content is King.</h2><p className="lead text-muted mb-0">The story behind your product helps customers understand what you do, why it matters, and why they should remember you. We shape that story into content that feels real and resonates.</p></Col></Row>
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
        <section className="onyx-muted-section" aria-labelledby="onyx-reviews-heading">
          <Approach />
        </section>
      </div>

      <style jsx global>{`
        .onyx-hero.onyx-hero-inverse {
          background: #18181b;
          color: #fff;
          padding: 6rem 0;
        }
        .onyx-hero-inverse .onyx-hero-title { color: #fff; }
        .onyx-hero-inverse .onyx-hero-copy { color: #e4e4e7; }
        .onyx-hero-inverse .onyx-hero-actions .btn {
          background: transparent !important;
          border-color: #fff !important;
          color: #fff !important;
        }
        .onyx-hero-inverse .onyx-hero-actions .onyx-bdr-primary {
          background: var(--onyx-accent) !important;
          border-color: var(--onyx-accent) !important;
          color: var(--onyx-black) !important;
        }
        .onyx-hero-inverse .onyx-hero-actions .btn:hover,
        .onyx-hero-inverse .onyx-hero-actions .btn:focus {
          background: #fff !important;
          border-color: #fff !important;
          color: #18181b !important;
        }
        .onyx-hero-inverse .onyx-hero-actions .btn:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 4px;
        }
        @media (max-width: 575.98px) {
          .onyx-hero.onyx-hero-inverse { padding: 4rem 0; }
        }
      `}</style>
    </BaseLayout>
  );
}
