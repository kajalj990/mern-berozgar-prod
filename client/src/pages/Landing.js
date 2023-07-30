import { Logo } from "../components";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link, Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import React from "react";
const Landing = () => {
  const { user } = useAppContext();
  return (
    <React.Fragment>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Logo />
        </nav>
        <div className="container page">
          {/**info */}
          <div className="info">
            <h1>
              Job <span>tracking</span> app
            </h1>
            <p>
              A job tracking app allows users to keep track of their job
              applications, including the status of each application, deadlines,
              and important details about each job. It helps users stay
              organized and on top of their job search.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login / Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img  main-img" />
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Landing;
