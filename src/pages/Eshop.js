import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { GET_COURSES } from "../components/Api";
import { global } from "../components/Config";
import { toast } from "react-toastify";
import { css } from "@emotion/react";
import Spinner from "../components/spinner/Spinner";
import Cookies from "js-cookie";
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 0 auto;
  border-color: black;
  size: 35px;
  border-color: #fffff;
`;

const Eshop = (props) => {
    const [courses, setCourses] = useState([]);
    let [loader, setLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getCourses();
    }, []);

    //get course
    const getCourses = async () => {
        try {
            setLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_COURSES);
            if (status == 200) {
                setCourses(data);
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            toast.error("Something went wrong, please try again.!");
        }
    };

    // If user click on buy button
    const handleBuyCourse = (e) => {
        e.preventDefault();
        if (Cookies.get("token") && Cookies.get("user_data")) {
            history.push("/user/buy-package/" + e.target.id);
        } else {
            toast.error("Kindly Logged In..!");
        }
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <section className="become-affilated eshop">
                <div className="container">
                    <h2 className="page-heading">E-Shop</h2>
                    {loader ? (
                        <div className="spinner_div">
                            <Spinner />
                        </div>
                    ) : (

                        <div className="row books-collection">
                            {courses.length > 0 ? (
                                courses.map((item, i) => (
                                    <div className="col-md-6 col-12  mobileeshop-view mb-5" key={i}>
                                        <div className={`e-book-inner-mobile-view ${isDarkMode ? 'e-book-inner-desktop-dark' : 'e-book-inner-desktop-light'}`}>
                                            <div className="col-md-4 eshop_item_mobile_img">
                                                <img
                                                    src={
                                                        `${global.API_HOST}assets/images/courses/` +
                                                        item.image
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className="col-md-8 col-8 item_info_mobile_cont">

                                                <div className="">
                                                    <div className="d-block mb-3">
                                                        <b>{item.name} </b>
                                                    </div>
                                                    <div className="d-block mb-3">
                                                        <i>{item.description}</i>
                                                    </div>
                                                    <div className="d-block mb-3">
                                                        &nbsp;
                                                        <span>₦ {item.price_ngn}</span>
                                                        <Link
                                                            className="nav-link"
                                                            to={`/user/buy-package/${item.id}`}
                                                        >
                                                            Buy now
                                                        </Link>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No courses found..!</p>
                            )}

                            {courses.length > 0 ? (
                                courses.map((item, i) => (
                                    <div className="col-md-6 col-12 desktopeshop-view" style={{marginBottom: '40px'}} key={i}>
                                        <div className={`e-book-inner-desktop e-book-desktop ${isDarkMode ? 'e-book-inner-desktop-dark' : 'e-book-inner-desktop-light'}`}>
                                            <div className="col-md-4 eshop_item_img">
                                                <img
                                                    src={
                                                        `${global.API_HOST}assets/images/courses/` +
                                                        item.image
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className="col-md-8 item_info">
                                                <div className="eshop-item-des ml-3">
                                                    <div className="d-block mb-3">
                                                        <b>{item.name} </b>
                                                    </div>
                                                    <div className="d-block mb-4">
                                                        <i className={isDarkMode ? 'e-shop-color-light' : 'e-shop-color-dark'}>{item.description}</i>
                                                    </div>
                                                    <div className="d-block mb-3">
                                                        &nbsp;
                                                        <span>₦ {item.price_ngn}</span>
                                                        <Link
                                                            className="nav-link"
                                                            to={`/user/buy-package/${item.id}`}
                                                        >
                                                            Buy now
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No courses found..!</p>
                            )}
                        </div>
                    )
                    }



                    <div className="row">
                        <div className="col-md-12 col-lg-7">
                            <h5>SUBSCRIPTION</h5>
                            <p>
                                Subscriptions to our examination platform contain questions &
                                answers with explanations for MCQ, Theory and where applicable
                                Practicals:
                            </p>
                            <h5>REQUIREMENTS</h5>
                            <p>
                                <ul>
                                    <li>
                                        The latest version of an internet browser is recommended for
                                        ONLINE study.
                                    </li>
                                    <li>
                                        Any device with a supported version of the operating system
                                        (iOS, macOS, Android, Windows) for Exam app that allows
                                        OFFLINE test preparation (coming soon).
                                    </li>
                                </ul>
                            </p>
                            <h5>SUBSCRIPTION DETAILS</h5>
                            <p>
                                Get access to Examtice Question Bank and avoid surprises on your
                                exams. Studying from the collection of up to date questions and
                                answers, you get the most preparation for your school exams for
                                the exam syllabus.{" "}
                            </p>
                            <p>
                                {" "}
                                The database contains over 130 000 exam questions sorted into
                                individual exams and subareas to reflect the structure of the
                                learning objectives.
                            </p>
                        </div>
                        <div className="col-md-12 col-lg-5">
                            <h5>WHY SHOULD I CHOOSE EXAMTICE</h5>
                            <p>
                                <ul>
                                    <li>Detailed explanations to all questions</li>
                                    <li>
                                        Frequent updates to ensure the best possible representation
                                        of the question bank
                                    </li>
                                    <li>
                                        Multi-platform capability – study online or use our
                                        applications that also run offline
                                    </li>
                                    <li>Picture and Video supplements in high quality.</li>
                                    <li>Make private notes for specific questions.</li>
                                    <li>
                                        Discuss specific questions with other students through
                                        comments.
                                    </li>
                                    <li>
                                        Unbeatable statistics, reports and progress monitoring.
                                    </li>
                                    <li>Search for specific keywords in questions and answers</li>
                                    <li>
                                        Mark questions for later review or set various question
                                        flags.
                                    </li>
                                    <li>
                                        System reliability is achieved through the use of robust
                                        hardware architecture; multiple backup systems and
                                        high-bandwidth server connectivity.
                                    </li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    {/* <a className="common-btn" href="#">
            See More
          </a> */}
                </div>
            </section>

            {/* <Signin show={open} closePop={handleCloseModal} />   */}

            <Footer />
        </>
    );
};

export default Eshop;
