import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import axios from "axios";
import {
    GET_TESTIMONIALS,
    TEAM_LEAD,
    ABOUT_US,
    ABOUT_WHY_US
} from "../components/Api";
import Spinner from "../components/spinner/Spinner";
import OwlCarousel from "../components/owl-carousel";
import {
    home_crousal,
    promise,
    owlCourses,
    news,
    getTestDate,
    removeTags,
} from "../components/CommonFunction";
import { global } from "../components/Config";
import { useState } from "react";
import { useEffect } from "react";

const About = (props) => {
    const { isDarkMode } = useContext(ThemeContext);

    const [testimonialsLoader, setTestimonialsLoader] = useState(false);
    const [teamLeadLoader, setSetTeamLeadLoader] = useState(false);
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [teamLeadData, setTeamLeadData] = useState({});
    const [aboutUs, setAboutUs] = useState({});
    const [aboutWhyUs, setAboutWhyUs] = useState({});

    useEffect(() => {
        getTestimonials();
        getTeamLead()
        getAboutUs()
        getWhyUs()
    }, []);

    const getTeamLead = async () => {
        try {
            setSetTeamLeadLoader(true);
            const {
                data: { data, status },
            } = await axios.get(TEAM_LEAD);
            if (status == 200) {
                setTeamLeadData(data);
                setSetTeamLeadLoader(false);
            }
        } catch (error) {
            setSetTeamLeadLoader(false);
            console.log(error);
        }
    };
    const getAboutUs = async () => {
        try {
            setSetTeamLeadLoader(true);
            const {
                data: { data, status },
            } = await axios.get(ABOUT_US);
            if (status == 200) {
                setAboutUs(data);
                setSetTeamLeadLoader(false);
            }
        } catch (error) {
            setSetTeamLeadLoader(false);
            console.log(error);
        }
    };
    const getWhyUs = async () => {
        try {
            setSetTeamLeadLoader(true);
            const {
                data: { data, status },
            } = await axios.get(ABOUT_WHY_US);
            if (status == 200) {
                setAboutWhyUs(data);
                setSetTeamLeadLoader(false);
            }
        } catch (error) {
            setSetTeamLeadLoader(false);
            console.log(error);
        }
    };

    // console.log(teamLeadData)

    const getTestimonials = async () => {
        try {
            setTestimonialsLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_TESTIMONIALS);
            if (status == 200) {
                setTestimonialsData(data);
                setTestimonialsLoader(false);
            }
        } catch (error) {
            setTestimonialsLoader(false);
            console.log(error);
        }
    };

    const theme = {
        background: isDarkMode ? '#333' : '#fff',
        text: isDarkMode ? '#fff' : '#333',
    };

    return (
        <>
            <Header />
            {
                teamLeadLoader ? (
                    <div className="spinner_div">
                        <Spinner />
                    </div>
                )
                    :
                    (
                        <>
                            <section className="welcome-ebay">
                                {/* <button onClick={toggleTheme}>Toggle Theme</button> */}
                                <div className="about-memb-inner">
                                    <img src={`https://www.examtice.com/backend${teamLeadData.image}`} alt="" />
                                    <p>
                                        <span>Team Lead:</span> {teamLeadData.title}
                                    </p>
                                    <Link
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.location = "mailto:support@examtice.com";
                                        }}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <p>
                                            <span>Email:</span> {teamLeadData.email}
                                        </p>
                                    </Link>
                                </div>
                                <div className="container">
                                    <div className="about-left">
                                        <h6>ABOUT US</h6>
                                        <h2 className="page-heading">{aboutUs.title}</h2>

                                        {aboutUs && (
                                            <div className="aboutUs_des">
                                                <p dangerouslySetInnerHTML={{ __html: aboutUs.description }}></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section >

                            <section className="about-team">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-12 col-12 pr-5">
                                            <p className="we-head">
                                                <span>Why us:</span>
                                            </p>

                                            {aboutWhyUs && (
                                                <div className="aboutUs_des">
                                                    <p dangerouslySetInnerHTML={{ __html: aboutWhyUs.description }}></p>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )
            }

            <section className="testomonalis-section">
                <div className="container">
                    <h2 className="page-heading">Testimonials</h2>
                    {testimonialsLoader ? (
                        <div className="spinner_div">
                            <Spinner />
                        </div>
                    ) : (
                        <OwlCarousel
                            adClass="owl-carousel owl-theme"
                            customid="promise"
                            options={promise}
                        >
                            {testimonialsData &&
                                testimonialsData.map((item, i) => (
                                    <div className="item" key={i}>
                                        <p>{item.description}</p>
                                        <img
                                            src={
                                                `${global.API_HOST}assets/images/testimonials/` +
                                                item.image
                                            }
                                            alt=""
                                        />
                                        <h5>{item.client_name}</h5>
                                        {/* <span>Our Client</span> */}
                                    </div>
                                ))}
                        </OwlCarousel>
                    )}
                </div>
            </section>

            <section className="our-process">
                <div className="container">
                    <h3 className={`${isDarkMode ? "text_color_light" : "text_color_dark"}`}>
                        <Link to="/free-test">
                            TRY FOR <span>FREE</span>
                        </Link>
                    </h3>
                    <h3 className={`${isDarkMode ? "text_color_light" : "text_color_dark"}`}>
                        <Link to="/eshop">
                            To purchase visit our <span>e-shop</span>
                        </Link>
                    </h3>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default About;
