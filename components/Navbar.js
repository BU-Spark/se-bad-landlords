import React from 'react';
import Link from 'next/link';

// Navbar component
const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {/* Home link */}
        <li className="navbar-item">
          <Link href="/" passHref>
            <a className="navbar-link">Home</a>
          </Link>
        </li>
        {/* Landlords link */}
        <li className="navbar-item">
          <Link href="/Landlord_Page" passHref>
            <a className="navbar-link">Landlords</a>
          </Link>
        </li>
        {/* Map link */}
        <li className="navbar-item">
          <Link href="/mapPage" passHref>
            <a className="navbar-link">Map</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

