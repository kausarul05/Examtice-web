import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    CREATE_EXAM,
} from "../Api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
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
import Pagination from "../../Pagination/Pagination";



const LmsQuestion = ({ questions, student_ids, topicsId, selectyear }) => {
    const history = useHistory();
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [year, setYear] = useState([]);
    const [examTitle, setExamName] = useState([]);
    const [questionsData, setQuestionsData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);
    const [questionids, setQuestionids] = useState([]);
    const [students, setstudents] = useState([]);
    const [ave_total_question, setaveNumberOfQuestion] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10;
    const isAuth = useSelector(userAuth); //using redux useSelector here



    useEffect(() => {
        setQuestionsData(questions.questions);
        setQuestionids(questions.questions);
        setCourses(questions.courseId);
        setSubjects(questions.subjectid);
        setTopics(topicsId);
        setYear(selectyear);
        setExamName(questions.examName);
        setstudents(student_ids);
    }, [questions, student_ids]);


    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        setaveNumberOfQuestion(ave_total_question)
        // Update the globally selected items based on all items
        const allItemIds = questionsData.map((item) => item.id);

        if (!selectAll) {
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems([]);
        }
    };

    const handleCheckboxChange = (itemId) => {
        // Toggle the selection for the current item on the current page
        setSelectedItems((prevSelected) => {
            if (prevSelected.includes(itemId)) {
                return prevSelected.filter((id) => id !== itemId);
            } else {
                return [...prevSelected, itemId];
            }
        });
        setaveNumberOfQuestion(ave_total_question)
    };

    //Start test (whichTest 0 = free test and 1 = exam)
    const createExam = async (e, whichTest) => {
        e.preventDefault();

        setLoader(true);
        let question_id = [];
        questionids.filter((item) => {
            if (item.isChecked == true) {
                question_id.push(item.id);
            }
        });

        var userId =
            Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
        const body = {
            courseId: courses,
            subjectId: subjects,
            topicsId: topics,
            examName: examTitle,
            type: 1,
            user_id: !!userId && userId.id,
            question_id: selectedItems, // Use selectedItems instead of questionids
            total_questions: selectedItems.length,
            student_ids: students,
            year: year,
        };
        try {
            const {
                data: { data, status, message },
            } = await axios.post(CREATE_EXAM, body);
            if (status == 200) {
                if (data) {
                    setLoader(true);

                    toast.success(message);
                } else {
                    toast.error(message);
                    setLoader(false);
                }
                setTimeout(() => {
                    history.push("/lms/exam");
                }, 200);
            }
        } catch (err) {
            setLoader(false);
            toast.error("Someting went wrong, please try again..!");
        }
    };

    // pagination

    const paginate = (pageNumber) => setCurrentPage(pageNumber)


    const getQuestionsForPage = () => {
        const startIndex = (currentPage - 1) * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        return questionsData.slice(startIndex, endIndex);
    };

    const { isDarkMode } = useContext(ThemeContext);


    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row savedTest" >
                        <h4>Questions List</h4>
                        <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>

                            <thead>
                                <tr>
                                    <th scope="col-1">
                                        <span className="d-flex">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectAll}
                                                onChange={handleSelectAllChange}
                                            />
                                            All
                                        </span>
                                    </th>
                                    <th scope="col-3"> Course / Subject of the Test</th>
                                    <th scope="col-3">Topices</th>
                                    <th scope="col">Reffer Code</th>
                                    <th scope="col-4">Questions</th>
                                    <th scope="col-1" style={{ width: "5%" }}>Year</th>
                                </tr>
                            </thead>

                            <tbody>
                                {saveLoader ? (
                                    <div className="spinner_div">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <>
                                        {questionsData.length ? (
                                            getQuestionsForPage().map((item, index) => (
                                                <tr key={index}>
                                                    <td scope="row">
                                                        <input
                                                            type="checkbox"
                                                            value={item.id}
                                                            id={item.id}
                                                            name="question_id"
                                                            checked={selectedItems.includes(item.id)}
                                                            onChange={() => handleCheckboxChange(item.id)}
                                                        />
                                                    </td>
                                                    <td scope="row" >{item.courseName} / {item.subjectName}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.id}</td>
                                                    <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div></td>
                                                    <td>{item.year}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5}>No Questions found..!</td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                        <div className="demo-test" style={{ width: "100%" }}>
                            <button
                                className="common-btn left"
                                href="#"
                                onClick={(e) => createExam(e, 1)}
                                disabled={selectedItems?.length === 0}
                                style={{ float: "left", marginTop: "80px" }}
                            >
                                Create Exam{" "}
                            </button>

                            <div className="mb-5 create-test-pagination">
                                <Pagination postsPerpage={questionsPerPage} totalPosts={questionsData.length} paginate={paginate} setCurrentPage={setCurrentPage} currentPage={currentPage}></Pagination>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default LmsQuestion;
