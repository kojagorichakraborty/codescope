import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <div className="bottom-nav">
      <Link to="/">🏠 Home</Link>
      <Link to="/favorites">❤️ Favorites</Link>
      <Link to="/bookings">🎟️ Booking</Link>
      <Link to="/profile">👤 Profile</Link>
    </div>
  );
}
