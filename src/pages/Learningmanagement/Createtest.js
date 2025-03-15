import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import {
    GET_COURSES,
    GET_SUBJECTS,
    GET_TOPICS,
    GET_LMS_EXAM_QUESTIONS,
    ATTEMPT_ASSIGNED_TEST,
    LMS_STUDENTS_LIST,
    GET_YEAR
} from "../../components/Api";
import { useDispatch, useSelector } from "react-redux";
import { userAuth, setIsExam } from "../../features/userSlice";
import Question from "../../components/exam/LmsQuestion";
import TestNav from "../../components/exam/testNav";
import Spinner from "../../components/spinner/Spinner";
import Select from "react-select";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import SavedTestLists from "../../components/exam/SavedTestLists";
import { useParams } from "react-router-dom";
import Switch from "react-switch";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";


const Freetest = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [mcq, setMcq] = useState();
    const [theory, setTheory] = useState();
    const [practical, setPractical] = useState();
    const [step, setStep] = useState(1);
    const [testData, setTestData] = useState({ type: 1 });
    const [topics, setTopics] = useState([]);
    const [checkedtopics, setCheckedTopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loader, setLoader] = useState(false);
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
    const [subscription, setSubscription] = useState([]);
    const [student_ids, setCheckedstudents] = useState([]);
    const [subjectyears, setSubjectYears] = useState([]);

    const userData =
        Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
    useEffect(() => {
        getCourses();
        getlmsStudent();
    }, []);

    useEffect(() => {
        testId != undefined && isAssignedTest(testId);
    }, [testId]);

    console.log(testData)

    const getlmsStudent = async () => {
        try {
            setLoader(true);
            const body = {
                teacher_id: userData ? userData.id : false,
                userRole: userData ? userData.affiliate_role : false,
            };
            const {
                data: { message, status, data },
            } = await axios.post(LMS_STUDENTS_LIST, body);
            console.log(data, "data");
            if (status == 200) {
                setLoader(false);
                let SubscriptionData = data?.map((item) => {
                    return { ...item, isChecked: true };
                });
                setSubscription(SubscriptionData);

            } else {
                setLoader(false);
                toast.error(message);
            }
        } catch (error) {
            setLoader(false);
            if (error.response.data.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, please try again.!");
            }
        }
    };

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
    const handleNextStepone = (e) => {
        setLoader(true);
        e.preventDefault();

        if (
            subscription.length <= 0 ||
            subscription.filter((item) => item?.isChecked !== true).length == subscription.length
        ) {
            toast.error("Please select Minimum One Student..!");
            setLoader(false);
        } else {
            setTimeout(() => {
                setLoader(false);
                setStep(step + 1);
            }, 500);
        }
    };
    //validate topics is checked or not  and go to next step
    const handleNextStep = (e) => {
        setLoader(true);
        e.preventDefault();
        if (testData.ExamName == "" || testData.ExamName == undefined) {
            toast.error("Please fill Exam Name..!");
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

        setTimeout(() => {
            setLoader(false);
            setStep(step + 1);
        }, 500);

    };

    //set subject state
    const handleSubjectChange = async (e) => {
        const target = e.target;
        var id = target.value;
        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        if (!isNaN(id)) {
            setTestData({
                ...testData,
                subjectName: target.options[target.selectedIndex].text,
                subject_id: id,
            });
        }

        const body = {
            courseId: parseInt(testData.courseId),
            subjectId: id,
            user_id: !!userId && userId.id,
            type :  testData?.type
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

    const handleExamChange = (event) => {
        const userValue = event.target.value;
        //console.log(userValue);
        if (userValue != '') {
            setTestData({
                ...testData,
                ExamName: userValue,
            });
        }

    };

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
            setCheckedTopics(topics_id);
        });

        let students_id = [];
        subscription.filter((item) => {
            if (item.isChecked == true) {
                students_id.push(item.student_id);
            }
            setCheckedstudents(students_id);
        });

        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        const body = {
            topicsId: topics_id,
            courseId: parseInt(testData.courseId),
            examName: testData.ExamName,
            type: testData.type,
            year: year,
            subjectId: testData.subject_id,
            number_of_question: number_of_question,
            user_id: !!userId && userId.id,
            isExam: whichTest == 1 ? true : false,
            total_question: ave_total_question
        };
        try {
            const {
                data: { data, status, message },
            } = await axios.post(GET_LMS_EXAM_QUESTIONS, body);
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
    const handleYear = (e) => {
        var yearValue = [];
        e.map((item) => yearValue.push(item.value));
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
    const handleCheckedStudents = (e) => {
        const { id, checked, name } = e.target;
        if (name === "all") {
            const updatedCheckedState = subscription.map((item) => {
                return { ...item, isChecked: checked };
            });
            setSubscription(updatedCheckedState);
        } else {
            const updatedCheckedState = subscription.map((item) =>
                item.student_id == id ? { ...item, isChecked: checked } : item
            );
            setSubscription(updatedCheckedState);
        }

    };

    const { isDarkMode } = useContext(ThemeContext);


    const tabScreen = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="category">
                            <h3>Create An Exam</h3>
                        </div>
                        <div className="select-testing">
                            <div className="col-md-12">
                                <div className="row savedTest" >

                                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-white'}`} >
                                        <thead>
                                            <tr>
                                                <td colspan="4">
                                                    <label className="chk-b">
                                                        Select Students
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                subscription.length > 0 &&
                                                                subscription.filter((item) => item?.isChecked !== true)
                                                                    .length < 1
                                                            }
                                                            name="sall"
                                                            onClick={handleCheckedStudents}
                                                        />
                                                        <span className="checkmark" />
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Student Name</th>
                                                <th scope="col">Student Email</th>
                                                <th scope="col">Student Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subscription.length ? (
                                                subscription.map((item, index) => (
                                                    <tr key={index}>
                                                        <th scope="row">
                                                            <input type="checkbox" checked={item?.isChecked || false} value={item.student_id} id={item.student_id} name="student_id" onClick={handleCheckedStudents} /></th>
                                                        <th scope="row"> {item.first_name} {item.last_name}</th>
                                                        <th scope="row"> {item.email} </th>
                                                        <td>
                                                            {item.status == 1 ? (
                                                                <span className="badge-success badge mr-2">
                                                                    Active
                                                                </span>
                                                            ) : (
                                                                <span className="badge-danger badge mr-2">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}>No subscription found..!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="exam-test">
                                {loader && <Spinner />}
                                <a className="common-btn" href="#" onClick={handleNextStepone}>
                                    Next{" "}
                                </a>
                            </div>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="category">
                            <h3>Create An Exam</h3>
                        </div>
                        <div className="select-testing">
                            <div className="select-class">
                                <p>Exam Name</p>
                                <input type="text" name="exam_name" id="courses" onChange={handleExamChange} />
                            </div>
                            <div className="select-class">
                                <p>Select Course</p>
                                <select onChange={handleCourseChange} id="courses">
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
                                <select id="subjects" onChange={handleSubjectChange}>
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
                                <a className="common-btn" href="#" onClick={handleNextStep}>
                                    Next{" "}
                                </a>
                            </div>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="category free-testing-tabs">
                            <TestNav
                                courseName={testData.courseName}
                                subjectName={testData.subjectName}
                                handleEdit={handleEditTest}
                            />
                        </div>

                        <div className="row testing-demo">
                            {(() => {
                                if (mcq == 1) {
                                    return <div className={`text-center col-md-12`}>
                                        <div className="form-group">
                                            <div className="radio-btn-page lms-radio-btn-page">
                                                <label className="cs-radio">
                                                    MCQ
                                                    <input
                                                        type="radio"
                                                        checked={testData.type == 1 ? "checked" : ""}
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
                                } else {

                                }
                            })()}


                        </div>
                        {loader && <Spinner />}

                        <div className="select-testing">
                            <div className="select-class">
                                <p>Select Year</p>
                                <Select
                                    name="year"
                                    isMulti
                                    onChange={handleYear}
                                    options={subjectyears}
                                    className="text-dark"
                                />
                            </div>
                        </div>
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
            // case 4:
            //     return (
            //         <div className="d-flex justify-content-around">

            //             <div>
            //                 <div className="col-6">
            //                     <button
            //                         className="common-btn right"
            //                         href="#"
            //                         onClick={(e) => startTest(e, 0)}
            //                         disabled={loader}
            //                         // style={{ float: show ? "right" : "none" }}
            //                     >
            //                         Study
            //                     </button>
            //                 </div>

            //             </div>

            //             <div>
            //                 <div className="col-6">
            //                     <button
            //                         className="common-btn"
            //                         href="#"
            //                         onClick={(e) => startTest(e, 0)}
            //                         disabled={loader}
            //                         // style={{ float: "none" }}
            //                     >
            //                         Exam
            //                     </button>
            //                 </div>
            //             </div>

            //             {/* <div className="exam-test">
            //                 {loader && <Spinner />}
            //                 <a className="common-btn" href="#" onClick={handleNextStepone}>
            //                     Next{" "}
            //                 </a>
            //             </div> */}

            //         </div>
            //     )
            case 4:
                return (
                    <>
                        <div className="free-testing-tabs">
                            {!usersubscription ? (
                                <TestNav
                                    courseName={testData.courseName}
                                    subjectName={testData.subjectName}
                                    handleEdit={handleEditTest}
                                />
                            ) : (
                                <ul>
                                    <li className="active">
                                        <a href="#">
                                            Course : {testData.courseName && testData.courseName}{" "}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            Subject : {testData.subjectName && testData.subjectName}
                                        </a>
                                        <a href="#" className="edit-button" onClick={handleEditTest}>
                                            <i className="fas fa-pen" />
                                        </a>
                                    </li>
                                    <li className="flag_switch_li">
                                        <Switch
                                            onChange={flagChange}
                                            checked={flagchecked}
                                            className="react-switch"
                                        /> <span className="switch-text"> Flag Questions {flagchecked ? "On" : "Off"}</span> <i className="fas fa-flag fa-sm"></i>
                                    </li>
                                </ul>
                            )}


                            <div className="row">
                                {/* User test or free test */}

                                <div className={`d-flex justify-content-center col-md-${show ? 12 : 6}`}>
                                    <button
                                        className="common-btn right"
                                        href="#"
                                        onClick={(e) => startTest(e, 0)}
                                        disabled={loader}
                                        style={{ float: show ? "none" : "none" }}
                                    >
                                        View Questions
                                    </button>
                                </div>

                                {/* User exam */}
                                {isAuth && show && usersubscription && !flagchecked ? (
                                    <div className={`col-md-${show ? 12 : 6}`}>
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
                                )
                                    :
                                    (
                                        <></>
                                    )
                                }

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

                                                    <span>{item.count}</span>

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
            case 5:
                return <Question questions={questions} student_ids={student_ids} topicsId={checkedtopics} selectyear={year} />;
            default:
                return "foo";
        }
    };

    return (
        <>
            <Header />
            <section className="free-testing-sec">
                <div className="container">
                    <div className="pagination">
                        <span>
                            <Link to={isAuth ? "/lms/dashboard" : "/"} className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                <i className="fas fa-chevron-left" />
                                Create Exam
                            </Link>
                        </span>
                    </div>
                    <div className="row">
                        <div className="col-md-12">{tabScreen()}</div>
                    </div>
                </div>
            </section>
            <Footer />
            {/* < ToastContainer /> */}
        </>
    );
};

export default Freetest;
