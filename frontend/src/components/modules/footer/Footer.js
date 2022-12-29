import React from "react";
import "./Footer.css";
import logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div id="footer">
      <div className="left-footer">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="mid-footer">
        <Link to="/">
          <img
            className="footer-logo"
            src={logo}
            alt="logo"
            width="100%"
            height="auto"
            loading="lazy"
          />
        </Link>

        <p>Copyrights 2021-2022 &copy;NixLab Technologies</p>
      </div>

      <div className="right-footer">
        <a href="http://github.com/nixrajput" target="_blank" rel="noreferrer">
          <FaGithub />
        </a>

        <a
          href="http://instagram.com/nixrajput"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram />
        </a>

        <a
          href="http://linkedin.com/in/nixrajput"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin />
        </a>

        <a
          href="http://twitter.com/nixrajput07"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter />
        </a>
      </div>
    </div>
  );
}

export default Footer;
