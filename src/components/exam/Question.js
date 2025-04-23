import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    FLAG_QUESTION,
    BOOKMARK_QUESTION,
    QUESTION_COMMENT,
    SAVE_NOTE,
    SAVE_QUESTIONS,
    SAVE_TIME,
    SAVE_USER_TEST,
    UNFLAG_QUESTION,
    UNBOOKMARK_QUESTION,
} from "../Api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useIdleTimer } from 'react-idle-timer';
import { userAuth, isTestStart, getIsExam, setIsExam } from "../../features/userSlice";
import QuestionCount from "./questionsCount";
import { Link, useHistory } from "react-router-dom";
import Modal from "react-modal";
import Spinner from "../spinner/Spinner";
import Cookies from "js-cookie";
import Comment from "./Comment";
import Statistics from "./statistics";
import { useStopwatch } from "react-timer-hook";
import ExamTimer from "./examTimer";
import TestTimer from "./testTimer";
import MathJax from "mathjax3-react";
import { Helmet } from "react-helmet";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";


const Question = ({ questions }) => {
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [questionsData, setQuestionsData] = useState([]);
    const [finishWarning, setFinishWarning] = useState(false);
    const [cancelWarning, setCancelWarning] = useState(false);
    const [flagWarning, setFlagWarning] = useState(false);
    const [bookmarkWarning, setBookmarkWarning] = useState(false);
    const [radioOption, setRadioValue] = useState(false);
    const [radioInnerValue, setRadioInner] = useState(2);
    const [selectedQuestionId, setQuestionId] = useState(null);
    const [otherOption, setOtherOption] = useState(null);
    const [commentLoader, setCommentLoader] = useState(false);
    const [saveWarning, setSaveWarning] = useState(false);
    const [notAnswer, setNotAnswer] = useState("");
    const [comment, setComment] = useState("");
    const [note, setNote] = useState({});
    const [loader, setLoader] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const [answerLoader, setAnswerLoader] = useState(false);
    const [noteLoader, setNoteLoader] = useState(false);
    const [timer, setTimer] = useState({});
    const dispatch = useDispatch();
    const isAuth = useSelector(userAuth); //using redux useSelector here
    const isExam = useSelector(getIsExam);
    const { seconds, minutes, hours } = useStopwatch({
        autoStart: true
    });


    useEffect(() => {
        setQuestionsData(questions.questions);
        dispatch(isTestStart(true));
    }, []);

    // console.log(questionsData)

    //   useEffect(() => {
    //     if (isTestStart) {
    //       console.log("teasdeas start")
    //       blockRoutes();

    //       return () => {
    //         blockRoutes();
    //       };
    //         // window.onbeforeunload = function() {
    //         //     alert("yo");
    //         //     return true;
    //         // };
    //     }
    //     // return () => {
    //     //     window.onbeforeunload = null;
    //     // };
    // }, [isTestStart]);

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };
    Modal.setAppElement("#root");

    // block routes if user attemept test
    // const blockRoutes = history.block((location, action) => {
    //   return false;
    // });

    // Unblock routes if user attemept test
    // const unBlockRoutes = history.block((location, action) => {
    //   return true;
    // });
    // increment progeress bar count

    // Do not copy text 
    // const disableContextMenu = (e) => {
    //     e.preventDefault();
    // };

    // const disableCopyShortcut = (e) => {
    //     if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
    //         e.preventDefault();
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('contextmenu', disableContextMenu);
    //     document.addEventListener('keydown', disableCopyShortcut);

    //     return () => {
    //         document.removeEventListener('contextmenu', disableContextMenu);
    //         document.removeEventListener('keydown', disableCopyShortcut);
    //     };
    // }, []);




    const progressStatus = {
        width:
            Math.floor((getUserQuestionsAttempt() / questionsData.length) * 100) +
            "%",
    };
    // Handle user answer
    const handleAnswer = async (quesId, choosenAnswer) => {
        var testId = localStorage.getItem("userTestId");
        if (testId == null) {
            toast.error("Something went wrong, Kindly restart your test..!");
            return false;
        }
        const bodyParameter = {
            testId: testId,
            question_id: quesId,
            choosen_option: choosenAnswer,
        };
        try {
            setAnswerLoader(true);
            const isAttemptQuestionState = questionsData.map((item) =>
                item.id === quesId
                    ? {
                        ...item,
                        isAttempt: true,
                    }
                    : item
            );
            setQuestionsData(isAttemptQuestionState);
            const {
                data: { result, status, error },
            } = await axios.post(SAVE_QUESTIONS, bodyParameter);
            if (status == 200) {
                const updateQuestionState = questionsData.map((item) =>
                    item.id === quesId
                        ? {
                            ...item,
                            isAttempt: true,
                            rightOption: result.rightOption,
                            userOption: choosenAnswer,
                            isCorrect: result.rightOption == choosenAnswer ? true : false,
                        }
                        : item
                );
                setQuestionsData(updateQuestionState);
                setAnswerLoader(false);
                if (isExam) {
                    setTimeout(() => {
                        if (step !== questionsData.length) {
                            setStep(step + 1);
                        }
                    }, 500);
                } else {
                    if (choosenAnswer == result.rightOption) {
                        setTimeout(() => {
                            if (step !== questionsData.length) {
                                setStep(step + 1);
                            }
                        }, 500);
                    }
                }
            }
        } catch (err) {
            toast.error("Something went wrong, please try again..!");
            setAnswerLoader(false);
            console.log(err);
        }
    };

    //If user finish the test
    const handleFinishTest = (e) => {
        e.preventDefault();
        var userNotAttempted = getUserQuestionsNotAttempt();
        setNotAnswer(userNotAttempted);
        var time = isExam ? [hours, minutes, seconds] : [timer.hours, timer.minutes, timer.seconds];
        // console.log(time.join(":"))
        if (userNotAttempted > 0) {
            setFinishWarning(true);
        }
        else {
            saveTestTime(time.join(":"));
            dispatch(isTestStart(false));
        }
    };

    const handleConfirmButton = async (e) => {
        e.preventDefault()

        var time = isExam ? [hours, minutes, seconds] : [timer.hours, timer.minutes, timer.seconds];

        saveTestTime(time.join(":"));

    }

    //Get how many questions user not attempt
    function getUserQuestionsNotAttempt() {
        return questionsData.filter((item) => item?.isAttempt !== true).length;
    }

    //Get how many questions user attempt
    function getUserQuestionsAttempt() {
        return questionsData.filter((item) => item?.isAttempt == true).length;
    }

    //Save test spent time
    const saveTestTime = async (time) => {
        try {
            setLoader(true);
            var testId = localStorage.getItem("userTestId");
            var userData = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
            const {
                data: { status, message },
            } = await axios.post(SAVE_TIME, { testId: testId, spentTime: time, userId: userData && userData.id });
            if (status == 200) {
                setTimeout(() => {
                    {
                        isAuth
                            ? history.push("/user/free-test/report")
                            : history.push("/free-test/report");
                    }
                }, 200);
                setTimeout(() => {
                    dispatch(setIsExam(false));
                }, 500);
            }
        }
        catch (err) {
            toast.error("Something went wrong, please try again..!");
            setLoader(false);
        }
    };

    const handleTime = (time) => {
        setTimer(time);
    };

    const handleExpieTime = (time) => {
        var tempTime = [hours, minutes, seconds];
        saveTestTime(tempTime.join(":"));
        dispatch(isTestStart(false));
    }

    // Dispay time
    const myTimer = () => {
        return isExam ? (
            <ExamTimer expiryTime={questions.expiryTime} getTime={handleTime} onExpireTime={handleExpieTime} />
        ) : (
            <TestTimer getTime={handleTime} />
        );
    };

    //If user cancel the test
    const handleCancelTest = (e) => {
        e.preventDefault();
        //handleTime();
        setCancelWarning(true);
    };


    // Radio option flag
    const handlerRadio = (option) => {
        setRadioInner(option);
        !!option && option == 3 ? setRadioValue(true) : setRadioValue(false);

    }

    // handle jump to question
    const handleJumpQuestion = (index) => {
        setStep(index + 1);

    };

    // Handle user cancel the test
    const handleUserCancelTest = (e) => {
        e.preventDefault();
        localStorage.removeItem("userTestId");
        dispatch(isTestStart(false));
        setTimeout(() => {
            {
                isAuth ? history.push("/user/dashboard") :
                    history.push("/");
            }
        }, 300);
        setTimeout(() => {
            dispatch(setIsExam(false));
        }, 500);
    };


    // handleUserCommnet
    const handleUserCommnet = async (e) => {
        e.preventDefault();
        console.log("Comment")
        if (comment == "") {
            toast.error("Please write your comment");
            return false;
        }

        try {
            //setCommentLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var bodyParameters = {
                user_id: userData.id,
                question_id: e.target.getAttribute("questionid"),
                comment: comment,
            };
            const {
                data: { data, status },
            } = await axios.post(QUESTION_COMMENT, bodyParameters, config);
            if (status == 200) {
                // var tempData = [...questionsData];
                // tempData.filter(
                //     (ques) =>
                //         ques.id == e.target.getAttribute("questionid") &&
                //         ques.comments.unshift(data)
                // );
                var tempData = questionsData.map((ques) => {
                    if (ques.id == e.target.getAttribute("questionid")) {
                        const updatedComments = Array.isArray(ques.comments) ? ques.comments : [];
                        return {
                            ...ques,
                            comments: [data, ...updatedComments], // Use spread operator to add the new comment at the beginning
                        };
                    }
                    return ques;
                });
                setQuestionsData(tempData);
                setCommentLoader(false);
                setComment("");
            }
        } catch (err) {
            console.log(err);
            setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    // change question comment state if user delete it
    const handleCommentChange = useCallback((commentId, questionId) => {
        const newState = [...questionsData];
        let updatedComments = newState.map((item) => {
            if (item.id == questionId) {
                return {
                    ...item,
                    comments: item.comments.filter((comm) => comm.id != commentId),
                };
            }
            return item;
        });
        setQuestionsData(updatedComments);
    });

    // save test
    const handleUserSaveTest = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            setSaveLoader(true);
            var testId = localStorage.getItem("userTestId");
            var time = [timer.hours, timer.minutes, timer.seconds];
            const {
                data: { status, message },
            } = await axios.post(
                SAVE_USER_TEST,
                { testId: testId, spentTime: time.join(":") },
                config
            );
            if (status == 200) {
                dispatch(isTestStart(false));
                setSaveLoader(false);
                setTimeout(() => {
                    history.push("/user/dashboard");
                }, 200);
            }
        } catch (err) {
            toast.error("Something went wrong, please try again..!");
            setSaveLoader(false);
            console.log(err);
        }
    };
    const handleUserSaveTestauto = async (e) => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            setSaveLoader(true);
            var testId = localStorage.getItem("userTestId");
            var time = [timer.hours, timer.minutes, timer.seconds];
            const {
                data: { status, message },
            } = await axios.post(
                SAVE_USER_TEST,
                { testId: testId, spentTime: time.join(":") },
                config
            );
            if (status == 200) {
                dispatch(isTestStart(false));
                setSaveLoader(false);
                setTimeout(() => {
                    history.push("/user/dashboard");
                }, 200);
            }
        } catch (err) {
            toast.error("Something went wrong, please try again..!");
            setSaveLoader(false);
            console.log(err);
        }
    };

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 29,
        onIdle: handleUserSaveTestauto,
        debounce: 500
    });

    // Save user notes
    const handleUserNotes = async (e, questionId) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var body = {
                user_id: userData.id,
                question_id: questionId,
                note: note,
            };
            setNoteLoader(true);
            const {
                data: { status, message },
            } = await axios.post(SAVE_NOTE, body, config);
            if (status == 200) {
                setNoteLoader(false);
                handleNoteChange(questionId, note);
                toast.success(message);
                setNote("");
            } else {
                setNoteLoader(false);
                toast.error(message);
            }
        } catch (err) {
            toast.error("Something went wrong, please try again..!");
            setNoteLoader(false);
            console.log(err);
        }
    };

    const handleNoteChange = (questionId, note) => {
        var tempData = [...questionsData];
        tempData.filter(
            (ques) => ques.id == questionId && ques.notes.unshift(note)
        );
        setQuestionsData(tempData);
    };


    // Handle user flag the test
    const handleUserFlagTest = async (e) => {
        e.preventDefault();

        try {
            //setCommentLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var bodyParameters = {
                user_id: userData.id,
                question_id: selectedQuestionId,
                flag_option: radioInnerValue,
                flag_option_text: !!radioInnerValue && radioInnerValue == 1 ? 'its Spam' : radioInnerValue == 2 ? 'Wrong Q/A' : otherOption
            };
            const {
                data: { data, status },
            } = await axios.post(FLAG_QUESTION, bodyParameters, config);
            if (status == 200) {

                // Pushing element to the arrray of object with previous object 
                var tempData = questionsData.map((el) =>
                    el.id === selectedQuestionId ? {
                        ...el, isFlag: true
                    } : el
                )
                // Set the new array 
                setQuestionsData(tempData);
                setFlagWarning(false);
            }
        } catch (err) {
            console.log(err);
            // setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };
    const handleUserUnFlagTest = async (e, QuestionId) => {
        e.preventDefault();

        try {
            //setCommentLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var bodyParameters = {
                user_id: userData.id,
                question_id: QuestionId,
                flag_option: radioInnerValue,
                flag_option_text: !!radioInnerValue && radioInnerValue == 1 ? 'its Spam' : radioInnerValue == 2 ? 'Wrong Q/A' : otherOption
            };
            const {
                data: { data, status, message },
            } = await axios.post(UNFLAG_QUESTION, bodyParameters, config);
            if (status == 200) {

                // Pushing element to the arrray of object with previous object 
                var tempData = questionsData.map((el) =>
                    el.id === selectedQuestionId ? {
                        ...el, isFlag: false
                    } : el
                )
                // Set the new array 
                setQuestionsData(tempData);
                setFlagWarning(false);
                toast.success(message);
            }
        } catch (err) {
            console.log(err);
            // setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };


    const handleFlag = (questionId) => {
        setFlagWarning(true);
        setQuestionId(questionId);
    };


    const handleUserBookmark = async (d) => {
        d.preventDefault();

        try {
            //setCommentLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var bodyParameters = {
                user_id: userData.id,
                question_id: selectedQuestionId,
                flag_option: radioInnerValue,
                flag_option_text: !!radioInnerValue && radioInnerValue == 1 ? 'its Spam' : radioInnerValue == 2 ? 'Wrong Q/A' : otherOption
            };
            const {
                data: { data, status },
            } = await axios.post(BOOKMARK_QUESTION, bodyParameters, config);
            if (status == 200) {

                // Pushing element to the arrray of object with previous object 
                var tempData = questionsData.map((dl) =>
                    dl.id === selectedQuestionId ? {
                        ...dl, isBookMark: true
                    } : dl
                )
                // console.log(isbookmark);
                // Set the new array 
                setQuestionsData(tempData);
                setBookmarkWarning(false);
            }
        } catch (err) {
            console.log(err);
            // setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };
    const handleUserUnBookmark = async (d, QuestionId) => {
        d.preventDefault();

        try {
            //setCommentLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            var userData = JSON.parse(Cookies.get("user_data"));
            var bodyParameters = {
                user_id: userData.id,
                question_id: QuestionId,
                flag_option: radioInnerValue,
                flag_option_text: !!radioInnerValue && radioInnerValue == 1 ? 'its Spam' : radioInnerValue == 2 ? 'Wrong Q/A' : otherOption
            };
            const {
                data: { data, status, message },
            } = await axios.post(UNBOOKMARK_QUESTION, bodyParameters, config);
            if (status == 200) {

                // Pushing element to the arrray of object with previous object 
                var tempData = questionsData.map((dl) =>
                    dl.id === selectedQuestionId ? {
                        ...dl, isBookMark: false
                    } : dl
                )
                // Set the new array 
                setQuestionsData(tempData);
                setBookmarkWarning(false);
                toast.success(message);
            }
        } catch (err) {
            console.log(err);
            // setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };


    const handleBookmark = (questionId) => {
        setBookmarkWarning(true);
        setQuestionId(questionId);
    };

    const handleNote = (e, questionId, value) => {
        e.preventDefault();
        setNote({ ...note, questionId: questionId, note: value });
    };

    // console.log(questionsData.map(question => question.question_description))

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <div className="row short-container timer-selection">
                <div className="col-md-8 col-lg-9">
                    {loader && <Spinner />}
                    {questionsData.map((item, index) => (
                        <div
                            className={`free-test-tabing-left ${step && step == index + 1 ? "active_qa" : "hide_qa"
                                } `}
                            key={index}
                        >

                            <div className="row">

                                <div className="col-lg-4 col-7 col-md-7 quesnumber-box timer">

                                    <h5>
                                        {step > 1 && (
                                            <i
                                                className="fas fa-chevron-left pointer"
                                                onClick={() => setStep(step - 1)}
                                            />
                                        )}
                                        Q {index + 1} / {questionsData.length}{" "}
                                        {isAuth && item.isBookMark == true && !isExam ? <i className="fas fa-bookmark fa-sm booked-icon question-bookmark-mobile-view" onClick={(d) => handleUserUnBookmark(d, item.id)} title="Already Bookmark this question"></i> : isAuth && !isExam ? <i className="fas fa-bookmark fa-sm question-bookmark-mobile-view" onClick={(d) => handleBookmark(item.id)}></i> : ''}

                                        {isAuth && item.isFlag == true ? <i className="fas fa-flag fa-sm flaged-icon question-bookmark-mobile-view" onClick={(e) => handleUserUnFlagTest(e, item.id)} title="Already flagged this question"></i> : isAuth && item.isFlag == false ? <i className="fas fa-flag fa-sm question-bookmark-mobile-view" onClick={(e) => handleFlag(item.id)}></i> : <i className="fas fa-flag fa-sm question-bookmark-mobile-view" onClick={(e) => handleFlag(item.id)}></i>}

                                    </h5>
                                </div>

                                <div className="col-lg-4 col-12 col-md-12 order-first order-md-first order-lg-last timer">
                                    <button className="common-btn name-id-year">
                                        {item.year}, {item.name}, Ref: {item.id}
                                    </button>
                                    <h5 id="right-arrow-withref">
                                        {step !== questionsData.length && (
                                            <i
                                                className="fas fa-chevron-right pointer"
                                                onClick={() => setStep(step + 1)}
                                            />
                                        )}
                                    </h5>
                                </div>

                                <div className="col-lg-4 col-5 col-md-5 timerr-inner timer-box">
                                    {/* display timer */}
                                    {myTimer()}
                                    <h5 id="right-arrow-withoutref">
                                        {step !== questionsData.length && (
                                            <i
                                                className="fas fa-chevron-right pointer"
                                                onClick={() => setStep(step + 1)}
                                            />
                                        )}
                                    </h5>
                                </div>
                            </div>
                            <div className="free-test-tabing-left-bar">
                                <span style={progressStatus}></span>
                            </div>
                            <div className="tabing-inner-page">
                                <ul className="nav nav-pills">
                                    <li className="active">
                                        <a
                                            className="active"
                                            data-toggle="pill"
                                            href={`#home_${index + 1}`}
                                        >
                                            <i className="fas fa-play fa-sm"></i> Question
                                        </a>
                                    </li>

                                    <li className="active">
                                        <a
                                            // className="active"
                                            data-toggle="pill"
                                            href={`#description_${index + 1}`}
                                        >
                                            <i class="fas fa-solid fa-info fa-sm"></i> Excerpt
                                        </a>
                                    </li>

                                    {!isExam && (
                                        <li>
                                            <a
                                                data-toggle="pill"
                                                href={`#explanation_${index + 1}`}
                                            >
                                                <i className="fas fa-newspaper fa-sm"></i> Explanation
                                            </a>
                                        </li>

                                    )}

                                    <li>
                                        <a data-toggle="pill" href={`#statistics${index + 1}`}>
                                            <i className="fas fa-chart-pie fa-sm"></i> Statistics
                                        </a>
                                    </li>
                                    <li style={{ position: "relative" }}>
                                        <a data-toggle="pill" href={`#comment_${index + 1}`}>
                                            {item?.comments?.length > 0 && (
                                                <span className="commentCount">
                                                    {" "}
                                                    {item?.comments?.length}
                                                </span>
                                            )}
                                            <i className="fas fa-comments fa-sm"></i> Comments
                                        </a>
                                    </li>
                                    {item.question_description_show > 0 && (
                                        <li className="eassy_description_li">
                                            <a data-toggle="pill" href={`#question_description_${index + 1}`}>
                                                <i className="fas fa-file-alt fa-sm"></i> Essay/Description
                                            </a>
                                        </li>
                                    )}
                                    {/* <li>
                    <a data-toggle="pill" href={`#save_${index + 1}`}>
                      <i className="fas fa-sticky-note fa-sm"></i>{" "}

                      Notes
                    </a>
                  </li> */}
                                </ul>
                                <div className="tab-content">
                                    <div
                                        id={`home_${index + 1}`}
                                        className="tab-pane fade in active show"
                                    >
                                        <Helmet>
                                            <script
                                                src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image&async=true"
                                                type="text/javascript"
                                            />
                                        </Helmet>

                                        <div className={`post__content ${isDarkMode ? 'color_light' : 'color_dark'}`} dangerouslySetInnerHTML={{ __html: item.question }}></div>
                                        {/* <div className="post__content" >
                    <MathJax.Provider>
                      <MathJax.Html html={!!item.question && item.question } style={{color:'#fff'}}/>
                    </MathJax.Provider>
                    </div> */}
                                        {/* <h3>{item.question.replace(/<[^>]+>/g, "")}</h3> */}
                                        {answerLoader && <Spinner />}

                                        {(() => {
                                            if (item.type == 1) {

                                                return <ul>
                                                    <button
                                                        className={`${!isExam
                                                            ? item.rightOption == 1
                                                                ? "green"
                                                                : item?.userOption !== item.rightOption &&
                                                                    item.userOption == 1
                                                                    ? "red"
                                                                    : ""
                                                            : item.isAttempt && item.userOption == 1
                                                                ? "exam"
                                                                : ""
                                                            }`}
                                                        onClick={() => handleAnswer(item.id, 1)}
                                                        disabled={(isExam) ? "" : item.isAttempt}
                                                    >
                                                        <span>A</span>
                                                        <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_1 }} />
                                                    </button>
                                                    <button
                                                        className={`${!isExam
                                                            ? item.rightOption == 2
                                                                ? "green"
                                                                : item?.userOption !== item.rightOption &&
                                                                    item.userOption == 2
                                                                    ? "red"
                                                                    : ""
                                                            : item.isAttempt && item.userOption == 2
                                                                ? "exam"
                                                                : ""
                                                            }`}
                                                        onClick={() => handleAnswer(item.id, 2)}

                                                        disabled={(isExam) ? "" : item.isAttempt}
                                                    >
                                                        <span>B</span>
                                                        <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_2 }} />
                                                    </button>
                                                    <button
                                                        className={`${!isExam
                                                            ? item.rightOption == 3
                                                                ? "green"
                                                                : item?.userOption !== item.rightOption &&
                                                                    item.userOption == 3
                                                                    ? "red"
                                                                    : ""
                                                            : item.isAttempt && item.userOption == 3
                                                                ? "exam"
                                                                : ""
                                                            }`}
                                                        onClick={() => handleAnswer(item.id, 3)}

                                                        disabled={(isExam) ? "" : item.isAttempt}
                                                    >
                                                        <span>C</span>
                                                        <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_3 }} />
                                                    </button>
                                                    {(() => {
                                                        if (item.option_4 == '' || item.option_4 == null) {

                                                        } else {
                                                            return <button
                                                                className={`${!isExam
                                                                    ? item.rightOption == 4
                                                                        ? "green"
                                                                        : item?.userOption !== item.rightOption &&
                                                                            item.userOption == 4
                                                                            ? "red"
                                                                            : ""
                                                                    : item.isAttempt && item.userOption == 4
                                                                        ? "exam"
                                                                        : ""
                                                                    }`}
                                                                onClick={() => handleAnswer(item.id, 4)}

                                                                disabled={(isExam) ? "" : item.isAttempt}
                                                            >
                                                                <span>D</span>
                                                                <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_4 }} />
                                                            </button>
                                                        }

                                                    })()}



                                                </ul>
                                            } else {
                                                return <button className="common-btn"
                                                    onClick={() => handleAnswer(item.id, 1)}
                                                    disabled={item.isAttempt}
                                                    to="/">
                                                    Next
                                                </button>
                                            }
                                        })()}
                                    </div>

                                    <div id={`explanation_${index + 1}`}
                                        className="tab-pane fade explanation">

                                        <div className="explanation_color">
                                            <div className="pagination_freetest"><span><a>Question:</a></span></div>
                                            <div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div>
                                        </div>

                                        <div className="pagination_freetest"><span><a>Explanation:</a></span></div>
                                        <span className="explanation_color">{item.explanation &&
                                            <div className="post__explanation" dangerouslySetInnerHTML={{ __html: item.explanation }}></div>
                                            // <MathJax.Provider>
                                            //   <MathJax.Html html={item.explanation} style={{color:"#fff"}}/>
                                            // </MathJax.Provider>
                                        }</span>
                                    </div>

                                    <div id={`description_${index + 1}`}
                                        className="tab-pane fade explanation">

                                        <div className="pagination_freetest"><span><a>Description:</a></span></div>
                                        <div className="post__content" dangerouslySetInnerHTML={{ __html: item.question_description }}></div>

                                        {/* <div className="pagination_freetest"><span><a>Description:</a></span></div> */}
                                        <span className="explanation_color">{item.explanation &&
                                            <div className="post__explanation" dangerouslySetInnerHTML={{ __html: item.question_description }}></div>
                                            // <MathJax.Provider>
                                            //   <MathJax.Html html={item.explanation} style={{color:"#fff"}}/>
                                            // </MathJax.Provider>
                                        }</span>
                                    </div>

                                    <div
                                        id={`statistics${index + 1}`}
                                        className="tab-pane fade explanation"
                                    >
                                        <p>Statistics</p>
                                        <Statistics stats={item.statistics} type={item.type} />
                                    </div>
                                    <div
                                        id={`comment_${index + 1}`}
                                        className="tab-pane fade"
                                    >
                                        <h3>User comments</h3>
                                        {item?.comments?.length && (
                                            <Comment
                                                comments={item.comments}
                                                questionId={item.id}
                                                commentChange={handleCommentChange}
                                            />
                                        )}
                                        {isAuth && (
                                            <form>
                                                <div className="form-group">
                                                    <textarea
                                                        placeholder="Comment"
                                                        readOnly={!isAuth}
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <button
                                                        onClick={handleUserCommnet}
                                                        disabled={commentLoader}
                                                        questionId={item.id}
                                                    >
                                                        Post comment
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                    <div
                                        id={`question_description_${index + 1}`}
                                        className="tab-pane fade question_description"
                                    >

                                        {item.question_description &&
                                            <div className="post__question_description" dangerouslySetInnerHTML={{ __html: item.question_description }}></div>
                                            // <MathJax.Provider>
                                            //   <MathJax.Html html={item.explanation} style={{color:"#fff"}}/>
                                            // </MathJax.Provider>
                                        }
                                    </div>
                                    <div id={`save_${index + 1}`} className="tab-pane fade">
                                        <h3>
                                            Your Personal Note{" "}
                                            <span>(Not Visible to others)</span>
                                        </h3>
                                        {item.notes && Object.keys(item.notes).length > 0 && (
                                            <div
                                                className="card mb-3 main_forum_container_body"
                                                key={index}
                                            >
                                                <div className="row no-gutters align-items-center m-2">
                                                    <div className="col">{item.notes.note}</div>
                                                    <div className="col">
                                                        <button
                                                            className="float-right"
                                                            title="Edit note"
                                                            style={{ cursor: "pointer", border: "none" }}
                                                        // onClick={(e) => deleteComment(e, item.id)}
                                                        >
                                                            <i
                                                                className="fas fa-pencil-alt"
                                                                aria-hidden="true"
                                                            ></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <form>
                                            <div className="form-group">
                                                <textarea
                                                    placeholder="Personal Note"
                                                    readOnly={!isAuth}
                                                    value={note}
                                                    onChange={(e) =>
                                                        handleNote(e, item.id, e.target.value)
                                                    }
                                                />
                                            </div>
                                            {noteLoader && <Spinner />}
                                            <div className="form-group">
                                                <button
                                                    disabled={noteLoader}
                                                    onClick={(e) => handleUserNotes(e, item.id)}
                                                    style={{ cursor: "pointer" }}
                                                    title={
                                                        isAuth
                                                            ? ""
                                                            : "You have to login to save your own note for this question."
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-md-4 col-lg-3 order-first order-md-last">
                    <div className={`${isDarkMode ? 'free-test-tabing-right_light_color' : 'free-test-tabing-right_dark_color'}`}>
                        <span>Test Details</span>

                        <div className={`cal-btn ${isDarkMode ? 'cal-btn cat_btn_light' : 'cal-btn cat_btn_dark'}`} style={{ marginBottom: "10px" }}>
                            <a href="#" onClick={handleCancelTest} style={{whiteSpace: "nowrap"}}>
                                Cancel Test
                            </a>
                            <a href="#" onClick={handleFinishTest} style={{whiteSpace: "nowrap"}}>
                                Finish Test
                            </a>
                        </div>
                        {isAuth && !isExam && (
                            <div className="cal-btn" style={{ marginBottom: "10px" }}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSaveWarning(true);
                                    }}
                                    style={{whiteSpace: "nowrap"}}
                                >
                                    Save test
                                </a>
                            </div>
                        )}


                        <QuestionCount
                            step={step}
                            setStep={setStep}
                            questions={questionsData}
                            jumpOnQuestion={handleJumpQuestion}
                        />

                    </div>
                </div>
            </div>


            {/* <div className="row d-block">
                <div className="col-4">
                    
                </div>
                <div className="col-8 d-block">
                    <div className="question-move-next-and-previous">
                        
                            <button className="question-move-btn" onClick={handlePreviousClick}><i className="fas fa-chevron-left pointer"></i></button>
                        
                        
                            <button className=" question-move-btn" onClick={handleNextClick}><i className="fas fa-chevron-right pointer"></i></button>
                        
                    </div>
                </div>
            </div> */}


            {/* If user finish the test */}
            <Modal
                isOpen={finishWarning}
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
                                <p>Incomplete test</p>
                                <img src="assets/images/warning.png" alt="" />
                                <p>You have {notAnswer} number of questions unanswered, confirm you want to end test</p>
                                {/*<p>You still have {notAnswer} unanswered questions.</p>*/}
                                <div className="row">
                                    <a
                                        href="#"
                                        // onClick={(e) => {
                                        //     e.preventDefault();
                                        //     setFinishWarning(false);
                                        // }}

                                        onClick={handleConfirmButton}
                                    >
                                        Yes
                                    </a>

                                    <button
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFinishWarning(false);
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
            {/* If user cancel the test */}
            <Modal
                isOpen={cancelWarning}
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
                                <p>Incomplete test</p>
                                <img src="assets/images/warning.png" alt="" />
                                <p>Do you really want to cancel this test?</p>
                                <div className="row">
                                    <a href="#" onClick={handleUserCancelTest}>
                                        Yes
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCancelWarning(false);
                                            //blockRoutes();
                                        }}
                                    >
                                        No
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* If user Flag Question */}
            <Modal
                isOpen={flagWarning}
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

                                <div className="edit-profile-modal__inner">
                                    <h4 className="theme-txt text-center mb-4 text-dark">Flag This Question</h4>
                                    <img src="assets/images/warning.png" alt="" />
                                    <form>
                                        <div className="choose-report">
                                            <div className="form-group"><input type="radio" name="report" id="first-option" defaultValue="it's spam" defaultChecked onClick={(e) => handlerRadio(1)} /><label htmlFor="first-option" /><span className="ml-1">It's Spam</span></div>
                                            <div className="form-group"><input type="radio" checked name="report" id="second-option" defaultValue="Wrong Q/A" onClick={(e) => handlerRadio(2)} /><label htmlFor="second-option" /><span className="ml-1">Wrong Q/A</span></div>
                                            <div className="form-group"><input type="radio" name="report" id="third-option" defaultValue="Other" onClick={(e) => handlerRadio(3)} /><label htmlFor="third-option" /><span className="ml-1">Other</span></div>
                                            <div className="form-group">
                                                {radioOption ? <input type="text" className="form-control" name="otherqa" placeholder="write here" value={otherOption} onChange={(e) => setOtherOption(e.target.value)} /> : ""}
                                            </div>

                                        </div>

                                    </form>
                                </div>

                                <div className="row">
                                    <a href="#" onClick={(e) => handleUserFlagTest(e)}>
                                        Yes
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setFlagWarning(false);
                                            setRadioValue(false);
                                            //blockRoutes();
                                        }}
                                    >
                                        No
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* If user Bookmark Question */}
            <Modal
                isOpen={bookmarkWarning}
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

                                <div className="edit-profile-modal__inner">
                                    <h4 className="theme-txt text-center mb-4 text-dark">BookMark</h4>
                                    <img src="assets/images/warning.png" alt="" />
                                    <form>
                                        <div className="choose-report">
                                            <div className="form-group"><input type="radio" name="report" id="first-option" defaultValue="it's spam" defaultChecked onClick={(e) => handlerRadio(1)} /><label htmlFor="first-option" /><span className="ml-1">It's Spam</span></div>
                                            <div className="form-group"><input type="radio" checked name="report" id="second-option" defaultValue="Wrong Q/A" onClick={(e) => handlerRadio(2)} /><label htmlFor="second-option" /><span className="ml-1">Wrong Q/A</span></div>
                                            <div className="form-group"><input type="radio" name="report" id="third-option" defaultValue="Other" onClick={(e) => handlerRadio(3)} /><label htmlFor="third-option" /><span className="ml-1">Other</span></div>
                                            <div className="form-group">
                                                {radioOption ? <input type="text" className="form-control" name="otherqa" placeholder="write here" value={otherOption} onChange={(e) => setOtherOption(e.target.value)} /> : ""}
                                            </div>

                                        </div>

                                    </form>
                                </div>

                                <div className="row">
                                    <a href="#" onClick={(d) => handleUserBookmark(d)}>
                                        Yes
                                    </a>
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setBookmarkWarning(false);
                                            setRadioValue(false);
                                            //blockRoutes();
                                        }}
                                    >
                                        No
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {/* If user saved the test */}
            <Modal
                isOpen={saveWarning}
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
                                <p>Save test</p>
                                <img src="assets/images/warning.png" alt="" />
                                <p>Do you really want to save this test?</p>
                                <div className="row">
                                    {saveLoader && <Spinner />}
                                    <button
                                        href="#"
                                        onClick={handleUserSaveTest}
                                        disabled={saveLoader}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSaveWarning(false);
                                            setLoader(false);
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
        </>
    );
};
export default Question;
