import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  };

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/#" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>
              <span className="brandName">Onyx Creative Labs</span>
            </NavLink>
          </NavItem>
          <NavItem><NavLink href="/90-day-pilot" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>90-Day Pilot</NavLink></NavItem>
          <NavItem><NavLink href="/content-marketing" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>Content Marketing</NavLink></NavItem>
          <NavItem><NavLink href="/growth-plan" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>Growth Plan</NavLink></NavItem>
          <NavItem><NavLink href="/case-studies" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>Case Studies</NavLink></NavItem>
          <NavItem><NavLink href="/products" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>Products</NavLink></NavItem>
          <NavItem><NavLink href="/about" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')} onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}>Our Story</NavLink></NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default MyHeader;
