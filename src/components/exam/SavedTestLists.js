import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { GET_SAVED_TEST, REMOVED_SAVED_TEST } from "../Api";
import axios from "axios";
import { getTestDate } from "../CommonFunction";
import Spinner from "../spinner/Spinner";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userAuth } from "../../features/userSlice";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import Modal from "react-modal";

const SavedTestLists = ({ resumeTest }) => {
    const [saveLoader, setSaveLoader] = useState(false);
    const [removeWarning, setRemoveWarning] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [removeLoader, setRemoveLoader] = useState(false);
    const [savedTest, setSavedTest] = useState([]);
    const userData =
        Cookies.get("user_data") != null && JSON.parse(Cookies.get("user_data"));
    const isAuth = useSelector(userAuth); //using redux useSelector here


    useEffect(() => {
        { isAuth && getSavedTets(); }
    }, []);

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };

    const getSavedTets = async () => {
        try {
            setSaveLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const {
                data: { data, status, error },
            } = await axios.post(GET_SAVED_TEST, { user_id: userData.id }, config);
            if (status == 200) {
                setSaveLoader(false);
                if (data.length > 0) {
                    setSavedTest(data);
                }
            }
        } catch (err) {
            setSaveLoader(false);
        }
    };

    // handleRemoveSavedTest
    const handleRemoveSavedTest = async (e, savedTestId) => {
        e.preventDefault();
        console.log(savedTestId)
        try {
            setRemoveLoader(true);
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const {
                data: { data, status, message },
            } = await axios.post(REMOVED_SAVED_TEST, { test_id: savedTestId }, config);
            if (status == 200) {
                setRemoveLoader(false);
                toast.success(message);
                setSavedTest(savedTest.filter(item => item.test_id != savedTestId));
                setRemoveWarning(false)
            }
        } catch (err) {
            setRemoveLoader(false);
            toast.error("Something went wrong, Try again.!");
        }
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="row savedTest" >
                        <h4>Saved test</h4>
                        <table className={`table table-hover ${isDarkMode ? 'table-dark table table-hover' : 'table-white'}`}>
                            <thead>
                                <tr>
                                    <th scope="col">S.no</th>
                                    <th scope="col"> Course / Subject of the Test</th>
                                    <th scope="col">Questions</th>
                                    <th scope="col">Saved On</th>
                                    <th scope="col" style={{ width: "5%" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {saveLoader ? (
                                    <div className="spinner_div">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <>
                                        {removeLoader &&
                                            <Spinner />
                                        }
                                        {savedTest.length ? (
                                            savedTest.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">{index + 1}</th>
                                                    <th scope="row">
                                                        <Link to={`/user/resume-test/${item.test_id}`} title="Resume test" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                                                            {item.courseName} / {item.subjectName}
                                                        </Link>
                                                    </th>
                                                    <td>{item.total_questions}</td>
                                                    <td>
                                                        {getTestDate(item.created_at)} | {item.time_spent}
                                                    </td>
                                                    <td>
                                                        <a
                                                            href="#"
                                                            className="removeSavedTest"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedTestId(item.test_id);
                                                                setRemoveWarning(true);
                                                            }}
                                                            title="Remove test"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </a>

                                                        {/* <button
                                                            className="removeSavedTest"
                                                            onClick={(e) => handleRemoveSavedTest(e, item.test_id)}
                                                            title="Remove test"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button> */}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5}>No saved test found..!</td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


            <Modal
                isOpen={removeWarning}
                style={customStyles}
                contentLabel="Remove test modal"
                className="logout-modals"
                id="exampleModalLong"
                shouldReturnFocusAfterClose={false}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="payment-sucess">
                                <p>Remove Save test</p>
                                <img src="assets/images/warning.png" alt="" />
                                <p>Do you really want to remove this test?</p>

                                <div className="row">
                                    {saveLoader && <Spinner />}
                                    <button
                                        className="removeSavedTest"
                                        onClick={(e) => handleRemoveSavedTest(e, selectedTestId)}
                                        title="Remove test"
                                    >
                                        Yes
                                    </button>


                                    <button
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setRemoveWarning(false);
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

export default SavedTestLists;
