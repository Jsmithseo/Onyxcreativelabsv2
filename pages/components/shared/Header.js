import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Collapse,
  NavbarToggler,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const linkStyle = {
    textDecoration: 'none',
    color: 'white',
  };

  const linkHoverStyle = {
    textDecoration: 'underline',
    color: 'white',
  };

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarToggler onClick={toggleNavbar} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              href="/#"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              <span className="brandName">Onyx Creative Labs</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="/about"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Our Story
            </NavLink>
          </NavItem>
          <NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle nav caret style={linkStyle}>
                Solutions 
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/cro">Conversion Rate optimization</DropdownItem>
                <DropdownItem href="/paid-marketing">Paid Marketing</DropdownItem>
                <DropdownItem href="/email">Email</DropdownItem>
                <DropdownItem href="/dev">Web Development</DropdownItem>
                <DropdownItem href="/research">Research and Strategy</DropdownItem>

              </DropdownMenu>
            </Dropdown>
          </NavItem>
          <NavItem>
            <NavLink
              href="/case-studies"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Case Studies
            </NavLink>
          </NavItem>
          {/* <NavItem>
            <NavLink
              href="/contact"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Start a Project
            </NavLink>
          </NavItem> */}

          {/* Pricing Dropdown */}
          {/* <NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle nav caret style={linkStyle}>
                Products 
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/reviews">AI Reviews</DropdownItem>
                <DropdownItem href="https://susuapp.vercel.app/">Susu Fi</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem> */}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default MyHeader;
