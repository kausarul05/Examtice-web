import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Menu from './Menu';
// import { userAuth } from '../features/userSlice';
import { useDispatch, useSelector } from "react-redux";
import queryString from 'query-string';
import { useLocation } from 'react-router';
import Reset from './modals/reset';
import { RESET_USER , MY_NOTIFICATION, MY_NOTIFICATION_UPDATE, MY_PROFILE} from './Api';
import { logout, profile, userAuth, userProfile } from "../features/userSlice";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt';
import { GlobalStyles } from '../GlobalStyles/GlobalStyles';
import { Badge } from '@material-ui/core';
import DarkAndLightMode from '../DarkAndLightMode/DarkAndLightMode';
import Cookies from "js-cookie";


const Header = () => {
    let pathname = window.location.pathname;
    const is_auth = useSelector(userAuth);
    const [resetModal, setResetModal] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const location = useLocation();
    const isUserReset = queryString.parse(location.search);
    const history = useHistory();
    const [mobileNotice, setMobileNoticeData] = useState([]);
    const [MobileNotseetotal, setMobileNoticenotsee] = useState(0);

    var isRole =
    !!Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

    const dispatch = useDispatch();

    // console.log(isRole)

    useEffect(() => {
        isResetPopUp();
        getnotice();
    }, []);


    const handleMobileNav = () => {
        setOpen(!isOpen)
    }

    // check if reset modal pop up or not
    const isResetPopUp = () => {
        if (!!isUserReset && isUserReset.reset != null && isUserReset.reset != "") {
            verifyToken(isUserReset.reset);
        } else {
            setResetModal(false);
        }
    }

    //  verify token from DB
    const verifyToken = async (token) => {
        try {
            const {
                data: { status, message },
            } = await axios.get(RESET_USER + '/' + token);
            if (status == 200) {
                setResetModal(true);
            }
        } catch (error) {
            history.push("/");
            toast.error("Something went wrong, try again.!");
        }
    }

    // useEffect(() => {
    //     if (is_auth) {
    //         setIsAuth(true);
    //         getnotice();
    //         //setUserData(JSON.parse(Cookies.get("user_data")));
    //         window.onload = function () {
    //             myProfile();
    //         };
    //     }
    //     return () => {
    //         setIsAuth(false); // clean up function
    //     };
    // }, [is_auth]);

    const getnotice = async () => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const body = {
                user_id: isRole.id,
            };
            const {
                data: { data, status, not_see_total },
            } = await axios.post(MY_NOTIFICATION, body, config);
            if (status == 200) {
                setMobileNoticeData(data);
                // console.log(data)
                setMobileNoticenotsee(not_see_total);
            } else {
                dispatch(profile({ profile: data }));
            }
        } catch (err) {
            console.log(err, "axios error");
        }
    };

    const getnoticeupdate = async (noticeId) => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const body = {
                user_id: isRole.id,
                notice_id: noticeId,
            };
            const {
                data: { data, status, not_see_total },
            } = await axios.post(MY_NOTIFICATION_UPDATE, body, config);
            if (status == 200) {
                // setNoticeData(data.data);
                // setNoticenotsee(not_see_total);
                // getnotice();
            } else {
                dispatch(profile({ profile: data }));
            }
        } catch (err) {
            console.log(err, "axios error");
        }
    };


    const { isDarkMode } = useContext(ThemeContext);

    const theme = {
        background: isDarkMode ? '#000' : '#fff',
        text: isDarkMode ? '#fff' : '#000',
    };

    const logoSRC = isDarkMode ? 'assets/images/logo-2.png' : 'assets/images/logo-white (1).png'

    return (
        <>
            <GlobalStyles theme={theme} />
            <header className="main-header">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <Link to={(is_auth ? "/user/dashboard" : "/") && (isRole.affiliate_role == 7 ? "/lms/dashboard" : "/")} className="navbar-brand"><img src={logoSRC} alt="" /></Link>
                        
                        <div className='d-md-block d-lg-none d-block w-40'>
                            <DarkAndLightMode></DarkAndLightMode>
                        </div>

                        {(!!is_auth && isRole ) ? (
                            <ul className="navbar-nav mr-auto d-lg-none d-md-block d-block" style={{width: "70px"}}>
                            <li className="">
                                <Link
                                    className={` d-flex${pathname === "#" ? "nav-link active" : "nav-link"
                                        } ${isDarkMode ? 'color_light' : 'color_dark'}`}
                                    to="#"
                                >
                                    <Badge badgeContent={MobileNotseetotal} color="secondary">
                                        <span style={{width: "30px"}}>
                                            <i className="fas fa-bell"></i>
                                        </span>
                                    </Badge>
                                </Link>

                                <ul className="profile-dropdown notification-view">
                                    {mobileNotice?.map((item, index) =>
                                        item.is_view == 0 ? (
                                            item.notice_type == 1 || item.notice_type == 5 ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to="/lms/subscription" onClick={(e) => { getnoticeupdate(item.id) }}>
                                                            <b>{item.notice_text}</b>
                                                        </Link>
                                                    </li>
                                                </>
                                            ) : (
                                                item.notice_type == 7 ? (
                                                    <>
                                                        <li>
                                                            <Link className="nav-link" to={item.slug} onClick={(e) => { getnoticeupdate(item.id) }}>
                                                                <b>{item.notice_text}</b>
                                                            </Link>
                                                        </li>
                                                    </>
                                                ) :
                                                    item.notice_type == 8 ? (
                                                        <>
                                                            <li>
                                                                <Link className="nav-link" to={item.slug} onClick={(e) => { getnoticeupdate(item.id) }}>
                                                                    <b>{item.notice_text}</b>
                                                                </Link>
                                                            </li>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <li>
                                                                <Link className="nav-link" to="/lms/exam" onClick={(e) => { getnoticeupdate(item.id) }}>
                                                                    <b>{item.notice_text}</b>
                                                                </Link>
                                                            </li>
                                                        </>
                                                    )
                                            )

                                        ) : (
                                            item.notice_type == 1 || item.notice_type == 5 ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to="/lms/subscription">
                                                            {item.notice_text}
                                                        </Link>
                                                    </li>
                                                </>
                                            ) : item.slug != '' ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to={item.slug}>
                                                            {item.notice_text}
                                                        </Link>
                                                    </li>
                                                </>
                                            ) : (

                                                <>
                                                    <li>
                                                        <Link className="nav-link" to="/lms/exam">
                                                            {item.notice_text}
                                                        </Link>
                                                    </li>
                                                </>
                                            )
                                        )
                                    )}

                                </ul>
                            </li>
                        </ul>
                        )
                        :
                        ("")
                    }


                        <button className="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation" onClick={handleMobileNav}>
                            <span className="navbar-toggler-icon"></span>
                        </button>


                        <div className={`${isOpen ? 'show' : ''} collapse navbar-collapse ${isDarkMode ? "navbar_color " : "navbar_dark"}`} id="navbarSupportedContent">
                            <Menu is_auth={is_auth} />
                        </div>
                        {/* <div className='mt-5 pb-5'>
                            <button onClick={isDarkMode}>dark mode</button>
                        </div> */}
                    </nav>
                </div>

                <Reset show={resetModal} close={() => setResetModal(false)} token={isUserReset} />
            </header>
        </>
    );
}
export default Header;