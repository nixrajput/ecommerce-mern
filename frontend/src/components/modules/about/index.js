import "./About.css";
import React from "react";
import MetaData from "../../layout/MetaData";
import AppWrap from "../../hoc/AppWrap";
import LogoImg from "../../../assets/images/logo.png";

const Index = () => {
  return (
    <div className="app__top-margin">
      <MetaData title="About - NixLab Shop" />

      <div className="flex-container">
        <div className="app__flex-card">
          <div className="about-container">
            <img src={LogoImg} alt="logo" className="logo" />

            <p className="desc">
              An E-commerce Web App developed using MERN stack where user can
              buy and checkout product with ease and add their review and rating
              for the products.
            </p>

            <h2>Tools & Technologies Used</h2>

            <div className="tech-box">
              <div className="custom-item-tile">
                <div className="leading">Programming Languages</div>

                <div className="trailing">JavaScript</div>
              </div>

              <div className="custom-item-tile">
                <div className="leading">Web Technologies</div>

                <div className="trailing">HTML, CSS</div>
              </div>

              <div className="custom-item-tile">
                <div className="leading">Frameworks & Libraries</div>

                <div className="trailing">React.js, Node.js, Express.js</div>
              </div>

              <div className="custom-item-tile">
                <div className="leading">Databases</div>

                <div className="trailing">MongoDB</div>
              </div>

              <div className="custom-item-tile">
                <div className="leading">Services</div>

                <div className="trailing">Heroku, Stripe, Cloudinary</div>
              </div>

              <div className="custom-item-tile">
                <div className="leading">Tools</div>

                <div className="trailing">VS Code, Git</div>
              </div>
            </div>

            <h2>Designed & Developed By</h2>

            <div className="dev-box">
              <img
                src="https://avatars.githubusercontent.com/u/10887215?v=4"
                alt="nixrajput"
                className="user-img"
              />

              <h3>
                <a
                  href="https://nixrajput.nixlab.co.in"
                  target="_blank"
                  rel="noreferrer"
                >
                  Nikhil Rajput
                </a>
              </h3>

              <p>Full Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppWrap(Index);
