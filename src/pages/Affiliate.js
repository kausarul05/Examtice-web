import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Signin from "../components/modals/signin";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import { GlobalStyles } from "../GlobalStyles/GlobalStyles";
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";

const Affiliate = (props) => {
    const [open, setOpen] = useState(false);
    const handleCloseModal = () => {
        setOpen(false);
    };

    const { isDarkMode } = useContext(ThemeContext);

    const theme = {
        background: isDarkMode ? '#333' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
    };
    return (
        <>
            <Header />
            <section className="become-affilated">
                <div className="container">
                    <h2 className="page-heading">Examtice Affiliate</h2>

                    <h5>Earn 20% of the subscription fee</h5>

                    <div className="row">
                        <div className="col-6" style={{ marginBottom: '30px' }}>
                            <Link className="common-btn" to={`/affiliate/signin`}>
                                JOIN NOW / LOGIN
                            </Link>
                        </div>
                        <div className="col-6">
                            <Link
                                className="common-btn"
                                to="#"
                                onClick={() => setOpen(true)}
                            >
                                LOGIN AS STUDENT
                            </Link>
                        </div>
                    </div>

                    <h5>Examtice Affiliate Benefits</h5>
                    <h5>Earn good income</h5>
                    <p>
                        Get paid every time you register a subscriber. Also, get paid when
                        you renew an already registered subscriber
                    </p>
                    <h5>Examtice Support</h5>
                    <p>Gain access to professional support</p>
                    <h5>Dashboard </h5>
                    <p>
                        Easy-to-use dashboard. See how much you have earned. Cash out
                        anytime you want once you have earned above N10,000.
                    </p>
                </div>
            </section>
            <Footer />
            <Signin show={open} closePop={handleCloseModal} />
        </>
    );
};

export default Affiliate;
