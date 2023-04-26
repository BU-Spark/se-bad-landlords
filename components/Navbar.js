import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link href="/" passHref>
            <a className="navbar-link">Home</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/Landlords" passHref>
            <a className="navbar-link">Landlords</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/map" passHref>
            <a className="navbar-link">Map</a>
          </Link>
        </li>
        <li className="navbar-item">
          <Link href="/contact" passHref>
            <a className="navbar-link">Contact</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
