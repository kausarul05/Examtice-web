import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { STUDENT_LMS_EXAM_REPORT } from "../../components/Api";
import { Link } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { useHistory } from "react-router-dom";
import { getTestDate, removeTags } from "../../components/CommonFunction";
import { userAuth } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Comment from "../../components/exam/Comment";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const UserLmsStudentReport = () => {
    const history = useHistory();
    const isAuth = useSelector(userAuth); //using redux useSelector here
    const [result, setResult] = useState([]);
    const [loader, setLoader] = useState(false);
    const { examId } = useParams();
    const { studentsId } = useParams();

    useEffect(() => {
        getTestReport();
        //console.log(examId);
        //console.log(studentsId);
    }, []);

    const getTestReport = async () => {
        if (
            examId == undefined &&
            localStorage.getItem("userTestId") == undefined
        ) {
            //history.push("/lms/subscription");
            //return false;
        }

        try {
            setLoader(true);
            const body = {
                examId: examId ? examId : localStorage.getItem("userTestId"),
                student_id: studentsId
            };
            const {
                data: { result, status },
            } = await axios.post(STUDENT_LMS_EXAM_REPORT, body);
            if (status == 200) {
                setResult(result);
                setLoader(false);
            } else {
                //history.push("/free-test");
            }
        } catch (error) {
            console.log(error);
            //toast.error("Something went wrong, please try again.!");
        }
    };

    // Get correct answer from total question
    const correctCount = () => {
        return result.questionsData?.filter((item) => item?.isCorrect == true)
            .length;
    };

    // If user has right answer
    const getRightOption = (items) => {
        return getOption(items.answer, items);
    };
    // If user has wrong anser
    const getUserOption = (items) => {
        return getOption(items.choosen_option, items);
    };

    // Get options common function
    function getOption(option, items) {
        var rightAnser = "";
        switch (option) {
            case 1:
                rightAnser = items.option_1;
                break;
            case 2:
                rightAnser = items.option_2;
                break;
            case 3:
                rightAnser = items.option_3;
                break;
            case 4:
                rightAnser = items.option_3;
                break;
            default:
                rightAnser = "No Answer";
                break;
        }
        return rightAnser;
    }

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />

            <section className="free-testing-sec">
                <div className="container">
                    {loader ? (
                        <div className="spinner_div" style={{ minHeight: "400px" }}>
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="pagination">
                                <span>
                                    {examId ? (
                                        <Link to="/user/lmsexam" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                            <i className="fas fa-chevron-left" />
                                            Back
                                        </Link>
                                    ) : (
                                        <Link to="/" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                            <i className="fas fa-chevron-left" />
                                            Grade Report
                                        </Link>
                                    )}
                                </span>
                            </div>
                            <div className="frade-timing">
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="grade-left">
                                            <p>
                                                {`${result.courseName
                                                    ? "Course name -" + result.courseName + " | "
                                                    : ""
                                                    }`}
                                                {`${result.subjectName
                                                    ? "Subject name -" + result.subjectName + " | "
                                                    : ""
                                                    }`}
                                                {`${result.type
                                                    ? result.type == 1
                                                        ? "Type - MCQ"
                                                        : "Type - Theory"
                                                    : ""
                                                    }`}
                                            </p>
                                            <p>
                                                {getTestDate(result.created_at)} <span>|</span>
                                                Time spent {result.time_spent} <span>|</span> Correct{" "}
                                                {correctCount()} of {result.total_questions} questions
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="grade-right">
                                            <span>
                                                {Math.floor(
                                                    (correctCount() / result.total_questions) * 100
                                                )}
                                                %
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
                                <div className="col-md-9">
                                    <div className="grade-report-chart">
                                        <Helmet>
                                            <script
                                                src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image&async=true"
                                                type="text/javascript"
                                            />
                                        </Helmet>
                                        <ul>
                                            {result.questionsData?.length > 0 ? (
                                                result.questionsData?.map((item, index) => (
                                                    <li
                                                        className={
                                                            item.isCorrect ? "green-list" : "red-list"
                                                        }
                                                        key={index}
                                                    >
                                                        <div className="chart-left">
                                                            <div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div>
                                                            {/* <p>
                                {removeTags(item.question).length > 60
                                  ? (item.question
                                      .trim()
                                      .substring(0, 60)
                                      .replace(/(&nbsp;|<([^>]+)>)/gi, ""),
                                    +"...")
                                  : item.question
                                      .trim()
                                      .replace(/(&nbsp;|<([^>]+)>)/gi, "")}
                              </p> */}
                                                            {item.answer == item.choosen_option ? (
                                                                <h5 className="green">
                                                                    <span>
                                                                        {" "}
                                                                        <i
                                                                            className="fa fa-check"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                    <div
                                                                        className="post__content"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: getRightOption(item),
                                                                        }}
                                                                    />
                                                                </h5>
                                                            ) : (
                                                                <>
                                                                    <h5 className="green">
                                                                        <span>
                                                                            {" "}
                                                                            <i
                                                                                className="fa fa-check"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                        <div
                                                                            className="post__content"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: getRightOption(item),
                                                                            }}
                                                                        />
                                                                    </h5>
                                                                    <h5 className="red">
                                                                        <span>
                                                                            {" "}
                                                                            <i
                                                                                className="fa fa-check"
                                                                                aria-hidden="true"
                                                                            />
                                                                        </span>
                                                                        <div
                                                                            className="post__content"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: getUserOption(item),
                                                                            }}
                                                                        />
                                                                    </h5>
                                                                </>
                                                            )}
                                                        </div>
                                                        <div className="chart-center">
                                                            <p
                                                                style={{ cursor: "pointer" }}
                                                                data-toggle="modal"
                                                                data-target={`#explanation-${index} `}
                                                            >
                                                                <img src="assets/images/not.png" alt="" />
                                                                Explanation
                                                            </p>

                                                            {/*Expalanation modal  */}
                                                            <div
                                                                className="modal fade bd-example-modal-lg"
                                                                key={index}
                                                                id={`explanation-${index} `}
                                                                tabIndex={-1}
                                                                role="dialog"
                                                                aria-labelledby="exampleModalLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div
                                                                    className="modal-dialog modal-lg"
                                                                    role="document"
                                                                >
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h5
                                                                                className="modal-title"
                                                                                id="exampleModalLabel"
                                                                                style={{ color: 'black' }}
                                                                            >
                                                                                Explanation
                                                                            </h5>
                                                                            <button
                                                                                type="button"
                                                                                className="close"
                                                                                data-dismiss="modal"
                                                                                aria-label="Close"
                                                                            >
                                                                                <span aria-hidden="true">×</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            {
                                                                                item.explanation ? (
                                                                                    <div
                                                                                        className="post__content"
                                                                                        dangerouslySetInnerHTML={{
                                                                                            __html: item.explanation,
                                                                                        }}
                                                                                    ></div>
                                                                                ) : (
                                                                                    <div className="post__content">
                                                                                        <p>No examination found..</p>
                                                                                    </div>
                                                                                )
                                                                                //   <MathJax.Provider>
                                                                                //   <MathJax.Html html={item.explanation} />
                                                                                // </MathJax.Provider>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* modal  */}
                                                        </div>
                                                        <div className="chart-center">
                                                            <p
                                                                style={{ cursor: "pointer" }}
                                                                data-toggle="modal"
                                                                data-target={`#comment-${index} `}
                                                            >
                                                                <img src="assets/images/chat.png" alt="" />
                                                                Comments
                                                            </p>
                                                            {/*Comment modal  */}
                                                            <div
                                                                className="modal fade bd-example-modal-lg"
                                                                key={index}
                                                                id={`comment-${index} `}
                                                                tabIndex={-1}
                                                                role="dialog"
                                                                aria-labelledby="exampleModalLabel"
                                                                aria-hidden="true"
                                                            >
                                                                <div
                                                                    className="modal-dialog modal-lg"
                                                                    role="document"
                                                                >
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h5
                                                                                className="modal-title"
                                                                                id="exampleModalLabel"
                                                                                style={{ color: 'black' }}
                                                                            >
                                                                                Comments
                                                                            </h5>
                                                                            <button
                                                                                type="button"
                                                                                className="close"
                                                                                data-dismiss="modal"
                                                                                aria-label="Close"
                                                                            >
                                                                                <span aria-hidden="true">×</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            {item.comments.length ? (
                                                                                <Comment
                                                                                    comments={item.comments}
                                                                                    questionId={item.id}
                                                                                //commentChange={handleCommentChange}
                                                                                />
                                                                            ) : (
                                                                                <div className="post__content">
                                                                                    <p>No comment found..</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/* modal  */}
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <p>No questions found..!</p>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="free-test-tabing-right free-test-tabing-right_light_color">
                                        <span>Test Details</span>
                                        <ul>
                                            {result &&
                                                result.questionsData?.map((item, index) => (
                                                    <>
                                                        <li
                                                            className={item.isCorrect ? "green" : "red"}
                                                            key={index}
                                                        >
                                                            <a href="#" onClick={(e) => e.preventDefault()}>
                                                                {index + 1}
                                                            </a>
                                                        </li>
                                                    </>
                                                ))}
                                        </ul>
                                        {!examId && (
                                            <div className="cal-btn">
                                                <Link
                                                    to={isAuth ? "/user/free-test" : "/free-test"}
                                                    onClick={() => {
                                                        localStorage.getItem("userTestId") != null &&
                                                            localStorage.removeItem("userTestId");
                                                    }}
                                                >
                                                    Try again
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
};

export default UserLmsStudentReport;
