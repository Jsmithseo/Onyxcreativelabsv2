import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Col, Container, Row } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';

const contentSections = [
  {
    "heading": "A small content engine for your business.",
    "paragraphs": [
      "At Onyx Creative Labs, we bring together the people and skills to keep your story moving. We film, curate, edit, write, and produce content for your business, then set up an affordable program that keeps it rolling out consistently.",
      "Your content should reflect your values as a business owner, why your company started, and the product or service you believe in. We work with you to bring those things to life in genuine stories that help people get to know your business."
    ]
  },
  {
    "heading": "Tell the story. Test what connects. Keep improving.",
    "paragraphs": [
      "We test content based on engagement and use that feedback to improve it over time. We look at what resonates with your core audience, learn which stories and messages connect, and keep focusing the content around those insights.",
      "That gives us a feedback loop: create, share, listen, and refine. Your story stays true to who you are while the content becomes more relevant to the people you want to reach. The goal is stronger engagement, a clearer connection to your product, and more opportunities to grow your business."
    ]
  }
];

const storyExamples = [
  {
    title: 'Storytelling in action',
    category: 'Storytelling example',
    copy: 'A look at the people and real moments behind the work.',
    videoSrc: '/videos/storytelling-in-action.mp4',
    poster: '/storytelling-in-action-still.jpg',
    posterPosition: '50% 50%',
  },
  {
    title: 'STLR Entertainment commercial',
    category: 'Commercial',
    copy: 'Bringing the energy and personality of an entertainment brand to life.',
    videoSrc: '/videos/stlr-entertainment-commercial.mp4',
    poster: '/stlr-entertainment-commercial-still.jpg',
    posterPosition: '50% 50%',
  },
  {
    title: 'Vacation Bike Rentals story',
    category: 'Brand story',
    copy: 'Showing the experience behind the product and what it feels like to be there.',
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
        <p className="mt-3 mb-0">{reel.copy}</p>
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



export default function ContentMarketingPage() {
  return (
    <BaseLayout>
      <Head>
        <title>Content Marketing Through Storytelling | Onyx Creative Labs</title>
        <meta name="description" content="A small content engine for your business. Onyx films, curates, edits, writes, and produces genuine stories, then tests engagement to keep improving your content." />
      </Head>
      <section className="onyx-marketing-hero">
        <Container>
          <p className="onyx-marketing-eyebrow">Content Marketing Through Storytelling</p>
          <h1>Content is King.</h1>
          <p className="onyx-marketing-lead">With so much AI and automation, genuine storytelling matters more than ever. Your ability to tell a genuine story is the lifeblood of your business. We help you bring that story to life and keep it reaching the people who matter.</p>
        </Container>
      </section>

      <article className="onyx-marketing-body">
        {contentSections.map((section) => (
          <section className="onyx-marketing-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </article>

      <Container className="pb-5">
        <div className="text-center mx-auto mb-4" style={{ maxWidth: '680px' }}>
          <p className="onyx-marketing-eyebrow">Storytelling examples</p>
          <h2 className="fw-bold">See the story in motion.</h2>
          <p className="text-muted mb-0">
            These three stories bring the people, purpose, and experience behind
            a product into focus. Watch how each one gives customers a way to connect.
          </p>
        </div>
        <Row className="justify-content-center g-4">
          {storyExamples.map((example) => (
            <Col md="6" lg="4" key={example.videoSrc}>
              <StorytellingCard reel={example} />
            </Col>
          ))}
        </Row>
      </Container>

      <Container className="pb-5">
        <div className="onyx-marketing-cta">
          <h2>Let&apos;s keep your story moving.</h2>
          <p>
            Let&apos;s build a content program that reflects your business, keeps
            your story rolling out, and gets better as we learn what connects
            with your audience.
          </p>
          <Link href="/contact" passHref legacyBehavior>
            <Button color="success" size="lg">Tell Your Story</Button>
          </Link>
        </div>
      </Container>

      <style jsx global>{`
        .onyx-marketing-hero {
          background: #f8f9fa;
          padding: 4.5rem 0;
          text-align: center;
        }
        .onyx-marketing-eyebrow {
          color: #2563eb;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }
        .onyx-marketing-hero h1 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.12;
          margin: 0.75rem 0 1.25rem;
        }
        .onyx-marketing-lead {
          color: #52525b;
          font-size: 1.15rem;
          line-height: 1.7;
          margin: 0 auto;
          max-width: 760px;
        }
        .onyx-marketing-body {
          margin: 0 auto;
          max-width: 828px;
          padding: 4rem 1.5rem 1rem;
        }
        .onyx-marketing-section { margin-bottom: 3rem; }
        .onyx-marketing-section h2 {
          font-size: clamp(1.75rem, 3vw, 2.375rem);
          font-weight: 600;
          line-height: 1.2;
          margin: 0 0 1.5rem;
        }
        .onyx-marketing-section p {
          color: #3f3f46;
          font-size: 1.125rem;
          line-height: 1.8;
          margin: 0 0 1.5rem;
        }
        .onyx-marketing-cta {
          background: #eff6ff;
          margin: 0 auto;
          max-width: 950px;
          padding: 3rem 2rem;
          text-align: center;
        }
        .onyx-marketing-cta h2 { font-size: 2rem; margin: 0 0 1rem; }
        .onyx-marketing-cta p { line-height: 1.7; margin: 0 auto 1.5rem; max-width: 700px; }
        @media (max-width: 575.98px) {
          .onyx-marketing-hero { padding: 3rem 0; }
          .onyx-marketing-body { padding-top: 3rem; }
          .onyx-marketing-cta { padding: 2rem 1.5rem; }
        }
      `}</style>
    </BaseLayout>
  );
}
