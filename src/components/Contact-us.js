import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CONTACT_US } from "./Api";
import Spinner from "./spinner/Spinner";
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";

const ContactUs = () => {
  const [contactLoader, setContactLoader] = useState(false);

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (contactData.name == "") {
      toast.error("Please enter your name");
      return false;
    }
    if (contactData.email == "") {
      toast.error("Please enter your email");
      return false;
    }
    if (contactData.message == "") {
      toast.error("Please enter your message");
      return false;
    }
    try {
      setContactLoader(true);
      const body = {
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
      };
      const {
        data: { message, status },
      } = await axios.post(CONTACT_US, body);
      if (status == 200) {
        toast.success(message);
        setContactLoader(false);
        setContactData({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      if (error.response?.data?.status == 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again..!");
      }
      setContactLoader(false);
    }
  };
  return (
    <>
    {/* <DarkAndLightMode></DarkAndLightMode> */}
      <section className="contact-form">
        <div className="row d-flex align-items-center">
          <div className="col-md-6 col-sm-12">
            <div className="contact-fom-right"></div>
          </div>
          <div className="col-md-6 col-sm-9 middle">
            <div className="contact-fom-left">
              <h2 className="page-heading">Contact Us</h2>
              <form>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={contactData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    onChange={handleChange}
                    value={contactData.email}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Message"
                    name="message"
                    required
                    value={contactData.message}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  {contactLoader && <Spinner />}
                  <input
                    type="submit"
                    defaultValue="Submit"
                    disabled={contactLoader}
                    onClick={handleContact}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="tyr_free_link">
          <h3>
            <Link to="/free-test">
              TRY FOR <span>FREE</span>
            </Link>
          </h3>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
