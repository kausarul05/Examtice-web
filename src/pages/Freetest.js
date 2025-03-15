import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_COURSES,
    GET_SUBJECTS,
    GET_TOPICS,
    GET_QUESTIONS,
    ATTEMPT_ASSIGNED_TEST,
    GET_YEAR,
} from "../components/Api";
import { useDispatch, useSelector } from "react-redux";
import { userAuth, setIsExam } from "../features/userSlice";
import Question from "../components/exam/Question";
import TestNav from "../components/exam/testNav";
import Spinner from "../components/spinner/Spinner";
import Select from "react-select";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import SavedTestLists from "../components/exam/SavedTestLists";
import { useParams } from "react-router-dom";
import Switch from "react-switch";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import { GlobalStyles } from "../GlobalStyles/GlobalStyles";
import DarkAndLightMode from "../DarkAndLightMode/DarkAndLightMode";


const Freetest = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [mcq, setMcq] = useState();
    const [theory, setTheory] = useState();
    const [practical, setPractical] = useState();
    const [step, setStep] = useState(1);
    const [testData, setTestData] = useState({ type: 1 });
    const [topics, setTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loader, setLoader] = useState(false);
    const [subjectyears, setSubjectYears] = useState([]);
    const [year, setYear] = useState([]);
    const dispatch = useDispatch();
    const isAuth = useSelector(userAuth); //using redux useSelector here
    const { testId } = useParams(); //Instructor assign test
    const [show, toggleShow] = React.useState(true);
    const [number_of_question, setNumberOfQuestion] = useState([]);
    const [ave_total_question, setaveNumberOfQuestion] = useState([]);
    const [usersubscription, setUserSubscription] = useState([]);
    const [randomchecked, setChecked] = useState(false);
    const [flagchecked, setflagChecked] = useState(false);



    useEffect(() => {
        getCourses();
    }, []);

    useEffect(() => {
        testId != undefined && isAssignedTest(testId);
    }, [testId]);



    const randomChange = nextChecked => {
        setChecked(nextChecked);
    };

    const flagChange = nextChecked => {
        setflagChecked(nextChecked);
    };

    //const userData = useSelector(examData); //using redux useSelector here

    const config = {
        headers: {
            Authorization: Cookies.get("token"),
        },
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

    // Evaluate is testId and userId exist or not
    const isAssignedTest = async (test_id) => {
        try {
            var userData =
                Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
            const body = {
                user_id: !!userData && userData.id,
                test_id: test_id,
            };
            const {
                data: { data, status, message },
            } = await axios.post(ATTEMPT_ASSIGNED_TEST, body, config);
            if (status == 200) {
                if (data.questions.length > 0) {
                    localStorage.setItem("userTestId", data.user_test_id);
                    setQuestions(data);
                    setStep(4);
                } else {
                    toast.error("Oops!, No questions found..!");
                }
            } else {
                toast.error(message);
            }
        } catch (err) {
            toast.error("Something went wrong please try again..!");
        }
    };

    const handleChange = (e) => {
        setTestData({ ...testData, [e.target.name]: e.target.value });
    };



    console.log(testData)

    //Get subject based on course change
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
                    setMcq(mcq);
                    setTheory(theory);
                    setPractical(practical);
                    setUserSubscription(usersubscription);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };


    //validate topics is checked or not  and go to next step
    const handleNextStep = (e) => {

        e.preventDefault(); // Prevent default anchor tag behavior
        const coursesSelect = document.getElementById("courses");
        const subjectsSelect = document.getElementById("subjects");

        if (coursesSelect.value === "Select course") {
            // Check if options are selected
            toast.error("Please select course before proceeding.");
            return; // Don't proceed to the next step
        }
        else if (subjectsSelect.value === "") {
            // Check if options are selected
            toast.error("Please select subject before proceeding.");
            return; // Don't proceed to the next step
        }

        setLoader(true);
        setTimeout(() => {
            setLoader(false);
            setStep(step + 1);
        }, 500);
        //}
    };

    //set subject state
    const handleSubjectChange = async (e) => {
        const target = e.target;
        const id = target.value;
        const userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        
        // Update the subject and possibly the type here
        if (!isNaN(id)) {
            setTestData((prevState) => ({
                ...prevState,
                subjectName: target.options[target.selectedIndex].text,
                subject_id: id,
            }));
        }
        
        const body = {
            courseId: parseInt(testData.courseId),
            subjectId: id,
            user_id: !!userId && userId.id,
            type: testData.type, // Ensure this is correct in the current state
        };
    
        try {
            const {
                data: { data, status, error },
            } = await axios.post(GET_YEAR, body);
            if (status == 200) {
                setSubjectYears(data);
            }
        } catch (err) {
            console.log(err);
        }
    };
// Example to handle type change
const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTestData((prevState) => ({
        ...prevState,
        type: newType, // Update the type here
    }));
};
    console.log(testData.type)

    //On click edit button rest state
    const handleEditTest = (e) => {
        e.preventDefault();
        setTestData({
            type: 1,
        });
        if (step == 3) {
            setStep(step - 2);
        } else {
            setStep(step - 1);
        }
    };

    //Get topics
    const getTopics = async (e) => {
        e.preventDefault();
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (year == "" || year == undefined) {
            toast.error("Please select a year..!");
            return false;
        }
        if (testData.courseName == "" || testData.courseName == undefined) {
            toast.error("Please select any course..!");
            return false;
        }
        if (
            testData.subjectName == "" ||
            testData.subjectName == undefined ||
            testData.subjectName == "Select subject"
        ) {
            toast.error("Please select any subject..!");
            return false;
        }
        setLoader(true);
        const body = {
            subjectId: testData.subject_id,
            type: testData.type,
            year: year,
            user_id: !!userId && userId.id,
            // number_of_question: 6,
        };

        try {
            const {
                data: { data, status, number_of_question, ave_total_question, error },
            } = await axios.post(GET_TOPICS, body);
            if (status == 200) {
                let topicsData = data?.map((item) => {
                    return { ...item, isChecked: true };
                });
                setStep(step + 1);
                setTopics(topicsData);
                setNumberOfQuestion(number_of_question);
                setaveNumberOfQuestion(ave_total_question);
                setLoader(false);
            }
        } catch (err) {
            setLoader(false);
            toast.error("Someting went wrong, please try again..!");
        }
    };

    // console.log(testData)

    //handle topics select
    const handleCheckedTopics = (e) => {
        const { id, checked, name } = e.target;
        if (name === "all") {
            const updatedCheckedState = topics.map((item) => {
                return { ...item, isChecked: checked };
            });
            setTopics(updatedCheckedState);
        } else {
            const updatedCheckedState = topics.map((item) =>
                item.topic_id == id ? { ...item, isChecked: checked } : item
            );
            setTopics(updatedCheckedState);
        }
    };

    //Start test (whichTest 0 = free test and 1 = exam)
    const startTest = async (e, whichTest) => {
        e.preventDefault();
        if (year == "" || year == undefined) {
            toast.error("Please select a year..!");
            return false;
        }
        setLoader(true);
        let topics_id = [];
        topics.filter((item) => {
            if (item.isChecked == true) {
                topics_id.push(item.topic_id);
            }
        });
        if (randomchecked == true) {
            var randomquestion = 1;
        } else {
            var randomquestion = 0;
        }

        if (flagchecked == true) {
            var flagquestion = 1;
        } else {
            var flagquestion = 0;
        }


        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        const body = {
            topicsId: topics_id,
            courseId: parseInt(testData.courseId),
            type: testData.type,
            year: year,
            subjectId: testData.subject_id,
            number_of_question: number_of_question,
            user_id: !!userId && userId.id,
            isExam: whichTest == 1 ? true : false,
            total_question: ave_total_question,
            randomquestion: randomquestion,
            flagquestion: flagquestion
        };
        try {
            const {
                data: { data, status, message },
            } = await axios.post(GET_QUESTIONS, body);
            if (status == 200) {
                if (data && data.questions != undefined && data.questions.length > 0) {
                    localStorage.setItem("userTestId", data.user_test_id);
                    whichTest == 1 && dispatch(setIsExam(true));
                    setQuestions(data);
                    setLoader(false);
                    setStep(step + 1);
                } else {
                    toast.error(message);
                    setLoader(false);
                }
            }
        } catch (err) {
            setLoader(false);
            toast.error("Someting went wrong, please try again..!");
        }
    };

    // Get dynamic years
    const getYears = () => {
        let currentYear = new Date().getFullYear();
        //let endYear = new Date().getFullYear() - 17;
        let endYear = 2006;
        var option = [];
        for (let year = currentYear; year >= endYear; year--) {
            option.push({ value: year, label: year });
        }
        return option;
    };

    // handle on change year
    // const handleYear = (e) => {
    //     var yearValue = [];
    //     e.map((item) => yearValue.push(item.value));
    //     setYear(yearValue);
    // };
    const handleYear = (selectedOptions) => {
        const yearValue = selectedOptions.map((option) => option.value);
        setYear(yearValue);
    };




    // handle resume test
    const handleResumeTest = () => {
        setStep(4);
        console.log(step);
    };

    const availableBadge = () => {
        return (
            <span className="avalablity">
                *Only 10% Is Available <i className="fas fa-info-circle" />
            </span>
        );
    };

    const autoReload = () => {
        // Reload the current page
        window.location.reload();
    };

    useEffect(() => {
        // Add a popstate event listener to detect browser navigation
        const handlePopState = () => {
            // Reload the page when the user navigates back
            window.location.reload();
        };

        window.addEventListener("popstate", handlePopState);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);


    // window.location.reload(false)
    // console.log(testData)


    const { isDarkMode } = useContext(ThemeContext);

    const tabScreen = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        {/* <DarkAndLightMode></DarkAndLightMode> */}
                        <div className="category">
                            <h3>Select Exam Category</h3>
                        </div>
                        <div className="select-testing">
                            <div className="select-class">
                                <p>Select Course</p>
                                <select onChange={handleCourseChange} id="courses" required>
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
                            <div className="select-subject">
                                <p>Select Subject</p>
                                <select id="subjects" onChange={handleSubjectChange} required>
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

                            <div className="exam-test">
                                {loader && <Spinner />}
                                <a href="#" className="common-btn"  onClick={handleNextStep}>
                                    Next
                                </a>
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="category free-testing-tabs">
                            <TestNav
                                courseName={testData.courseName}
                                subjectName={testData.subjectName}
                                handleEdit={handleEditTest}
                            />
                        </div>

                        <div className="row justify-content-center testing-demo">
                            {(() => {
                                if (mcq == 1) {
                                    return <div className={`text-center col-md-2`}>
                                        <div className="form-group">
                                            <div className="radio-btn-page">
                                                <label className="cs-radio">
                                                    MCQ
                                                    <input
                                                        type="radio"
                                                        checked={testData.type == 1}
                                                        name="type"
                                                        value={1}
                                                        onChange={handleChange}
                                                        onClick={() => toggleShow(true)}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>;
                                }
                                return null;
                            })()}

                            {(() => {
                                if (theory == 1) {
                                    return <div className={`col-md-5`}>
                                        <div className="form-group">
                                            <div className="radio-btn-page">
                                                <label className="cs-radio">
                                                    Theory Questions
                                                    <input
                                                        type="radio"
                                                        checked={testData.type == 2}
                                                        name="type"
                                                        value={2}
                                                        onChange={handleChange}
                                                        onClick={() => toggleShow(false)}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>;
                                }
                                return null;
                            })()}

                            {(() => {
                                if (practical == 1) {
                                    return <div className={`col-md-5`}>
                                        <div className="form-group">
                                            <div className="radio-btn-page">
                                                <label className="cs-radio">
                                                    Practical Questions
                                                    <input
                                                        type="radio"
                                                        checked={testData.type == 3}
                                                        name="type"
                                                        value={3}
                                                        onChange={handleChange}
                                                        onClick={() => toggleShow(false)}
                                                    />
                                                    <span className="checkmark" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>;
                                }
                                return null;
                            })()}

                        </div>
                        {loader && <Spinner />}

                        {/* <div className="select-testing">
                            <div className="select-class">
                                <p>Select Year</p>
                                <Select
                                    name="year"
                                    isMulti
                                    onChange={handleYear}
                                    options={subjectyears}
                                    className="year_color"
                                />
                            </div>
                        </div> */}
                        <div className="select-testing">
                            <div className="select-class">
                                <p>Select Year</p>
                                <Select
                                    name="year"
                                    isMulti
                                    onChange={handleYear}
                                    options={subjectyears}
                                    className="year_color"
                                    value={subjectyears.filter(option => year.includes(option.value))}
                                    isOptionDisabled={() => year.length >= 4} // Disable options when 4 are selected
                                />
                            </div>
                        </div>
                        {/*!usersubscription && availableBadge()*/}

                        <div className="demo-test">
                            <button
                                className="common-btn"
                                onClick={getTopics}
                                disabled={loader}
                            >
                                Next{" "}
                            </button>

                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="free-testing-tabs">
                            {!usersubscription && usersubscription ? (
                                <TestNav
                                    courseName={testData.courseName}
                                    subjectName={testData.subjectName}
                                    handleEdit={handleEditTest}
                                />
                            ) : (
                                <>
                                    <ul className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                        <li className="active">
                                            <a href="#">
                                                Course : {testData.courseName && testData.courseName}{" "}
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                Subject : {testData.subjectName && testData.subjectName}
                                            </a>
                                            <a href="#" className="edit-button ml-2" onClick={handleEditTest}>
                                                <i className="fas fa-pen" />
                                            </a>
                                        </li>

                                    </ul>

                                    <ul>
                                        <li className="flag_switch_li flag_switch_position">
                                            <Switch
                                                onChange={flagChange}
                                                checked={flagchecked}
                                                className="react-switch"
                                            />
                                            <span className="switch-text"> BookMark {flagchecked ? "On" : "Off"}</span>
                                            <i className={`fas fa-bookmark ${flagchecked ? 'bookmark-on' : 'bookmark-off'}`}></i>
                                        </li>
                                    </ul>

                                    {isAuth && !flagchecked && (
                                        <div className="free-testing-tabs">
                                            <ul className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                                <li>
                                                    <Switch
                                                        onChange={randomChange}
                                                        checked={randomchecked}
                                                        className="react-switch"
                                                    /> <a href="#" className="switch-text"> Random Questions {randomchecked ? "On" : "Off"}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* {isAuth && !flagchecked && (
                                <div className="free-testing-tabs">
                                    <ul className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                        <li>
                                            <Switch
                                                onChange={randomChange}
                                                checked={randomchecked}
                                                className="react-switch"
                                            /> <a href="#" className="switch-text"> Random Questions {randomchecked ? "On" : "Off"}</a>
                                        </li>
                                    </ul>
                                </div>
                            )} */}


                            {/*!usersubscription && availableBadge()*/}
                            <div className="row">
                                {/* User test or free test */}
                                {isAuth ? (
                                    <>
                                        <div className={show ? "col-6" : "col"}>
                                            <button
                                                className="common-btn right"
                                                href="#"
                                                onClick={(e) => startTest(e, 0)}
                                                disabled={loader}
                                                style={{ float: show ? "right" : "none" }}
                                            >
                                                Study
                                            </button>
                                        </div>

                                    </>
                                ) : (
                                    <>
                                        <div className="col">
                                            <button
                                                className="common-btn right"
                                                href="#"
                                                onClick={(e) => startTest(e, 0)}
                                                disabled={loader}
                                                style={{ float: "none" }}
                                            >
                                                Start Test
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* User exam */}
                                {isAuth && show && !flagchecked && (
                                    <div className="col-6">
                                        <button
                                            className="common-btn left"
                                            href="#"
                                            onClick={(e) => startTest(e, 1)}
                                            disabled={loader}
                                            style={{ float: "left" }}
                                        >
                                            Exam{" "}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {loader && <Spinner />}
                            <table className="lit-table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <label className="chk-b">
                                                Select Topic
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        topics.length > 0 &&
                                                        topics.filter((item) => item?.isChecked !== true)
                                                            .length < 1
                                                    }
                                                    name="all"
                                                    onClick={handleCheckedTopics}
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </td>
                                        <td>Questions (Trail)</td>
                                    </tr>
                                    {topics.length > 0 ? (
                                        topics.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <label className="chk-b">
                                                        {item.topic_name}
                                                        <input
                                                            type="checkbox"
                                                            checked={item?.isChecked || false}
                                                            value={item.topic_id}
                                                            id={item.topic_id}
                                                            name="topics_id"
                                                            onChange={handleCheckedTopics}
                                                        />
                                                        <span className="checkmark" />
                                                    </label>
                                                </td>
                                                <td>
                                                    {!usersubscription ? (
                                                        <span>{item.show}/{item.count}</span>
                                                    ) : (
                                                        <span>
                                                            {!flagchecked ? (
                                                                <b>{item.count}</b>
                                                            ) : (
                                                                <b>{item.topicflagquestions}/{item.count}</b>
                                                            )}
                                                        </span>

                                                    )}

                                                    <i className="fas fa-chevron-down" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>
                                                <label className="chk-b">No topics found</label>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* {topics && topics.length > 5
              
                <a className="see-more" href="#">
                  See More
                </a>
              
              } */}

                        </div>
                    </>
                );
            case 4:
                return <Question questions={questions} />;
            default:
                return "foo";
        }
    };

    // const { isDarkMode } = useContext(ThemeContext);

    const theme = {
        background: isDarkMode ? '#333' : '#fff',
        text: isDarkMode ? '#fff' : '#333',
    };

    return (
        <>
            <GlobalStyles theme={theme} />
            <Header />

            <section className="free-testing-sec">
                <div className="container">
                    <div className="pagination">
                        <span onClick={autoReload} className={`${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                            <Link to={isAuth ? "/user/dashboard" : "/"}>
                                <i className="fas fa-chevron-left" />
                                TEST SETTING
                            </Link>
                        </span>
                    </div>

                    <div className="row">
                        <div className="col-md-12">{tabScreen()}</div>
                    </div>
                    {step != 4 && isAuth && (
                        <SavedTestLists resumeTest={handleResumeTest} />
                    )}
                </div>
            </section>
            <Footer />
            {/* < ToastContainer /> */}
        </>
    );
};

export default Freetest;
