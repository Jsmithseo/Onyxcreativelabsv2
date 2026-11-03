import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Col, Container, Row } from 'reactstrap';
import { FaBookOpen, FaBullhorn, FaPenNib, FaVideo } from 'react-icons/fa';
import BaseLayout from '../components/layouts/BaseLayouts';

const focusAreas = [
  {
    icon: <FaBookOpen size={34} color="#0d6efd" />,
    title: 'Find the story',
    copy: 'We get clear on why your product exists, who it is for, and what makes it worth paying attention to.',
  },
  {
    icon: <FaPenNib size={34} color="#2563eb" />,
    title: 'Shape the message',
    copy: 'We turn that insight into a focused narrative that sounds like your brand and speaks to the people you want to reach.',
  },
  {
    icon: <FaVideo size={34} color="#fd7e14" />,
    title: 'Create the content',
    copy: 'From video and photography to website copy and social content, we make the story feel real and easy to understand.',
  },
  {
    icon: <FaBullhorn size={34} color="#6f42c1" />,
    title: 'Keep it moving',
    copy: 'We help you use the story consistently so every touchpoint builds recognition, trust, and demand over time.',
  },
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
      <section
        style={{
          backgroundColor: '#f8f9fa',
          padding: '4.5rem 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <p
            className="text-uppercase fw-semibold mb-3"
            style={{ color: '#2563eb', letterSpacing: '0.08em' }}
          >
            Content Marketing Through Storytelling
          </p>
          <h1 className="fw-bold">Content is King.</h1>
          <p
            className="text-muted mx-auto mt-3"
            style={{ fontSize: '1.15rem', maxWidth: '760px', textAlign: 'center' }}
          >
            With so much AI and automation, genuine storytelling matters more
            than ever. The story behind your business—why you started, what you
            believe, and the people you serve—helps customers understand who
            you are and why your product matters.
          </p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col md="7">
            <h2 className="fw-bold">Your story is the lifeblood of your business.</h2>
            <p>
              Your ability to tell a genuine story is what gives people a reason
              to connect with what you do. They want to know where your product
              came from, what problem you set out to solve, and what it means to
              the people using it. Those human details give your business a voice
              that customers can recognize, remember, and trust.
            </p>
            <p className="mb-0">
              At Onyx Creative Labs, we work with you to find those moments and
              bring them to life. We listen to your story, get to know your
              product, and shape it into video, photography, and written content
              that sounds like you. The goal is to help people get to know the
              business behind the product and feel a real connection to it.
            </p>
          </Col>
          <Col md="5" className="mt-4 mt-md-0">
            <div
              className="rounded p-4 h-100"
              style={{ backgroundColor: '#212529', color: '#fff' }}
            >
              <h3 className="h4 fw-bold" style={{ color: '#fff' }}>What we can create</h3>
              <ul className="mb-0 ps-3">
                <li>Founder and brand stories</li>
                <li>Product videos and photo content</li>
                <li>Customer stories and testimonials</li>
                <li>Website messaging and landing-page copy</li>
                <li>Social campaigns and ongoing content series</li>
              </ul>
            </div>
          </Col>
        </Row>

        <Row className="text-center mb-5">
          {focusAreas.map((area) => (
            <Col md="3" className="mb-4 mb-md-0" key={area.title}>
              <div className="mb-3">{area.icon}</div>
              <h3 className="h5 fw-bold">{area.title}</h3>
              <p className="mb-0">{area.copy}</p>
            </Col>
          ))}
        </Row>

        <Row className="justify-content-center mb-5">
          <Col lg="12">
            <div className="text-center mb-4">
              <p
                className="text-uppercase fw-semibold mb-2"
                style={{ color: '#2563eb', letterSpacing: '0.08em' }}
              >
                Storytelling examples
              </p>
              <h2 className="fw-bold">See the story in motion.</h2>
              <p className="text-muted mx-auto mb-0" style={{ maxWidth: '680px' }}>
                These three stories bring the people, purpose, and experience
                behind a product into focus. Watch how each one gives customers
                a way to connect.
              </p>
            </div>

            <Row className="justify-content-center g-4">
              {storyExamples.map((example) => (
                <Col md="6" lg="4" key={example.videoSrc}>
                  <StorytellingCard reel={example} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg="9">
            <div
              className="rounded p-4 p-md-5 text-center"
              style={{ backgroundColor: '#eff6ff' }}
            >
              <h2 className="fw-bold pt-0">Tell your story with Onyx.</h2>
              <p className="mx-auto mb-4" style={{ maxWidth: '700px' }}>
                There is a reason you started this business and a reason your
                product exists. Let&apos;s turn that into content that feels real,
                reflects your voice, and helps customers get to know you.
              </p>
              <Link href="/contact" passHref legacyBehavior>
                <Button color="success" size="lg">Tell Your Story</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </BaseLayout>
  );
}
