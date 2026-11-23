import React from "react";
import Footer from "../modules/footer/Footer";
import Header from "../modules/header/Header";

const AppWrap = (Component) =>
  function HOC() {
    return (
      <div className="app__wrap">
        <Header />

        <Component />

        <Footer />
      </div>
    );
  };

export default AppWrap;
