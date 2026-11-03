import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <BaseLayout>
      <section className="onyx-storybook-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Onyx Creative Labs / Our Story</p>
          <h1>What if a small business had a real product team on its side?</h1>
          <p>
            Not a big presentation. Not a pile of disconnected tactics. A team that listens to the market,
            tests what it hears, and turns the answer into something useful.
          </p>
          <Link href="/contact" passHref>
            <Button className="onyx-lab-cta" size="lg">Start With a Conversation</Button>
          </Link>
        </Container>
      </section>

      <section className="onyx-storybook-chapter onyx-storybook-chapter-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg="10">
              <div className="onyx-storybook-chapter-mark">01</div>
              <p className="onyx-lab-eyebrow">Where it begins</p>
              <h2>The market is where the truth shows up.</h2>
              <div className="onyx-storybook-copy">
                <p>
                  A business can have a strong product, a good service, and a real reason to exist—and still have
                  trouble getting the market to understand it. The gap is rarely just effort. It is the gap between
                  what an owner knows is valuable and what a customer can see, feel, and choose.
                </p>
                <p className="mb-0">
                  Onyx Creative Labs was built to work inside that gap. We look at the actual signals around a
                  business: the conversations, the questions, the objections, the response to an offer, and the
                  evidence in the market. Then we build around what is real, rather than what merely sounds good
                  in a meeting.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-storybook-chapter onyx-storybook-chapter-dark">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg="4">
              <div className="onyx-storybook-chapter-mark">02</div>
              <p className="onyx-lab-eyebrow">The founder&apos;s point of view</p>
              <h2>From the sales floor to the source code.</h2>
            </Col>
            <Col lg="8">
              <div className="onyx-storybook-copy">
                <p>
                  Technology has been part of the story since early on—coding and working with software from the
                  age of twelve. But the other half of the story was built in the market: years of sales, marketing,
                  live conversations, and learning why people move forward, hesitate, or decide not to buy.
                </p>
                <p className="mb-0">
                  That combination became the foundation of Onyx. It gives us a way to see both sides of the work:
                  the system behind the product and the human being in front of it. We can understand the build,
                  hear the hesitation, and shape a practical solution that respects both.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-storybook-chapter onyx-storybook-chapter-signal">
        <Container>
          <Row className="align-items-end g-5">
            <Col lg="7">
              <div className="onyx-storybook-chapter-mark">03</div>
              <p className="onyx-lab-eyebrow">The problem worth solving</p>
              <h2>Small businesses should not have to guess alone.</h2>
              <div className="onyx-storybook-copy">
                <p>
                  Most owners do not have a dedicated research team, a senior growth lead, a creative department,
                  and a technical builder sitting down the hall. They are responsible for serving customers,
                  managing the work, and finding the next opportunity—all at once.
                </p>
                <p className="mb-0">
                  Onyx exists to bring seasoned thinking and real execution within reach. The goal is not to make a
                  business feel more complicated. It is to give owners a clearer next step, stronger demand, and
                  practical ways to put more opportunity on the books.
                </p>
              </div>
            </Col>
            <Col lg="5">
              <div className="onyx-storybook-fieldnote">
                <span>Onyx field note</span>
                <strong>Strong solutions do not start with more noise.</strong>
                <p>They start with a better read on the market, then earn the right to scale.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-storybook-chapter onyx-storybook-chapter-loop">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg="9">
              <div className="onyx-storybook-chapter-mark">04</div>
              <p className="onyx-lab-eyebrow">How we work</p>
              <h2>Listen. Test. Build. Improve.</h2>
              <p className="onyx-storybook-lead">
                The method is simple because it is designed for the real world.
              </p>
            </Col>
          </Row>
          <div className="onyx-storybook-journey" aria-label="The Onyx working method">
            <div>
              <span>Listen</span>
              <p>Get close to the people, patterns, and problems that matter.</p>
            </div>
            <div>
              <span>Test</span>
              <p>Put a message, offer, or direction into the market and watch the response.</p>
            </div>
            <div>
              <span>Build</span>
              <p>Turn what proves useful into a practical product, system, or experience.</p>
            </div>
            <div>
              <span>Improve</span>
              <p>Use the next round of feedback to make the work stronger.</p>
            </div>
          </div>
          <Row className="justify-content-center">
            <Col lg="8">
              <p className="onyx-storybook-afterword">
                Sometimes that work becomes a market-validation pilot. Sometimes it becomes a story-led content
                campaign, a reputation workflow, a growth plan, or a custom product. The form changes. The reason
                stays the same: build something that makes a business easier to understand, easier to choose, and
                better prepared to grow.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="onyx-storybook-closing">
        <Container>
          <p className="onyx-lab-eyebrow">What we are building toward</p>
          <h2>More clarity for owners. More momentum for the businesses they believe in.</h2>
          <p>
            Onyx Creative Labs is a place for market-tested ideas, real human feedback, and products shaped by
            years of experience—not just theory. Bring us a problem worth solving, and we will start with the
            market.
          </p>
          <Link href="/contact" passHref>
            <Button className="onyx-lab-cta" size="lg">Bring Us the Problem</Button>
          </Link>
        </Container>
      </section>
    </BaseLayout>
  );
}
