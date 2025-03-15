import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";
import { GET_AFFILIATE_REQUEST, GET_MONTHLY_REPORT, GET_COURSES, GET_COURSES_GRAPH, MY_PROFILE, GET_RESET_GRAPH } from "../../components/Api";
import Cookies from "js-cookie";
import { getTestDate } from "../../components/CommonFunction";
import Spinner from "../../components/spinner/Spinner";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import Modal from "react-modal";
import Switch from "react-switch";
import { useDispatch, useSelector } from "react-redux";
import { userProfile, profile } from "../../features/userSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Dashboard = () => {
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [reports, setReports] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [scoreData, setScoreData] = useState([]);
    const [loader, setLoader] = useState(false);
    // const [resetGrapth, setResetGrapth] = useState(false);
    const [goAffiliat, setGoAffiliat] = useState(false);
    const dispatch = useDispatch();
    const userReduxData = useSelector(userProfile).user.profile;
    var isRole =
        !!Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

    // console.log(isRole)

    const config = {
        headers: {
            Authorization: Cookies.get("token"),
        },
    };

    useEffect(() => {
        getReports();
    }, []);

    const getReports = async () => {
        try {
            setLoader(true);
            var user_data = JSON.parse(Cookies.get("user_data"));
            const body = {
                userId: user_data.id,
            };
            const {
                data: { status, data },
            } = await axios.post(GET_MONTHLY_REPORT, body, config);
            if (status === 200) {
                getDate(data);
                setReports(data);
                setLoader(false);
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };

    const getaffiliaterequest = async () => {

        // setGoAffiliat(true)

        // console.log("Hi")

        try {
            setLoader(true);
            var user_data = JSON.parse(Cookies.get("user_data"));
            const body = {
                userId: user_data.id,
            };

            const {
                data: { status, data },
            } = await axios.post(GET_AFFILIATE_REQUEST, body, config);
            // console.log("check data", data)
            if (status === 200) {
                // checkRefferCode()
                setGoAffiliat(true)
                // setGoAffiliat(true);
                // window.location.replace('https://examtice.com/affiliate/dashboard');
            }
        } catch (error) {
            setLoader(false);
            console.log(error);
        }

    };

    // modal Yes button action 
    const handleGoAffiliat = async () => {
        try {
            setLoader(true);
            var user_data = JSON.parse(Cookies.get("user_data"));
            const body = {
                userId: user_data.id,
            };
            const {
                data: { status, data },
            } = await axios.post(GET_AFFILIATE_REQUEST, body, config);

            console.log(data)
            if (status === 200) {
                console.log(data);
                var inTwoMinutes = new Date(
                    new Date().getTime() + 60 * 60 * 24 * 1000 * 7
                ); // 7 days
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                setLoader(false);
                dispatch(profile({ profile: data.user }));
                Cookies.set("user_data", JSON.stringify(data.user), expiryObject);

                window.location.replace('https://www.examtice.com/affiliate/dashboard');
            }
        }
        catch (error) {
            setLoader(false);
            console.log(error);
        }
    }

    const getsupportlogin = async () => {
        try {
            setLoader(true);
            var user_data = JSON.parse(Cookies.get("user_data"));
            window.location.replace('https://examtice.com/support');

        } catch (error) {
            setLoader(false);
            console.log(error);
        }
    };


    const handleCourseChange = async (e) => {
        var id = e.target.value;

        // console.log(id)
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (!isNaN(id)) {
            setLoader(true);
            try {
                setLoader(true);
                var user_data = JSON.parse(Cookies.get("user_data"));
                const body = {
                    courseId: id,
                    userId: user_data.id,
                };
                console.log(body)
                const {
                    data: { status, data },
                } = await axios.post(GET_COURSES_GRAPH, body, config);

                if (status === 200) {
                    getDate(data);
                    setReports(data);
                    setLoader(false);
                }
            } catch (error) {
                setLoader(false);
                console.log(error);
            }
        }
    };

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            setLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_COURSES);
            if (status == 200) {
                setLoader(false);
                setCourses(data);
            }
        } catch (err) {
            setLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    function getDate(data) {
        var dates = [];
        var scores = [];
        data?.userReport
            ?.reverse()
            .map(
                (val, i) => (
                    dates.push(getTestDate(val.created_at)),
                    scores.push(
                        Math.floor((val.totaCorrectOption / val.total_questions) * 100)
                    )
                )
            );
        setReportData(dates);
        setScoreData(scores);
    }


    const state = {
        labels: reportData,
        datasets: [
            {
                label: "Score board",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "#ffff",
                borderWidth: 2,
                data: scoreData,
            },
        ],
    };
    const state2 = {
        labels: reportData,
        datasets: [
            {
                label: "Score board",
                fill: false,
                lineTension: 0.5,
                backgroundColor: "rgba(75,192,192,1)",
                borderColor: "#000",
                borderWidth: 2,
                data: scoreData,
            },
        ],
    };

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        }
    }

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <section className="dashboad-page">
                <div className="container">
                    <div className="row">

                        <div className="col-md-12">
                            <div className="dash-graph">
                                {loader && <Spinner />}
                                <span className="left mb-3">Score of your last 30 days</span>

                                {/* <span className="right ml-4">
                                    <button onClick={handleResetGraph} className="btn btn-danger btn-sm">Reset</button>
                                </span> */}

                                <span className="right mb-3">{reports.totalQues ? reports.totalQues : 0} Questions seen</span>

                                <div className="select-class">
                                    <select onChange={handleCourseChange} id="courses" className="p-1 p-md-1 p-lg-0" style={{ backgroundColor: "#fff" }}>
                                        <option value="0">All Course</option>
                                        {courses &&
                                            courses.map((item, index) => (
                                                <option value={item.id} key={index}>
                                                    {" "}
                                                    {item.name}{" "}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <Line
                                    data={isDarkMode ? state : state2}
                                    width={100}
                                    height={200}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: true,
                                        aspectRatio: 3,
                                        onResize: null,
                                        resizeDelay: 0
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/free-test">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-clipboard-check" />
                                    </span>
                                    <br />
                                    Test
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/reports">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-chart-pie" />
                                    </span>
                                    <br />
                                    Reports
                                </Link>
                            </div>
                        </div>
                        {/* <div className="col-md-3">
                            <div className="dashboad-page-inner">
                                <Link className="dash-panel" to="#">
                                <span className="dash-icon-round">
                                    <i className="fas fa-list" />
                                </span>
                                <br />
                                Questions
                                </Link>
                            </div>
                        </div> */}
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/subscription">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-users-cog" />
                                    </span>
                                    <br />
                                    Subscription
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/search-feedback">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-search" />
                                    </span>
                                    <br />
                                    Search/Feedback Question
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/faq">
                                    <span className="dash-icon-round">
                                        <i className="far fa-question-circle" />
                                    </span>
                                    <br />
                                    FAQ
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/my-account">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-user" />
                                    </span>
                                    <br />
                                    My Account
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/eshop">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-shopping-cart" />
                                    </span>
                                    <br />
                                    Eshop
                                </Link>
                            </div>
                        </div>
                        {/* <div className="col-md-3">
                            <div className="dashboad-page-inner">
                                <Link className="dash-panel" to="#">
                                <span className="dash-icon-round">
                                    <i className="fas fa-envelope" />
                                </span>
                                <br />
                                Messages
                                </Link>
                            </div>
                        </div> */}
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/blog">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-wifi" />
                                    </span>
                                    <br />
                                    News
                                </Link>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/forum">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-comments" />
                                    </span>
                                    <br />
                                    Forum
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/teachersubscription">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-users-cog" />
                                    </span>
                                    <br />
                                    Subscribe Teachers/Parent
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/lmsexam">
                                    <span className="dash-icon-round">
                                        <i className="fas fa-book-reader" />
                                    </span>
                                    <br />
                                    Lms Exam
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/support" >
                                    <span className="dash-icon-round">
                                        <i className="fas fa-sms" />
                                    </span>
                                    <br />
                                    Support
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/downloadApp" >
                                    <span className="dash-icon-round">
                                    <i class="fas fa-solid fa-layer-group"></i>
                                    </span>
                                    <br />
                                    App
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                                <Link className="dash-panel" to="/user/resources" >
                                    <span className="dash-icon-round">
                                    <i class="fas fa-solid fa-clone"></i>
                                    </span>
                                    <br />
                                    Resources
                                </Link>
                            </div>
                        </div>
                        {
                            (isRole.affiliate_role == 5 || isRole.affiliate_role == 6) ?
                                <>

                                </>
                                :
                                <div className="col-md-3">
                                    <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`} onClick={getaffiliaterequest}>
                                        <a className="dash-panel" href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                // setSaveWarning(true);
                                            }}
                                        >
                                            <span className="dash-icon-round">
                                                <i className="fas fa-link" />
                                            </span>
                                            <br />
                                            Affiliate Join
                                        </a>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </section>




            <Modal
                isOpen={goAffiliat}
                //onRequestClose={() => setTestWarning(false)}
                style={customStyles}
                contentLabel="Finish test modal"
                className="logout-modals"
                id="exampleModalLong"
                shouldReturnFocusAfterClose={false}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="payment-sucess">
                                <p>Affilicate Warning</p>
                                <img src="assets/images/warning.png" alt="" />
                                <p>Are you want to a affiliate member?</p>
                                <div className="row">
                                    {/* {saveLoader && <Spinner />} */}
                                    <button
                                        href="#"
                                        onClick={handleGoAffiliat}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setGoAffiliat(false);
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Footer />
        </>
    );
};

export default Dashboard;
