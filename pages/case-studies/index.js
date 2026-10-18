import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardText
} from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

const caseStudies = [
  {
    brand: 'Stretchy.Us',
    title: 'Assisted Stretching Company',
    excerpt:
      'Stretchy had one golf club and big ambitions. We built a simple outbound engine—calls, email, pilot offers—and secured two more clubs, a high-end apartment partner, and a school district serving 1,200 staff. We also designed the staffing playbook and launch kit to scale locations fast.',
    link: '/stretchy-case-study',
    studyArea: 'Market expansion study'
  },
  {
    brand: 'Parsity',
    title: 'Online Code School',
    excerpt:
      'Parsity.io needed to increase student enrollment. We enhanced their CRO, redesigned landing pages, launched Google Ads, and built a cold outreach strategy to attract qualified applicants.',
    link: '/parsity-case-study',
    studyArea: 'Enrollment study'
  },
  {
    brand: 'Pathway Humanity',
    title: 'Servcing the community',
    excerpt:
      'Redesigned the website for clearer navigation, modern UI, and faster performance. Set up ongoing content services, including blog maintenance (editing/publishing), monthly newsletter creation and sends, and routine website updates (copy, images, and feature tweaks) to keep the site current and conversion-ready.',
    link: '/pathway-case-study',
    studyArea: 'Audience engagement study'
  },
  {
    brand: 'SoHo Fit',
    title: 'Sohofit is a private personal training studio',
    excerpt:
      'Launched a sprint-based experiment program for SoHo Fit Tampa — improving site speed, tightening the conversion path, and driving measurable lifts in sign-ups',
    link: '/sohofit-case-study',
    studyArea: 'Conversion study'
  },
  {
    brand: 'Poll Everywhere',
    title: 'Poll Company',
    excerpt:
      'Stepping in to clear development backlog, we supported Poll Everywhere through a critical period of limited dev availability—keeping product momentum alive and internal teams unblocked',
    link: '/poll-case-study',
    studyArea: 'Product delivery study'
  },
  {
    brand: 'Vacation Bike Rentals',
    title: 'Seasonal Bike Rental Company',
    excerpt:
      'Vacation Bike Rentals needed to boost conversions during the off-season and ramp up visibility ahead of the warmer months. We helped them optimize their site and strategy to stay booked year-round.',
    link: '/vacation-case-study',
    studyArea: 'Demand generation study'
  },
  {
    brand: 'STLR Entertainment',
    title: 'Live Entertainment Booking',
    excerpt:
      'STLR Entertainment needed to grow their bookings. We rebuilt their website, implemented CRO strategies, launched Google Ads, and executed a cold calling plan to drive qualified leads and close new deals',
    link: '/stlr-case-study',
    studyArea: 'Revenue systems study'
  },
];

export default function CaseStudyPage() {
  return (
    <BaseLayout>
      <section className="onyx-hero">
        <Container>
          <p className="onyx-lab-eyebrow">Onyx Labs / Research Archive</p>
          <h1 className="onyx-hero-title">Field Notes From Work That Moved the Market</h1>
          <p className="onyx-hero-copy">
            Every engagement starts with a question. These case studies document the strategy, experimentation,
            and market learning that helped teams move from possibility to measurable progress.
          </p>
          <div className="onyx-hero-actions">
            <Link href="https://calendly.com/softwaresmitty/discovery">
              <Button color="success" size="lg">Start a Conversation</Button>
            </Link>
          </div>
        </Container>
      </section>

      <Container className="onyx-lab-index">
        <div className="onyx-lab-index-intro">
          <p className="onyx-lab-eyebrow">Documented outcomes</p>
          <h2>Case Studies</h2>
          <p className="onyx-lab-index-copy">
            Each study is an in-depth look at the questions a company was working to answer, the market conditions it faced, and the work used to create progress. Rather than simply presenting a finished outcome, these notes show how we approach complex business problems: observe the market, test a direction, learn from the response, and improve.
          </p>
        </div>
        <Row className="g-4">
          {caseStudies.map((study, idx) => (
            <Col md="6" lg="4" key={study.brand}>
              <Card className="onyx-lab-card h-100">
                <CardBody className="d-flex flex-column p-4">
                  <div className="onyx-lab-card-meta">
                    <span>Study {String(idx + 1).padStart(2, '0')}</span>
                    <span>{study.studyArea}</span>
                  </div>
                  <h3>{study.brand}</h3>
                  <p className="onyx-lab-card-title">{study.title}</p>
                  <CardText>{study.excerpt}</CardText>
                  <Link href={study.link} className="onyx-lab-card-link mt-auto">Read the study <span>→</span></Link>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </BaseLayout>
  );
}
