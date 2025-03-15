import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer';
import Signin from "./modals/signin";
import { logout, profile, userAuth, userProfile } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Logout from "../components/modals/logout";
import { toast } from "react-toastify";
import axios from "axios";
import { LOGOUT, MY_PROFILE, MY_NOTIFICATION, MY_NOTIFICATION_UPDATE } from "../components/Api";
import Cookies from "js-cookie";
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";

const Menu = ({ is_auth }) => {
    let pathname = window.location.pathname;
    const dispatch = useDispatch();
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [notice, setNoticeData] = useState([]);
    const [notseetotal, setNoticenotsee] = useState(0);
    const [isAuth, setIsAuth] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const userReduxData = useSelector(userProfile).user.profile;
    
    //const is_auth = useSelector(userAuth);
    var isRole =
        !!Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

    // check if page reload then hit an isRole

    // useEffect(() => {
    //   window.onload = function() {
    //     myProfile();
    //   };
    // }, []);
    
    //Cookies.set('user_data', 7);
//    console.log(Cookies.get("token"))


    useEffect(() => {
        if (is_auth) {
            setIsAuth(true);
            getnotice();
            //setUserData(JSON.parse(Cookies.get("user_data")));
            window.onload = function () {
                myProfile();
            };
        }
        return () => {
            setIsAuth(false); // clean up function
        };
    }, [is_auth]);

    // get user profile
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
                setNoticeData(data);
                //console.log(data)
                setNoticenotsee(not_see_total);
            } else {
                dispatch(profile({ profile: data }));
            }
        } catch (err) {
            console.log(err, "axios error");
        }
    };

    // console.log("Check Notification", notice)

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

    const myProfile = async () => {
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
                history.push("/");
            } else {
                dispatch(profile({ profile: data }));
            }
        } catch (err) {
            console.log(err, "axios error");
        }
    };

    // handle to close the modal
    const handleCloseModal = () => {
        setOpen(false);
    };

    // handle logout pop up
    const handleLogoutPopUp = (e) => {
        e.preventDefault();
        setIsLogout(true);
    };

    const handleLogout = () => {
        userLogout();
        
        toast.success("Logout successfully..!");
        setTimeout(() => {
            dispatch(logout());
            setIsLogout(false);
            // history.push("/");
            window.location.href = "/";
            setIsAuth(false);
            Cookies.remove("token");
            Cookies.remove("user_data");
        }, 300);
    };


    const idleTimeLogout = () => {
        if (is_auth) {
            userLogout();

            toast.warning("Logout beacuse of idle time limit..!");
            setTimeout(() => {
                dispatch(logout());
                setIsLogout(false);
                history.push("/");
                setIsAuth(false);
                Cookies.remove("token");
                Cookies.remove("user_data");
            }, 300);
        }
    };

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 30,
        onIdle: idleTimeLogout,
        debounce: 500
    });

    const userLogout = async () => {
        try {
            var config = {
                headers: { Authorization: Cookies.get("token") },
            };
            const data = await axios.post(LOGOUT, null, config);

        } catch (error) {
            console.log(error);
            //toast.error("Something went wrong, please try again..!");
        }
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <React.Fragment>
            <ul className="navbar-nav mr-auto">
                <div className="d-lg-block d-md-none d-none">
                    <DarkAndLightMode></DarkAndLightMode>

                </div>
                {!isAuth ? (
                    <>
                        {/* <li className="nav-item">
                        <Link
                            className={`${
                            pathname === "/" ? "nav-link active" : "nav-link"
                            }`}
                            to="/"
                        >
                            Home
                        </Link>
                            </li> */}
                        <li className={`nav-item ${isDarkMode ? 'color_light' : 'color_light'}`} >
                            <Link
                                className={`${pathname === "/about" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/free-test" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/free-test"
                            >
                                Free test
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/blog" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/blog"
                            >
                                News/Blog
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/eshop" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/eshop"
                            >
                                Shop
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/forum-home" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/forum-home"
                            >
                                Forum
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/lms" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/lms"
                            >
                                LMS
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/affiliate" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/affiliate"
                            >
                                Affiliate
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/contact-us" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/contact-us"
                            >
                                Contact
                            </Link>
                        </li>

                        <li className="nav-item sign-up">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                                onClick={() => setOpen(true)}
                            >
                                <span>
                                    <i className="fas fa-user"></i>
                                </span>
                                SIGN IN
                            </Link>
                        </li>
                    </>
                ) : (!!isAuth && !!isRole && isRole.affiliate_role == 5) ||
                    isRole.affiliate_role == 6 ? (
                    <>
                        <li className="nav-item mobile_tab_hidden ">
                            <Link
                                className={` d-lg-block d-md-none d-none d-flex ${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <Badge badgeContent={notseetotal} color="secondary">
                                    <span>
                                        <i className="fas fa-bell"></i>
                                    </span>
                                </Badge>
                            </Link>


                            <ul className="profile-dropdown notification-view">

                                {notice?.map((item, index) =>
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
                                                            <Link className="nav-link" to={item.slug} onClick={(e) => { getnoticeupdate(item.id) }}>
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
                        <li className="nav-item mobile_tab_hidden">
                            <Link
                                className={`${pathname === "/user/dashboard"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/user/dashboard"
                            >
                                Student Dashboard
                            </Link>
                        </li>

                        <li className="nav-item mobile_tab_hidden">
                            <Link
                                className={`${pathname === "/affiliate/dashboard"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/affiliate/dashboard"
                            >
                                Affiliate Dashboard
                            </Link>
                        </li>

                        <li className="nav-item sign-up">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <span>
                                    <i className="fas fa-user"></i>
                                </span>
                                {!!userReduxData && userReduxData.first_name}
                            </Link>

                            <ul className="profile-dropdown">
                                <li style={{color : "#000"}}>
                                    <Link className="nav-link" to="/user/my-account">
                                        <i className="fas fa-user"></i> My profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/user/subscription">
                                        <i className="fas fa-cog"></i>Subscription
                                    </Link>
                                </li>
                                {/* <li>
                  <Link to="#">
                    <i className="fas fa-envelope"></i>Notifiaction
                  </Link>
                </li> */}
                                <li>
                                    <Link to="/user/reports">
                                        <i className="fas fa-list"></i>Reports
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/affiliate/subscribe_users">
                                        <i className="fas fa-users"></i>Subscribed users
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/affiliate/transaction">
                                        <i className="fas fa-wallet"></i>Transaction
                                    </Link>
                                </li>
                                <li className="mobile_tab_show">
                                    <Link to="/user/dashboard">
                                        <i className="fas fa-wallet"></i>Student Dashboard
                                    </Link>
                                </li>
                                <li className="mobile_tab_show">
                                    <Link to="/affiliate/dashboard">
                                        <i className="fas fa-wallet"></i>Affiliate Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/user/support">
                                        <i className="fas fa-sms"></i>Support
                                    </Link>
                                </li>

                                {/* <li>
                                    
                                        <Link to=''>
                                            <i className="fas fa-bell"></i>
                                            Notification
                                        </Link>
                                    
                                </li> */}

                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLogout(true);
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>Logout
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </>
                ) : (!!isAuth && !!isRole && isRole.affiliate_role == 7) ||
                    isRole.affiliate_role == 8 ? (
                    <>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <Badge badgeContent={notseetotal} color="secondary">
                                    <span>
                                        <i className="fas fa-bell"></i>
                                    </span>
                                </Badge>
                            </Link>
                            <ul className="profile-dropdown notification-view">

                                {notice.map((item, index) =>
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
                                        ) : (
                                            item.notice_type == 7 ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to={item.slug}>
                                                            {item.notice_text}
                                                        </Link>
                                                    </li>
                                                </>
                                            ) :
                                                item.notice_type == 8 ? (
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
                                    )
                                )}

                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/lms/dashboard"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/lms/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/lms/create-test"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/lms/create-test"
                            >
                                Create Test
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/eshop" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/eshop"
                            >
                                E-shop
                            </Link>
                        </li>
                        <li className="nav-item sign-up">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <span>
                                    <i className="fas fa-user"></i>
                                </span>
                                {!!userReduxData && userReduxData.first_name}
                            </Link>
                            <ul className="profile-dropdown">
                                <li>
                                    <Link className="nav-link" to="/lms/my-account">
                                        <i className="fas fa-user"></i> My profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/lms/subscription">
                                        <i className="fas fa-cog"></i>Subscribe Students
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/lms/exam">
                                        <i className="fas fa-cog"></i>Exam
                                    </Link>
                                </li>
                                {/* <li>
                  <Link to="#">
                    <i className="fas fa-envelope"></i>Notifiaction
                  </Link>
                </li> */}
                                <li>
                                    <Link to="/lms/results">
                                        <i className="fas fa-list"></i>Results
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/lms/support">
                                        <i className="fas fa-sms"></i>Support
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLogout(true);
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>Logout
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <Badge badgeContent={notseetotal} color="secondary">
                                    <span>
                                        <i className="fas fa-bell"></i>
                                    </span>
                                </Badge>
                            </Link>
                            <ul className="profile-dropdown notification-view">

                                {notice.map((item, index) =>
                                    item.is_view == 0 ? (
                                        item.notice_type == 2 || item.notice_type == 6 ? (
                                            <>
                                                <li>
                                                    <Link className="nav-link" to="/user/teachersubscription" onClick={(e) => { getnoticeupdate(item.id) }}>
                                                        <b>{item.notice_text}</b>
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            item.notice_type == 7 ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to={item.slug}>
                                                            <b>{item.notice_text}</b>
                                                        </Link>
                                                    </li>
                                                </>
                                            ) :
                                                item.notice_type == 8 ? (
                                                    <>
                                                        <li>
                                                            <Link className="nav-link" to={item.slug}>
                                                                <b>{item.notice_text}</b>
                                                            </Link>
                                                        </li>
                                                    </>
                                                ) : (
                                                    <>
                                                        <li>
                                                            <Link className="nav-link" to="/user/lmsexam" onClick={(e) => { getnoticeupdate(item.id) }}>
                                                                <b>{item.notice_text}</b>
                                                            </Link>
                                                        </li>
                                                    </>
                                                )

                                        )

                                    ) : (
                                        item.notice_type == 6 ? (
                                            <>
                                                <li>
                                                    <Link className="nav-link" to="/user/teachersubscription">
                                                        {item.notice_text}
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            item.notice_type == 7 ? (
                                                <>
                                                    <li>
                                                        <Link className="nav-link" to={item.slug}>
                                                            {item.notice_text}
                                                        </Link>
                                                    </li>
                                                </>
                                            ) :
                                                item.notice_type == 8 ? (
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
                                                            <Link className="nav-link" to="/user/teachersubscription">
                                                                {item.notice_text}
                                                            </Link>
                                                        </li>
                                                    </>
                                                )

                                        )
                                    )
                                )}

                            </ul>
                        </li>


                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/user/dashboard"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/user/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/user/free-test"
                                    ? "nav-link active"
                                    : "nav-link"
                                    }`}
                                to="/user/free-test"
                            >
                                Test
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`${pathname === "/eshop" ? "nav-link active" : "nav-link"
                                    }`}
                                to="/eshop"
                            >
                                E-shop
                            </Link>
                        </li>
                        <li className="nav-item sign-up">
                            <Link
                                className={`${pathname === "#" ? "nav-link active" : "nav-link"
                                    }`}
                                to="#"
                            >
                                <span>
                                    <i className="fas fa-user"></i>
                                </span>
                               {!!userReduxData && userReduxData.first_name}
                            </Link>
                            <ul className="profile-dropdown">
                                <li>
                                    <Link className="nav-link" to="/user/my-account">
                                        <i className="fas fa-user"></i> My profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/user/subscription">
                                        <i className="fas fa-cog"></i>Subscription
                                    </Link>
                                </li>
                                {/* <li>
                            <Link to="#">
                                <i className="fas fa-envelope"></i>Notifiaction
                            </Link>
                            </li> */}
                                <li>
                                    <Link to="/user/reports">
                                        <i className="fas fa-list"></i>Reports
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsLogout(true);
                                        }}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>Logout
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </>
                )}
            </ul>
            <Signin show={open} closePop={handleCloseModal} />
            <Logout
                show={isLogout}
                yesLogout={handleLogout}
                noLogout={() => setIsLogout(false)}
            />
        </React.Fragment>
    );
};
export default Menu;
