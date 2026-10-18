import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Row, Col } from 'reactstrap';
import BaseLayout from '../components/layouts/BaseLayouts';
import Link from 'next/link';

const MainStyle = {
  overflowX: 'hidden',
};

const copyStyle = {
  fontSize: '22px',
  fontFamily: 'inherit',
  textAlign: 'center',
};

export default function Planning() {
  return (
    <BaseLayout>
      <div className="jumbtron playbook">
        <center>
          <img
            src="/planning.png" // Replace with your image path
            alt="Image"
            className="img-fluid playbook"
          />
        </center>
      </div>
      <br></br>
      <br></br>
      <div className="container about">
        <Row>
          {/* <Col md="6">
            <img
              src="/headshot.png" // Replace with your image path
              alt="Image"
              className="img-fluid"
            />
          </Col> */}
          <Container className="planningcontainer">
            <Col md="12">
              <div className="bio-content">
                <center>
                  <p>
                    Understanding how to transform an idea into an impactful
                    project is crucial for non-profits, which often operate with
                    limited resources and a strong dependency on donor funding
                    and volunteer efforts.
                  </p>

                  <h2>Prioritization</h2>
                  <p>
                    For non-profits, the plethora of tasks can include community
                    outreach, donor management, volunteer recruitment, program
                    development, advocacy, and more. The key to success is to
                    establish clear priorities that are aligned with the
                    organization's mission:
                  </p>
                  <span className="calloutText1">
                    Organizational Mission → Strategic Objectives → Operational
                    Goals
                  </span>
                  <p>
                    The alignment ensures that all stakeholders are working
                    toward a common vision. Transparency in goals from the
                    organization-wide level to individual team members is
                    critical. This collaborative approach encourages a sense of
                    ownership and enhances team morale.
                  </p>
                  <p>
                    Prioritization usually occurs on an annual or biannual
                    basis, acknowledging that non-profits must remain flexible
                    to respond to urgent needs or unexpected opportunities.
                  </p>
                  <h2>Strategic Planning Cycle</h2>
                  <p>
                    The planning cycle is guided by the organization's long-term
                    strategy, which is revisited annually or every few years.
                    Strategic planning aims to ensure that the organization can
                    execute significant initiatives that advance its mission.
                  </p>
                  <p>
                    Inspirations for projects may originate from any level of
                    the organization, reflecting a grassroots approach to
                    innovation. Before the planning cycle begins, managers and
                    team leaders collect ideas and suggestions from all staff
                    and volunteers.
                  </p>
                  <p>
                    A selection of these ideas is then considered for the
                    upcoming cycle. Advocates for each proposal develop a brief
                    that outlines the project's objectives, expected community
                    impact, and key performance indicators (KPIs) to measure
                    success. This documentation is circulated to the entire
                    organization for feedback.
                  </p>
                  <p>
                    Following this, a series of focused meetings take place to
                    discuss each project in detail. These are inclusive,
                    allowing everyone from staff to volunteers to participate.
                    Afterward, a smaller group, including representatives from
                    various departments and key stakeholders, convenes to
                    prioritize the projects based on impact, feasibility, and
                    alignment with strategic goals.
                  </p>
                  <p>
                    The outcome is a ranked list of projects the organization
                    aims to undertake. Resources are then allocated accordingly,
                    and teams are assembled to start turning these plans into
                    reality.
                  </p>
                  <p>
                    Remember, in the non-profit sector, the "customers" are the
                    beneficiaries of your services, whether they're
                    individuals, communities, or causes you serve. Therefore,
                    all planning and prioritization efforts should center on
                    maximizing positive outcomes for these groups
                  </p>
                </center>
              </div>
            </Col>
            <Col md="12">
              <div className="bio-content">
                <center>
                  <h2>Quarterly Planning for Non-Profit Organizations</h2>
                  <p>
                    Quarterly planning in a non-profit context is shaped by the
                    overarching mission and strategic direction, which are
                    typically reviewed on an annual basis. However, the tactical
                    adjustments and specific initiatives may be revisited more
                    frequently to stay responsive to the dynamic nature of
                    non-profit work.
                  </p>
                  <p>
                    The alignment ensures that all stakeholders are working
                    toward a common vision. Transparency in goals from the
                    organization-wide level to individual team members is
                    critical. This collaborative approach encourages a sense of
                    ownership and enhances team morale.
                  </p>
                  <p>
                    Prioritization usually occurs on an annual or biannual
                    basis, acknowledging that non-profits must remain flexible
                    to respond to urgent needs or unexpected opportunities.
                  </p>
                  <h2>Aligning with Strategic Vision</h2>
                  <p>
                    Quarterly planning is anchored in the strategic plan, which
                    sets the direction for the upcoming years. Regular check-ins
                    at meetings, such as a monthly town hall, ensure the plan
                    remains relevant and responsive to new challenges and
                    opportunities. The objective of quarterly planning is to
                    focus efforts, streamline operations, and deliver impactful
                    projects to the communities served. Project timelines may
                    vary, from quick one-month initiatives to more complex
                    ventures lasting up to nine months.
                  </p>
                  <h3>Collaborative Idea Generation</h3>
                  <p>
                    Initiatives often emerge from within the ranks, sparked by
                    insights from those working closest to the organization's
                    beneficiaries. Before the beginning of a new quarter,
                    program managers and team leads engage with staff and
                    volunteers to solicit ideas that can advance the
                    organization's mission. These ideas are then evaluated for
                    strategic fit and potential impact.
                  </p>
                  <h2>Proposal Development</h2>
                  <p>
                    Those who propose initiatives are tasked with drafting a
                    concise plan. This document should outline the project's
                    scope, intended impact on the community, and crucially, the
                    metrics that will be used to gauge success. By consolidating
                    these plans into a preliminary document, the entire
                    organization is afforded the opportunity to review and
                    provide input, ensuring a wide range of perspectives are
                    considered.
                  </p>
                  <h3>Inclusive Discussions and Decision-Making</h3>
                  <p>
                    To minimize meeting fatigue while maximizing input, project
                    discussions are held in comprehensive sessions open to the
                    entire organization. This allows for a diverse cross-section
                    of viewpoints to be heard. Subsequent meetings are more
                    focused, bringing together department leads and key
                    stakeholders to prioritize projects based on their potential
                    for impact, resource requirements, and alignment with the
                    non-profit's goals.
                  </p>
                  <h2>Finalizing the Project Slate</h2>
                  <p>
                    The result of this collaborative process is a prioritized
                    list of projects for the upcoming quarter. The selected
                    initiatives then move into the implementation phase, with
                    teams mobilized and resources allocated to achieve the set
                    objectives.
                  </p>
                  <p>
                    In non-profit organizations, such structured yet flexible
                    planning ensures that efforts are concentrated on areas
                    where they can make the most difference, whether that be in
                    service delivery, advocacy, education, or community support,
                    always with an eye on maximizing the positive impact on the
                    mission's beneficiaries.
                  </p>
                  <h2>
                    Adaptive Project Management in Non-Profit Organizations
                  </h2>
                  <span className="calloutText1">
                    Adaptive project management in non-profits is a set of
                    principles and practices that focus on iterative planning,
                    ongoing stakeholder collaboration, and flexible response to
                    change. It emphasizes the incremental delivery of value,
                    continuous improvement in processes, and the ability to
                    pivot swiftly in reaction to evolving community needs or
                    funding landscapes.
                  </span>
                  <p>
                    Agile, Adaptive Project Management (APM), Community-Driven
                    Development (CDD), Dynamic Systems Development Method
                    (DSDM), Lean for Non-Profits, Kanban for Social Change,
                    Scrum for Impact... Feeling overwhelmed? Let's simplify:
                  </p>
                  <ul>
                    <li>
                      We aim to create ongoing value for the communities we
                      serve.
                    </li>
                    <li>
                      We need the flexibility to adapt our strategies in
                      real-time, as needs and resources change.
                    </li>
                  </ul>
                  <h2>Breaking It Down:</h2>
                  <p>
                    <span className="callouttext2">Iterative Delivery:</span>{' '}
                    Just like in Agile software development, we focus on
                    delivering small, measurable, and impactful changes to our
                    programs. Instead of a finished 'product', we might look at
                    delivering a completed phase of a community project or an
                    educational initiative.
                  </p>
                  <p>
                    <span className="callouttext2">
                      Stakeholder Collaboration:
                    </span>{' '}
                    We involve our community, volunteers, and partners in the
                    planning process, ensuring their input and feedback are
                    integral to our project development, much like customers are
                    to Agile development teams.
                  </p>
                  <p>
                    <span className="callouttext2">Adaptive Planning:</span> Our
                    project timelines are flexible, allowing us to adjust our
                    actions as the environment or our stakeholders' needs
                    change.
                  </p>
                  <p>
                    <span className="callouttext2">
                      Continuous Improvement:{' '}
                    </span>
                    After each initiative or event, we review what went well and
                    what could be better, aiming to improve with each iteration.
                  </p>
                  <p>
                    <span className="callouttext2">
                      Rapid & Flexible Response:
                    </span>{' '}
                    When faced with unforeseen challenges, such as changes in
                    funding or a sudden need in the community, we are prepared
                    to respond quickly and effectively, redirecting our efforts
                    without being bound by a rigid plan.
                  </p>
                  <p>
                    By adopting an Agile mindset, non-profits can become more
                    effective and responsive. Instead of being daunted by the
                    jargon of Agile methodologies, think of it as a commitment
                    to be as impactful and efficient as possible in achieving
                    the organizational mission.
                  </p>

                  <h3>Let’s start over:</h3>
                  <ul>
                    <li>
                      We want to consistently ship value to our customers.
                    </li>
                    <li>
                      We want to be able to change directions quickly and
                      easily.
                    </li>
                  </ul>
                  <br></br>
                  <h3>Sprints</h3>
                  <p>
                    In the nonprofit realm, each project team dedicates itself
                    to achieving specific milestones during each sprint. A
                    sprint typically spans 1 or 2 weeks, focusing on
                    deliverables that will directly impact their stakeholders by
                    the sprint’s end.
                  </p>
                  <p>
                    The sprint objectives are crystallized in a planning session
                    involving the project’s team members, which may include
                    program coordinators, volunteers, and the project manager,
                    for a concise 30-minute meeting every Tuesday. In these
                    meetings, we:
                  </p>
                  <ul>
                    <li>
                      Assess our accomplishments against the goals set for the
                      previous sprint, understanding the reasons for any
                      discrepancies.
                    </li>
                    <li>
                      Prepare a presentation for our community gathering to
                      highlight our journey and showcase tangible progress.
                    </li>
                    <li>
                      Establish clear and attainable targets for the upcoming
                      sprint, which commences the morning after our community
                      gathering.
                    </li>
                  </ul>
                  <p>
                    The critical outcomes of the sprint planning meeting include
                    reflecting on the prior sprint’s triumphs and challenges,
                    readying an engaging demonstration for the larger team, and
                    allocating specific tasks to each team member for the new
                    sprint.
                  </p>
                  <p>
                    By adopting this structure, nonprofit teams can foster a
                    disciplined, yet flexible approach to achieving their
                    mission, ensuring that every sprint yields concrete results
                    that align with their strategic objectives.
                  </p>
                  <h3>The backlog</h3>
                  <p>
                    Within the nonprofit sector, each initiative team is
                    responsible for maintaining a backlog of project activities,
                    which in the context of software development are often
                    referred to as "user stories." These activities represent
                    the individual tasks or steps necessary to reach the
                    objectives set for each sprint.
                  </p>
                  <p>
                    When introducing a new item to the project backlog, it's
                    essential to categorize and tag it accurately. This practice
                    is vital for a couple of reasons:
                  </p>
                  <ol>
                    <li>
                      Clarity and Organization: Properly labeled tasks help keep
                      the backlog organized, making it easier for team members
                      to understand priorities and deadlines.
                    </li>
                    <li>
                      Performance Tracking: Correct classification allows the
                      team to monitor their efficiency in resolving challenges
                      or issues that arise, which in the nonprofit context could
                      be hurdles like resource limitations, stakeholder
                      engagement issues, or operational setbacks.
                    </li>
                  </ol>
                  <p>
                    For nonprofit teams, it's important to remember that the
                    "user" in user stories may not be a software user but could
                    represent beneficiaries, donors, staff members, or
                    volunteers, essentially any group or individual who will
                    benefit from the task's completion.
                  </p>
                  <p>
                    Regularly updating and refining the backlog ensures that the
                    nonprofit remains focused and adaptable, ready to advance
                    its mission effectively with each completed task.
                  </p>
                  <h3>Points</h3>
                  <p>
                    {' '}
                    project tasks and activities can be as varied and complex as
                    any found in the tech industry. To manage these effectively,
                    employing a scoring system like the Fibonacci sequence (1,
                    3, 5, 8, 13, etc.) helps in quantifying the relative
                    complexity or effort required for each task. This system is
                    advantageous for its nonlinear scale, which more accurately
                    reflects the uncertainty and complexity associated with
                    tasks as they increase in scope.
                  </p>
                  <ul>
                    <li>
                      Initiative-Specific Tasks: For activities that fall within
                      a strategic initiative, the dedicated team assigns a
                      Fibonacci score to each task. A simple task might be a
                      "1," whereas a more complex one might be scored as "5" or
                      "8," depending on the effort and resources needed.
                    </li>
                    <li>
                      General Organizational Tasks: For tasks that are not tied
                      to a specific initiative, a centralized team or appointed
                      specialist evaluates them using the same Fibonacci scale.
                      This helps to determine the relative effort and thus
                      prioritize these tasks accordingly.
                    </li>
                  </ul>
                  <span className="calloutText1">
                    Implementing the Fibonacci scoring system assists nonprofit
                    organizations in several ways:
                  </span>
                  <ol>
                    <li>
                      Prioritizing Projects: With a clear complexity score, it’s
                      easier to decide which projects or tasks should be
                      addressed first based on their importance and the effort
                      required.
                    </li>
                    <li>
                      Resource Management: Understanding task complexity helps
                      in assigning the right amount of resources, preventing
                      both over-commitment on minor tasks and under-resourcing
                      of major ones.
                    </li>
                    <li>
                      Timeline Forecasting: Tasks with higher Fibonacci scores
                      will likely take more time, which can guide more realistic
                      deadline setting.
                    </li>
                    <li>
                      Balancing Workloads: By having a visual and numerical
                      representation of task difficulty, work can be more evenly
                      distributed among team members, preventing burnout.
                    </li>
                  </ol>
                </center>
              </div>
            </Col>
          </Container>
        </Row>
      </div>
      <div>
        {/* <Container>
        <HubSpotContactForm
      id="HubSpotContactForm"

                />
        </Container> */}
      </div>
    </BaseLayout>
  );
}
