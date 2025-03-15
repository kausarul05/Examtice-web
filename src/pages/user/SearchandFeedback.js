import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Questiondetails from "../../components/modals/questiondetails";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
    GET_COURSES,
    GET_SUBJECTS,
    GET_TOPICS_LIST,
    SAVE_FEEDBACK_QUESTION,
    SEARCH_QUESTION,
} from "../../components/Api";
import Spinner from "../../components/spinner/Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const SearchandFeedback = () => {
    const dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [subjectssearch, setSubjectssearch] = useState([]);
    const [loader, setLoader] = useState(false);
    const [questionsid, setQuestions] = useState([]);
    const [testData, setTestData] = useState({ type: 1 });
    const [topics, setTopics] = useState([]);
    const [searchquestionlist, setSearchquestionlist] = useState([]);
    const [open, setOpen] = useState(false);
    const [usersubscription, setUserSubscription] = useState([]);
    const [updateForm, setUpdateForm] = useState({
        searchquestion: "",
        user_id: "",
        course_id: "",
        subject_id: "",
        topic_id: "",
        question: "",
        option_1: "",
        option_2: "",
        option_3: "",
        option_4: "",
        answer: "",
        explanation: "",
    });

    useEffect(() => {
        getCourses();
    }, []);

    // Do not copy text 
    const disableContextMenu = (e) => {
      e.preventDefault();
    };

    const disableCopyShortcut = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }
    };

    useEffect(() => {
      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableCopyShortcut);

      return () => {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableCopyShortcut);
      };
    }, []);



    const handleCloseModal = () => {
        setOpen(false);
    };
    const handleModalShow = async (e) => {
        var id = e.target.value;
        setQuestions(id);
        setOpen(true);
    };

    //Get courses on page load
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

    const handleEditChange = (e) => {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value,
        });
    };

    //Get subject based on course change
    const handleCourseChangesearch = async (e) => {
        var id = e.target.value;
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value,
        });
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (!isNaN(id)) {
            setLoader(true);
            setTestData({
                ...testData,
                courseName: e.target.options[e.target.selectedIndex].text,
                courseId: id,
            });
            const body = {
                courseId: id,
                user_id: !!userId && userId.id,
            };
            try {
                const {
                    data: { data, status, mcq, theory, practical, usersubscription, error },
                } = await axios.post(GET_SUBJECTS, body);
                if (status == 200) {
                    setLoader(false);
                    setSubjectssearch(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleCourseChange = async (e) => {
        var id = e.target.value;
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (!isNaN(id)) {
            setLoader(true);
            setTestData({
                ...testData,
                courseName: e.target.options[e.target.selectedIndex].text,
                courseId: id,
            });
            const body = {
                courseId: id,
                user_id: !!userId && userId.id,
            };
            try {
                const {
                    data: { data, status, mcq, theory, practical, usersubscription, error },
                } = await axios.post(GET_SUBJECTS, body);
                if (status == 200) {
                    setLoader(false);
                    setSubjects(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSubjectChange = async (e) => {
        var id = e.target.value;
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (!isNaN(id)) {
            setLoader(true);
            setTestData({
                ...testData,
                subjectName: e.target.options[e.target.selectedIndex].text,
                subjectId: id,
            });
            const body = {
                subjectId: id,
                user_id: !!userId && userId.id,
            };
            try {
                const {
                    data: { data, status, number_of_question, ave_total_question, error },
                } = await axios.post(GET_TOPICS_LIST, body);
                if (status == 200) {
                    setLoader(false);
                    setTopics(data);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleTopicChange = async (e) => {
        var id = e.target.value;
        if (!isNaN(id)) {
            setTestData({
                ...testData,
                topicName: e.target.options[e.target.selectedIndex].text,
                topicId: id,
            });
        }
    };
    const handleFeedbackQuestion = async (e) => {
        try {
            setLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                }
            }
            var userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

            const body = {
                user_id: userId.id,
                course_id: testData.courseId,
                subject_id: testData.subjectId,
                topic_id: testData.topicId,
                question: updateForm.question,
                option_1: updateForm.option_1,
                option_2: updateForm.option_2,
                option_3: updateForm.option_3,
                option_4: updateForm.option_4,
                answer: updateForm.answer,
                explanation: updateForm.explanation,
            };

            const {
                data: { status, data, message },
            } = await axios.post(SAVE_FEEDBACK_QUESTION, body);
            if (status == 200) {
                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                Cookies.set("user_data", JSON.stringify(data), expiryObject);

                setLoader(false);
                toast.success(message);
            } else {
                setLoader(false);
                toast.error(message);

            }
        } catch (err) {
            console.log(err)
            if (err.response?.data?.status == 400) {
                toast.error(err.response?.data?.error_description);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }


    };

    const handleFeedbackQuestion2 = async (e) => {
        try {
            setLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                }
            }
            var userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

            const body = {
                user_id: userId.id,
                type: 2,
                course_id: testData.courseId,
                subject_id: testData.subjectId,
                topic_id: testData.topicId,
                question: updateForm.question,
                explanation: updateForm.explanation,
            };

            const {
                data: { status, data, message },
            } = await axios.post(SAVE_FEEDBACK_QUESTION, body);
            if (status == 200) {
                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                Cookies.set("user_data", JSON.stringify(data), expiryObject);

                setLoader(false);
                toast.success(message);
            } else {
                setLoader(false);
                toast.error(message);

            }
        } catch (err) {
            console.log(err)
            if (err.response?.data?.status == 400) {
                toast.error(err.response?.data?.error_description);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }


    };
    const handleFeedbackQuestion3 = async (e) => {
        try {
            setLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                }
            }
            var userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

            const body = {
                user_id: userId.id,
                type: 3,
                course_id: testData.courseId,
                subject_id: testData.subjectId,
                topic_id: testData.topicId,
                question: updateForm.question,
                explanation: updateForm.explanation,
            };

            const {
                data: { status, data, message },
            } = await axios.post(SAVE_FEEDBACK_QUESTION, body);
            if (status == 200) {
                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                Cookies.set("user_data", JSON.stringify(data), expiryObject);

                setLoader(false);
                toast.success(message);
            } else {
                setLoader(false);
                toast.error(message);

            }
        } catch (err) {
            console.log(err)
            if (err.response?.data?.status == 400) {
                toast.error(err.response?.data?.error_description);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }


    };

    const handlesearchQuestion = async (e) => {
        try {
            setLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                }
            }
            var userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

            const body = {
                user_id: userId.id,
                course_id: updateForm.search_courses_id,
                subject_id: updateForm.search_subject_id,
                type: updateForm.search_type,
                searchq: updateForm.searchquestion,
            };

            // console.log(body)

            const {
                data: { status, data, usersubscription, message },
            } = await axios.post(SEARCH_QUESTION, body);
            if (status == 200) {
                setLoader(false);
                setSearchquestionlist(data);

                if (usersubscription == 0) {
                    toast.error('Subscription not complate yet');
                } else {
                    setUserSubscription(usersubscription);
                }
                //toast.success(message);
            } else {
                setLoader(false);
                toast.error(message);

            }
        } catch (err) {
            // console.log(err)
            if (err.response?.data?.status == 400) {
                toast.error(err.response?.data?.error_description);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }


    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />

            <section className="free-testing-sec">
                <div className="container">
                    <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                        <span>
                            <Link to="/user/dashboard">
                                <i className="fas fa-chevron-left" />
                                Search Question/Feedback Question
                            </Link>
                        </span>
                    </div>
                    <div className="main-body text-dark">
                        <div className="row gutters-sm search-section">
                            <div className="col-md-12">
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <div className="tabbable-line">
                                            <ul className="nav nav-tabs ">
                                                <li>
                                                    <a
                                                        href="#tab_default_1"
                                                        data-toggle="tab"
                                                        className="active"
                                                    >
                                                        Search Question{" "}
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#tab_default_2" data-toggle="tab">
                                                        Feedback Question{" "}
                                                    </a>
                                                </li>
                                            </ul>
                                            <div className="tab-content">
                                                <div className="tab-pane active" id="tab_default_1">
                                                    <div className="row">
                                                        <div className="sign-tab-detail col-md-4">

                                                            <div className="select-class select-testing">
                                                                <p>Select Course</p>
                                                                <select onChange={handleCourseChangesearch} id="search_courses_id" name="search_courses_id">
                                                                    <option value>Select course</option>
                                                                    {courses &&
                                                                        courses.map((item, index) => (
                                                                            <option value={item.id} key={index}>
                                                                                {" "}
                                                                                {item.name}{" "}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="sign-tab-detail col-md-4">
                                                            <div className="select-subject select-testing">
                                                                <p>Select Subject</p>
                                                                <select id="search_subject_id" name="search_subject_id" onChange={handleEditChange}>
                                                                    <option value="">Select subject</option>
                                                                    {subjectssearch &&
                                                                        subjectssearch.map((item, index) => (
                                                                            <option value={item.id} key={index}>
                                                                                {" "}
                                                                                {item.name}{" "}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="sign-tab-detail col-md-4">
                                                            <div className="select-subject select-testing">
                                                                <p>Select Type</p>
                                                                <select id="search_type" name="search_type" onChange={handleEditChange}>
                                                                    <option value="">Select Type</option>
                                                                    <option value="1">Multichoise Question</option>
                                                                    <option value="2">Theory Question</option>
                                                                    <option value="3">Practical Question</option>

                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-9 col-sm-12 text-secondary">
                                                            <div className="select-search">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Search Question"
                                                                    name="searchquestion"
                                                                    value={updateForm.searchquestion}
                                                                    onChange={handleEditChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 col-sm-12">
                                                            <Link
                                                                className="common-btn"
                                                                to="#"
                                                                onClick={handlesearchQuestion}
                                                            >
                                                                Search

                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="row savedTest">
                                                        <div className="col-sm-12">
                                                            <div className="row searchquestionlisting" >
                                                                <h4 className={`${isDarkMode ? 'color_dark' : 'color_dark'}`}>Search Questions</h4>
                                                                <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`} style={{ width: "100%" }}>

                                                                    <thead>
                                                                        <tr>
                                                                            <td style={{ width: "15%" }}>Course Name</td>
                                                                            <td style={{ width: "15%" }}>Subject Name</td>
                                                                            <td style={{ width: "15%" }}>Topic Name</td>
                                                                            <td style={{ width: "30%" }}>Question</td>
                                                                            <td style={{ width: "25%" }}>Action</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {usersubscription && searchquestionlist &&
                                                                            searchquestionlist.map((item, index) => (
                                                                                <tr key={index}>
                                                                                    <td>{item.courseName}</td>
                                                                                    <td>{item.subjectName}</td>
                                                                                    <td>{item.topicName}</td>
                                                                                    <td style={{ maxWidth: "30%" }} className="feedback-question">
                                                                                        <div style={{ maxWidth: "100%", overflow: "auto" }} dangerouslySetInnerHTML={{ __html: item.question }} />
                                                                                    </td>
                                                                                    <td>
                                                                                        <button
                                                                                            className="common-btn"
                                                                                            value={item.id}
                                                                                            onClick={handleModalShow}
                                                                                        >
                                                                                            View
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody>

                                                                    {/* <thead>
                                                                        <tr>
                                                                            <td>Course Name</td>
                                                                            <td>Subject Name</td>
                                                                            <td>Topic Name</td>
                                                                            <td>Question</td>
                                                                            <td>Action</td>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {usersubscription && searchquestionlist &&
                                                                            searchquestionlist.map((item, index) => (
                                                                                <tr>
                                                                                    <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.courseName }}></div></td>
                                                                                    <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.subjectName }}></div></td>
                                                                                    <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.topicName }}></div></td>
                                                                                    <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div></td>
                                                                                    <td>
                                                                                        <button
                                                                                            className="common-btn"
                                                                                            value={item.id}
                                                                                            onClick={handleModalShow}
                                                                                        >
                                                                                            View
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                    </tbody> */}

                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="tab-pane" id="tab_default_2">
                                                    <h4> Feed Back Question </h4>
                                                    <div className="tabbable-line">
                                                        <ul className="nav nav-tabs ">
                                                            <li>
                                                                <a
                                                                    href="#tab_default_mcq" data-toggle="tab"
                                                                    className="active"
                                                                >
                                                                    Multichoise Question
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="#tab_default_theory" data-toggle="tab">
                                                                    Theory Question
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="#tab_default_practical" data-toggle="tab">
                                                                    Practical Question
                                                                </a>
                                                            </li>
                                                        </ul>
                                                        <div className="tab-content">
                                                            <div className="tab-pane active" id="tab_default_mcq">
                                                                <div className="row">
                                                                    <div className="sign-tab-detail col-md-4">

                                                                        <div className="select-class select-testing">
                                                                            <p>Select Course</p>
                                                                            <select onChange={handleCourseChange} id="courses" name="course_id">
                                                                                <option value>Select course</option>
                                                                                {courses &&
                                                                                    courses.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Subject</p>
                                                                            <select id="subjects" name="subject_id" onChange={handleSubjectChange}>
                                                                                <option value="">Select subject</option>
                                                                                {subjects &&
                                                                                    subjects.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Topic</p>
                                                                            <select id="subjects" name="topic_id" onChange={handleTopicChange}>
                                                                                <option value="">Select topic</option>
                                                                                {topics &&
                                                                                    topics.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Question</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="question"
                                                                                value={updateForm.question}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-8">

                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Option 1</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="option_1"
                                                                                value={updateForm.option_1}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Option 2</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="option_2"
                                                                                value={updateForm.option_2}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">

                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Option 3</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="option_3"
                                                                                value={updateForm.option_3}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Option 4</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="option_4"
                                                                                value={updateForm.option_4}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">

                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Answer</p>
                                                                            <select id="subjects" name="answer" onChange={handleEditChange}>
                                                                                <option value="">Select Answer</option>
                                                                                <option value="1">Option 1</option>
                                                                                <option value="2">Option 2</option>
                                                                                <option value="3">Option 3</option>
                                                                                <option value="4">Option 4</option>

                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Explanation</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="explanation"
                                                                                value={updateForm.explanation}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">

                                                                    </div>
                                                                    <div className="">
                                                                        <div className="col-md-12">
                                                                            <div className="select-subject select-testing">
                                                                                {loader && <Spinner />}
                                                                                <button
                                                                                    value="Save Feedback"
                                                                                    className="common-btn"
                                                                                    onClick={handleFeedbackQuestion}
                                                                                    disabled={loader}
                                                                                >
                                                                                    Save Feedback
                                                                                    {loader && "..."}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane" id="tab_default_theory">
                                                                <div className="row">
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-class select-testing">
                                                                            <p>Select Course</p>
                                                                            <select onChange={handleCourseChange} id="courses" name="course_id">
                                                                                <option value>Select course</option>
                                                                                {courses &&
                                                                                    courses.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Subject</p>
                                                                            <select id="subjects" name="subject_id" onChange={handleSubjectChange}>
                                                                                <option value="">Select subject</option>
                                                                                {subjects &&
                                                                                    subjects.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Topic</p>
                                                                            <select id="subjects" name="topic_id" onChange={handleTopicChange}>
                                                                                <option value="">Select topic</option>
                                                                                {topics &&
                                                                                    topics.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Question</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="question"
                                                                                value={updateForm.question}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-8">

                                                                    </div>

                                                                    <div className="sign-tab-detail col-md-6">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Explanation</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="explanation"
                                                                                value={updateForm.explanation}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-6">

                                                                    </div>
                                                                    <div className="">
                                                                        <div className="col-md-12">
                                                                            <div className="select-subject select-testing">
                                                                                {loader && <Spinner />}
                                                                                <button
                                                                                    value="Save Feedback"
                                                                                    className="common-btn"
                                                                                    onClick={handleFeedbackQuestion2}
                                                                                    disabled={loader}
                                                                                >
                                                                                    Save Feedback
                                                                                    {loader && "..."}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="tab-pane" id="tab_default_practical">
                                                                <div className="row">
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-class select-testing">
                                                                            <p>Select Course</p>
                                                                            <select onChange={handleCourseChange} id="courses" name="course_id">
                                                                                <option value>Select course</option>
                                                                                {courses &&
                                                                                    courses.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Subject</p>
                                                                            <select id="subjects" name="subject_id" onChange={handleSubjectChange}>
                                                                                <option value="">Select subject</option>
                                                                                {subjects &&
                                                                                    subjects.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Select Topic</p>
                                                                            <select id="subjects" name="topic_id" onChange={handleTopicChange}>
                                                                                <option value="">Select topic</option>
                                                                                {topics &&
                                                                                    topics.map((item, index) => (
                                                                                        <option value={item.id} key={index}>
                                                                                            {" "}
                                                                                            {item.name}{" "}
                                                                                        </option>
                                                                                    ))}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-4">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Question</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="question"
                                                                                value={updateForm.question}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-8">

                                                                    </div>

                                                                    <div className="sign-tab-detail col-md-6">
                                                                        <div className="select-subject select-testing">
                                                                            <p>Explanation</p>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Question"
                                                                                name="explanation"
                                                                                value={updateForm.explanation}
                                                                                onChange={handleEditChange}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="sign-tab-detail col-md-6">

                                                                    </div>
                                                                    <div className="">
                                                                        <div className="col-md-12">
                                                                            <div className="select-subject select-testing">
                                                                                {loader && <Spinner />}
                                                                                <button
                                                                                    value="Save Feedback"
                                                                                    className="common-btn"
                                                                                    onClick={handleFeedbackQuestion3}
                                                                                    disabled={loader}
                                                                                >
                                                                                    Save Feedback
                                                                                    {loader && "..."}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Questiondetails show={open} questionsid={questionsid} closePop={handleCloseModal} />
            </section>

            <Footer />
        </>
    );
};

export default SearchandFeedback;
