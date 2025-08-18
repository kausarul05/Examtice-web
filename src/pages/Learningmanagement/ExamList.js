import React, { useContext, useEffect, useState } from "react";
import Moment from 'react-moment';
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { MY_SUBSCRIPTION, LMS_EXAMLIST_FOR_TEACHER } from "../../components/Api";
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
    const [selectAll, setSelectAll] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [examlist, setExamlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5)
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
            } = await axios.post(LMS_EXAMLIST_FOR_TEACHER, body);
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
    // const currentPosts = examlist.reverse().slice(indexOfFirstPost, indexOfLastPost)
    const currentPosts = [...examlist].reverse().slice(indexOfFirstPost, indexOfLastPost);

    //change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    // Calculate the correct serial number for each item
    const calculateSerialNumber = (index) => {
        return (currentPage - 1) * postsPerPage + index + 1;
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);

        // Update the globally selected items based on all items
        const allItemIds = examlist.map((item) => item.id);

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
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <section className="free-testing-sec">
                <div className="container">
                    <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                        <span>
                            <Link to="/lms/dashboard">
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
                                <div className="col-md-12">
                                    <div className="row savedTest" >
                                        <h4>Exam List</h4>
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

                                                    <th scope="col">S.no</th>
                                                    <th scope="col">Exam Name</th>
                                                    <th scope="col" style={{ width: "15%" }}>Course Name</th>
                                                    <th scope="col" style={{ width: "15%" }}>Subject Name</th>
                                                    <th scope="col">Total Questions</th>
                                                    <th scope="col">Create Date</th>
                                                    <th scope="col">
                                                        Action
                                                    </th>
                                                    <th>
                                                        <button className="examlist-delect-all-btn">Delete All</button>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPosts.length ? (
                                                    currentPosts?.map((item, index) => (
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
                                                            <td scope="row">{calculateSerialNumber(index)}</td>
                                                            <td scope="row"> {item.exam_name}</td>
                                                            <td scope="row"> {item.courses_name}</td>
                                                            <td scope="row"> {item.subjects_name}</td>
                                                            <td scope="row"> {item.total_questions}</td>
                                                            <td scope="row"> {getTestDate(item.created_at)}</td>
                                                            <td>
                                                                <Link to={"/lms/examdetails/" + item.exam_id}>
                                                                    <span>
                                                                        Details <i className="fas fa-chevron-right"></i>
                                                                    </span>
                                                                </Link>
                                                            </td>
                                                            <td scope="row"><button className="examlist-delect-btn">Delete</button></td>
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


                        <Pagination postsPerpage={postsPerPage} totalPosts={examlist.length} paginate={paginate} setCurrentPage={setCurrentPage} currentPage={currentPage}></Pagination>

                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};
export default ExamList;
