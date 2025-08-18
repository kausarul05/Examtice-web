import React, { useContext } from "react";
import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import { GlobalStyles } from "../GlobalStyles/GlobalStyles";

const Footer = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const theme = {
        background: isDarkMode ? '#222224' : '#fff',
        text: isDarkMode ? '#fff' : '#222224',
    };

    const logoSRC = isDarkMode ? 'assets/images/logo-2.png' : 'assets/images/logo-2.png'

    return (
        <>
        <GlobalStyles theme={theme} />
            <WhatsAppWidget
                phoneNo="+2348127000020"
                position="right"
                widgetWidth="300px"
                widgetWidthMobile="60px"
                autoOpen={false}
                autoOpenTimer={5000}
                messageBox={true}
                messageBoxTxt=""
                iconSize="60"
                iconColor="white"
                iconBgColor="green"
                headerIcon="https://examtice.com/assets/images/white_logo.png"
                headerIconColor="pink"
                headerIconBgColor="black"
                headerTxtColor="black"
                headerBgColor="#ff1d6a"
                headerTitle="Examtice"
                headerCaption="Online"
                bodyBgColor="#bbb"
                chatPersonName="Support"
                chatMessage={<>Hi there 👋 <br /><br /> How can I help you?</>}
                footerBgColor="#999"
                btnBgColor="#ff1d6a"
                btnTxtColor="black"
                btnTxt="Start Chat"
            />
            
            <footer className={`${isDarkMode ? "footer_light" : "footer_dark"} page-footer`}>
                <div className="container">
                    <div className="inner-footer">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="footer-nav">
                                    <img src={logoSRC} alt="" />
                                    {/* <p>50 Raritan Center Pkwy, <br />Edison, NJ 08837, USA</p> */}
                                    <span>
                                        {/* <Link to="#"><i className="fas fa-phone" />+00 111 222 1234</Link> */}
                                        <Link
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.location = "mailto:support@examtice.com";
                                            }}
                                            
                                        >
                                            <i className="fas fa-envelope" />
                                            <span className={isDarkMode ? '' : ''}>support@examtice.com</span>
                                        </Link>
                                    </span>
                                    <div className="footer-social middle">
                                        <a href="https://www.facebook.com/examtice" target="_blank">
                                            <i className="fab fa-facebook-f" />
                                        </a>
                                        <a href="https://twitter.com/examtice" target="_blank">
                                            <i className="fab fa-twitter" />
                                        </a>
                                        <a href="https://www.instagram.com/examtice.official/" target="_blank">
                                            <i className="fab fa-instagram" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-nav-page">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about">About us</Link>
                        </li>
                        <li>
                            <Link to="/free-test">Free test</Link>
                        </li>
                        <li>
                            <Link to="/blog">Latest news</Link>
                        </li>
                        <li>
                            <Link to="/faq">FAQ</Link>
                        </li>
                        <li>
                            <Link to="/contact-us">Contact us</Link>
                        </li>
                        <li>
                            <Link to="/terms-condition">Terms & Condition</Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/terms-of-use">Terms of use</Link>
                        </li>
                        <li>
                            <Link to="/disclaimer">Disclaimer</Link>
                        </li>
                        {/* <li>
                            <Link to="/terms-condition">Terms & Condition</Link>
                        </li> */}
                        {/* <li>
                            <Link to="/affiliate-terms-condition">Affiliate Terms & Condition</Link>
                        </li> */}
                    </ul>
                </div>
                <div className="copy-right">
                    <p>©2021 Examtice. All Rights Reserved</p>
                </div>
            </footer>
        </>
    );
};
export default Footer;
