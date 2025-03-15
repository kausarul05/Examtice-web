import React, { useContext, useEffect, useState } from "react";
import Moment from 'react-moment';
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { MY_SUBSCRIPTION, LMS_EXAMLIST_FOR_STUDENT } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import Pagination from "../../Pagination/Pagination";

const ExamList = () => {
    const history = useHistory();
    const [loader, setLoader] = useState(false);
    const [subscription, setSubscription] = useState([]);
    const [examlist, setExamlist] = useState([]);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const config = {
        headers: {
            Authorization: Cookies.get("token"),
        },
    };

    useEffect(() => {
        getExamlist();
    }, []);

    //   Verify user
    const getExamlist = async () => {
        try {
            setLoader(true);
            var userId =
                Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
            const body = {
                user_id: !!userId && userId.id,

            };
            const {
                data: { message, status, data },
            } = await axios.post(LMS_EXAMLIST_FOR_STUDENT, body);
            console.log(data, "data");
            if (status == 200) {
                setLoader(false);
                setExamlist(data);
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

    //get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = examlist.slice(indexOfFirstPost, indexOfLastPost)

    // Calculate the correct serial number for each item
    const calculateSerialNumber = (index) => {
        return (currentPage - 1) * postsPerPage + index + 1;
    };

    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
                                Exam List
                            </Link>
                        </span>
                    </div>

                    <div className="row savedTest">
                        {loader ? (
                            <div className="spinner_div" style={{ minHeight: "400px" }}>
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {/* <div className="report-menu">
                <div className="category free-testing-tabs">
                  <ul>
                    <li>
                      <p>{report.userReport?.length}</p>
                      Tests taken
                    </li>
                    <li>
                      <p>{report.totalQues}</p>
                      Questions seen
                    </li>
                    <li>
                      <p>{report.totalTime}</p>
                      Time spent
                    </li>
                  </ul>
                </div>
              </div> */}
                                <div className="col-md-12">
                                    <div className="row savedTest" >
                                        <h4>Exam List</h4>
                                        <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                                            <thead>
                                                <tr>
                                                    
                                                    <th scope="col">S.no</th>
                                                    <th scope="col">Exam Name</th>
                                                    <th scope="col">Created By</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Course Name</th>
                                                    <th scope="col">Subject Name</th>
                                                    <th scope="col">Total Questions</th>
                                                    <th scope="col">Create Date</th>
                                                    <th scope="col" style={{ width: "15%" }}>
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPosts.length ? (
                                                    currentPosts.map((item, index) => (
                                                        <tr key={index}>
                                                            <td scope="row">{calculateSerialNumber(index)}</td>
                                                            <td scope="row"> {item.exam_name}</td>
                                                            <td scope="row"> {item.first_name} {item.last_name}</td>
                                                            <td scope="row"> {item.email}</td>
                                                            <td scope="row"> {item.courseName}</td>
                                                            <td scope="row"> {item.subjectName}</td>
                                                            <td scope="row"> {item.total_questions}</td>
                                                            <td scope="row"> {getTestDate(item.created_at)}</td>
                                                            <td>
                                                                {item.is_exam == 1 ? (
                                                                    <Link to={"/user/studentexamdetails/" + item.exam_id + "/" + item.created_for}>
                                                                        <span className="badge-danger badge mr-2">
                                                                            View Result <i className="fas fa-chevron-right"></i>
                                                                        </span>
                                                                    </Link>
                                                                ) : (
                                                                    <Link to={"/user/lms-exam/" + item.exam_id}>
                                                                        <span className="badge-success badge mr-2">
                                                                            Start Exam <i className="fas fa-chevron-right"></i>
                                                                        </span>
                                                                    </Link>
                                                                )}

                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={6}>No Exam Fouad found..!</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <Pagination postsPerpage={postsPerPage} totalPosts={examlist.length} paginate={paginate} setCurrentPage={setCurrentPage} currentPage={currentPage}></Pagination>
                </div>
            </section>
            <Footer />
        </>
    );
};
export default ExamList;
