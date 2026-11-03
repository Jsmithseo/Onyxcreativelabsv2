import React from 'react';
import Head from 'next/head';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <BaseLayout>
      <Head>
        <title>Our Story | Onyx Creative Labs</title>
        <meta
          name="description"
          content="Why Jeremy Smith built Onyx Creative Labs: bringing enterprise-level skills, software, and strategy within reach of small businesses."
        />
      </Head>

      <section className="onyx-founder-story" aria-labelledby="onyx-founder-story-title">
        <article className="onyx-founder-story-article">
          <header className="onyx-founder-story-header">
            <p className="onyx-founder-story-eyebrow">Our Story</p>
            <h1 id="onyx-founder-story-title">Why I built Onyx Creative Labs.</h1>
            <p className="onyx-founder-story-byline">A note from Jeremy Smith, founder</p>
          </header>

          <div className="onyx-founder-story-copy">
            <p>
              Onyx Creative Labs was built on a simple premise: small businesses matter.
              They are a big part of how this country works. They create jobs, serve our
              communities, and keep money moving through the economy. I believe the people
              building those businesses deserve access to the skills, resources, and tools
              that help them grow.
            </p>

            <p>
              I started this company to help business owners put more money on the books.
              Sometimes an owner knows exactly what their business needs, but the budget
              is not there to hire the right people, pay a contractor, or buy the software
              that could help them move forward. That is a real problem, and it is the
              underlying issue Onyx was built to help solve.
            </p>

            <p>
              What we do is bring high-quality technical work, enterprise-level skills,
              software, resources, and strategy within reach of small businesses. I want
              owners to have access to the kind of thinking and execution that can be hard
              to afford when you are building a company. That means putting our experience
              to work and building practical products and services around what a business
              actually needs.
            </p>

            <p>
              I bring more than twenty years of experience in sales, marketing, and working
              directly in the market, alongside a background in engineering and technology
              that started when I began coding at twelve. Over those years, I have learned
              a lot from real conversations: what customers need, what makes them hesitate,
              and what helps them decide to move forward. That experience is part of
              everything we build at Onyx.
            </p>

            <p>
              We take a scientific, data-driven approach to bringing products to our
              customers. We listen to business owners, look at real market data, test our
              ideas, and use the feedback to improve what we build. Those feedback loops
              matter. They keep us close to the people using our products and help us make
              decisions based on what is happening in the market. Our products are shaped
              by years of experience, real human interaction, and what we learn along the
              way.
            </p>

            <p>
              Today, we use AI to help us move faster, stay agile, and deliver our products
              and services better. It gives us more room to research, build, and respond to
              what our customers need. The purpose is still the same: bring useful tools,
              experienced people, and strong execution to business owners who need them.
            </p>

            <p>
              That is what Onyx Creative Labs is about. We care about small businesses,
              and we want to help the people behind them build something that works.
              Everything comes back to that goal: helping owners solve real problems,
              create more opportunity, and put more money on the books.
            </p>
          </div>

          <footer className="onyx-founder-story-footer">
            <p><strong>Jeremy Smith</strong><br />Founder, Onyx Creative Labs</p>
            <Link href="/contact">
              <a className="onyx-founder-story-link">Let&apos;s talk about your business <span aria-hidden="true">↗</span></a>
            </Link>
          </footer>
        </article>
      </section>

      <style jsx>{`
        .onyx-founder-story {
          background: #f4f4f5;
          padding: 5rem 1.5rem 6rem;
        }
        .onyx-founder-story-article {
          margin: 0 auto;
          max-width: 780px;
        }
        .onyx-founder-story-header {
          border-bottom: 1px solid #d4d4d8;
          margin-bottom: 2.75rem;
          padding-bottom: 2rem;
        }
        .onyx-founder-story-eyebrow {
          color: #2563eb;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          margin: 0 0 1.1rem;
          text-transform: uppercase;
        }
        .onyx-founder-story h1 {
          color: #18181b;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 600;
          letter-spacing: -0.035em;
          line-height: 1.08;
          margin: 0 0 1.25rem;
          max-width: 740px;
          text-wrap: balance;
        }
        .onyx-founder-story-byline {
          color: #52525b;
          font-size: 1rem;
          margin: 0;
        }
        .onyx-founder-story-copy p {
          color: #3f3f46;
          font-size: clamp(1.06rem, 1.5vw, 1.2rem);
          line-height: 1.85;
          margin: 0 0 1.65rem;
        }
        .onyx-founder-story-copy p:first-child {
          color: #18181b;
          font-size: clamp(1.17rem, 1.7vw, 1.35rem);
          line-height: 1.75;
        }
        .onyx-founder-story-footer {
          border-top: 1px solid #d4d4d8;
          margin-top: 2.75rem;
          padding-top: 1.75rem;
        }
        .onyx-founder-story-footer p {
          color: #52525b;
          font-size: 0.98rem;
          line-height: 1.65;
          margin: 0 0 1.4rem;
        }
        .onyx-founder-story-footer strong { color: #18181b; }
        .onyx-founder-story-link {
          color: #2563eb;
          display: inline-block;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 0.25em;
        }
        .onyx-founder-story-link:hover { color: #1d4ed8; }
        .onyx-founder-story-link:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 5px;
        }
        @media (max-width: 575.98px) {
          .onyx-founder-story { padding: 3rem 1.25rem 4rem; }
          .onyx-founder-story-header { margin-bottom: 2rem; }
        }
      `}</style>
    </BaseLayout>
  );
}
