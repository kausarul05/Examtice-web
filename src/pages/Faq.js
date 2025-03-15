import React, { useEffect, useState } from "react";
//import { Link, useHistory } from "react-router-dom";
import Header from "../components/Header";
import { Link, useHistory } from "react-router-dom";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { global } from "../components/Config";
import Spinner from "../components/spinner/Spinner";
import Faq from "react-faq-component";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import { FAQ } from "../components/Api";
import axios from "axios";
import Cookies from "js-cookie";

const Faqlist = () => {
    const [loader, setLoader] = useState(false);
    const [faqQuestions, setFaqQuestions] = useState([])

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };


    useEffect(() => {
        fetch("https://examtice.com/backend/api/faq/list")
            .then(res => res.json())
            .then(data => setFaqQuestions(data.data))
    }, [])

    // console.log(faqQuestions)

    const data = {
        title: "FAQ (How it works)",
        rows: faqQuestions
    };


    const { isDarkMode } = useContext(ThemeContext);

    const styles = {
        // bgColor: 'white',
        titleTextColor: 'dark',
        rowTitleColor: "#f12679",
        rowContentColor: 'dark',
        arrowColor: "#f12679",
    };

    const config2 = {
        // animate: true,
        // arrowIcon: "V",
        // tabFocus: true
    };

    return (
        <>
            <Header />

            {/* <section className="inner-banner">
          <img src="assets/images/about-banner.jpg" alt="" />
        </section> */}
            <section className="welcome-ebay">
                <div className="container">
                    <div className="about-left">
                        <h6>FAQ</h6>
                        <h2 className="page-heading">Frequently Asked Questions</h2>
                        <Faq
                            data={data}
                            styles={styles}
                            config={config2}
                        />
                    </div>
                </div>
            </section>
            <Footer />

            {/* < ToastContainer /> */}
        </>

    );
};
export default Faqlist;