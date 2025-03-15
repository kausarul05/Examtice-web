import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Contact from "../components/Contact-us";

const ContactUs = ({ props }) => {
  return (
    <>
      <Header />

      {/* contact us form */}
      <Contact />
      {/* contact us form */}

      <Footer />
    </>
  );
};

export default ContactUs;
