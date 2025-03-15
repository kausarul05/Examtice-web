import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import { GET_AFFILIATE_DASHBOARD, MY_PROFILE } from "../../components/Api";
import Cookies from "js-cookie";
import Spinner from "../../components/spinner/Spinner";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import { useDispatch, useSelector } from "react-redux";
import { userProfile, profile } from "../../features/userSlice";

const AffiliateDashboard = () => {
    const [affiliateLoader, setAffiliateLoader] = useState(false);
    const [affiliateData, setAffiliate] = useState([]);
    const dispatch = useDispatch();
    const userReduxData = useSelector(userProfile).user.profile;

    useEffect(() => {
        getAffiliateDashboard();
    }, []);

    const getAffiliateDashboard = async () => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            setAffiliateLoader(true);
            const {
                data: { data, status },
            } = await axios.post(GET_AFFILIATE_DASHBOARD, null, config);
            if (status == 200) {
                setAffiliate(data);
                setAffiliateLoader(false);
            }
        } catch (error) {
            setAffiliateLoader(false);
            //console.log(error);
        }
    };

    useEffect(() => {
        getReffterDashboard();
    }, []);

    const getReffterDashboard = async () => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const {
                data: { data, status },
            } = await axios.post(MY_PROFILE, null, config);
            if (status == 400) {
                // history.push("/");
            } else {
                dispatch(profile({ profile: data }));
                // console.log(dispatch(profile({ profile: data })))
            }
        } catch (err) {
            console.log(err, "axios error");
        }
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />

            <section className="earning-banner">
                <div className="container">
                    <div className="row d-flex align-items-center">
                        <div className="col-md-6">
                            <div className="earning-banner-left">
                                <h4>Refer your Friends &amp; Earn Money</h4>
                                <p>
                                    Introduce Your Friends To Examtice And be Credited with 20% of the subscrption fees instatntly
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="earning-banner-right">
                                <img src="assets/images/earn-1.png" alt="" />
                                <div className="d-md-block d-none">
                                    <div className={`credit-blog ${isDarkMode ? 'color_dark' : 'color_dark'}`}>
                                        <h5>₦ {affiliateData.totalAmount}</h5>
                                        <span>Credit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="earning-widthdral">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="widthdral-inner width-one">
                                <span />
                                <div className="row">
                                    <div className="col-md-3">
                                        <img src="assets/images/dl-1.png" alt="" />
                                    </div>
                                    <div className="col-md-6 ern-mny">
                                        <p>Monthly Balance</p>
                                        <h5>₦ {affiliateData.oneMonth}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <div className="widthdral-inner width-two">
                                <span />
                                <div className="row">
                                    <div className="col-md-3">
                                        <img src="assets/images/dl-2.png" alt="" />
                                    </div>
                                    <div className="col-md-6 ern-mny">
                                        <p>Refferral Signup</p>
                                        <h5>₦150</h5>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="col-md-4">
                            <div className="widthdral-inner width-three">
                                <span />
                                <div className="row">
                                    <div className="col-md-3">
                                        <img src="assets/images/dl-3.png" alt="" />
                                    </div>
                                    <div className="col-md-6 ern-mny">
                                        <p>Total Balance</p>
                                        <h5>₦ {affiliateData.totalAmount}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="widthdral-inner width-three">
                                <span />
                                <div className="row">
                                    <div className="col-md-3">
                                        <img src="assets/images/dl-3.png" alt="" />
                                    </div>
                                    <div className="col-md-6 ern-mny">
                                        <p>Referral Code</p>
                                        <p className="text-end">
                                            {!!userReduxData && userReduxData.refer_id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mt-5">
                            <Link to='/affiliate/refferUser'>
                                <div className="widthdral-inner width-three">
                                    <span />
                                    <div className="row">
                                        <div className="col-md-3">
                                            <img src="assets/images/dl-3.png" alt="" />
                                        </div>
                                        <div className="col-md-6 ern-mny">
                                            <p className={`text-decoration-none ${isDarkMode ? 'color_light' : 'color_dark'}`} >Referral list</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    {
                        affiliateLoader && <Spinner />
                        // <div className="spinner_div">
                        //   <Spinner /> 
                        // </div>
                    }
                    <Link to={'/affiliate/withdraw'} style={{ textDecoration: 'none' }}>
                        <button className="common-btn" >Quick withdraw</button>
                    </Link>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default AffiliateDashboard;
