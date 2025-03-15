import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Signin from "../components/modals/signin";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";

const Learningmanagementsystem = (props) => {
  const [open, setOpen] = useState(false);
  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <>
      {/* <DarkAndLightMode></DarkAndLightMode> */}
      <Header />
      {/* <section className="inner-banner">
        <img src="assets/images/affiliate-banner.jpg" alt="" />
        <div className="inner-banner-overlay">
          <h2>Examtice Affiliate</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus
            mus.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor
          </p>
        </div>
      </section> */}
      <section className="become-learningmanagement">
        <div className="container">
          <h2 className="page-heading">LEARNING MANAGEMENT SYSTEM (LMS)</h2>
          {/* <div className="row about-member">
            <div className="col-md-4">
              <div className="our-process-inner">
                <span>Join as an Learning Management System</span>
                <p>It’s free to get started.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="our-process-inner">
                <span>Promote Examtice</span>
                <p>Register your target audience.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="our-process-inner">
                <span>Start Earning</span>
                <p>Earn right from the moment you register a subscriber</p>
              </div>
            </div>
          </div> */}
          <div className="row">
            <div className="col-md-6 col-12 mobile-view">
              <Link className="common-btn" to={`/lms/signin`}>
                JOIN NOW / LOGIN <br />
                <small>(for parents and teachers)</small>
              </Link>
            </div>
            <div className="col-md-6 col-12">
              <Link
                className="common-btn"
                to="#"
                onClick={() => setOpen(true)}
              >
                LOGIN AS STUDENT
              </Link>
            </div>

          </div>
          <br />
          <h5>ASSIGN TESTS/EXAMS</h5>
          <p>
            LMS allows Parents and Teachers to set up a series of tests and exams(Task) for theirstudents
            /ward to ensure they practice regularly and deepen their knowledge.
          </p>
          <h5>MONITOR YOUR STUDENT’S PROGRESS</h5>
          <p>Follow your student’s scores and testing history - see how diligently they study and improve.
            Discovering their weaknesses through statistics and reports will help you focus your teaching.
          </p>

        </div>
      </section>
      <Footer />
      <Signin show={open} closePop={handleCloseModal} />
    </>
  );
};

export default Learningmanagementsystem;
