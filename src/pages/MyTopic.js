import React from 'react'
import { useState } from 'react';
import Spinner from "../components/spinner/Spinner";
import {
    CHANGE_STATUS_TOPIC,
    CREATE_TOPIC,
    DELETE_TOPIC,
    GET_SINGLE_ALL_TOPIC,
} from "../components/Api";
import { useEffect } from 'react';
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Moment from "react-moment";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt';
import Modal from "react-modal";

const MyTopic = () => {
    const [getTopicLoader, setTopicLoader] = useState(false);
    const [topic, setTopic] = useState([]);
    const userData = JSON.parse(Cookies.get("user_data"));
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [delectItem, setDelectItem] = useState(null)

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };

    const deleteTopic = async (topicid) => {
        setDelectItem(topicid)
        setDeleteWarning(true)
    };

    const handelConfirmDelect = async() =>{
        
        const bodyParameters = {
            id: delectItem,
            user_id: userData.id,
        };

        try {
            const {
                data: { data, status },
            } = await axios.post(DELETE_TOPIC, bodyParameters, config);
            if (status == 200) {
                toast.success("Deleted successfully");
                getUserTopic();
                setDeleteWarning(false)
            }
        } catch (err) {
            toast.error("Something went wrong please try again..!");
        }
    }

    const changeStatus = async (topicid, status) => {
        const bodyParameters = {
            id: topicid,
            user_id: userData.id,
            status: status == 1 ? 0 : 1,
        };

        try {
            const {
                data: { data, status },
            } = await axios.post(CHANGE_STATUS_TOPIC, bodyParameters, config);
            if (status == 200) {
                toast.success("Status changed successfully");
                getUserTopic();
            }
        } catch (err) {
            toast.error("Something went wrong please try again..!");
        }
    };

    //Get courses on page load
    const getUserTopic = async () => {
        try {
            const bodyParameters = {
                id: userData.id,
            };
            setTopicLoader(true);
            const {
                data: { data, status },
            } = await axios.post(GET_SINGLE_ALL_TOPIC, bodyParameters, config);
            if (status == 200) {
                setTopic(data);
                setTopicLoader(false);
            }
        } catch (err) {
            setTopicLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    useEffect(() => {
        getUserTopic();
    }, []);

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <div className='blog-page-main' style={{ height: "70vh" }}>
                <div className="container">
                    <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                        <span>
                            <Link to="/forum">
                                <i className="fas fa-chevron-left" />
                                Back
                            </Link>
                        </span>
                    </div>

                    <div className="d-flex justify-content-end">
                        <div className="p-0 mb-3">
                            <Link className="common-btn-md" to={`/topic-create`}>
                                <span className="btn-icon-wrapper pr-2 opacity-7">
                                    {" "}
                                    <i className="fa fa-plus fa-w-20" />{" "}
                                </span>
                                New thread
                            </Link>
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header pl-0 pr-0">
                            <div className="row no-gutters w-100 align-items-center">
                                <div className="col ml-3 color_dark">Yours Topics</div>
                                <div className="col-4 text-muted">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-4 color_dark">Replies</div>
                                        <div className="col-4 color_dark">Last updated</div>
                                        <div className="col-4 color_dark">Action</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {getTopicLoader ? (
                            <div className="spinner_div">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {topic.length > 0 ? (
                                    topic.map((item, i) => (
                                        <>
                                            <div
                                                className="card-body py-3 main_forum_container_body color_dark"
                                                key={i}
                                            >
                                                <div
                                                    className="row no-gutters align-items-center"
                                                    key={i}
                                                >
                                                    <div className="col">
                                                        {" "}
                                                        <Link className="text-big" to={`/forum/${item.id}`}>
                                                            {item.topic_name}
                                                        </Link>
                                                        <div className="text-muted small mt-1">
                                                            <Moment fromNow>{item.created_at}</Moment>{" "}
                                                            &nbsp;·&nbsp;{" "}
                                                            <Link
                                                                to="#"
                                                                onClick={(e) => e.preventDefault()}
                                                                className="text-muted"
                                                                data-abc="true"
                                                            >
                                                                {item.first_name}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div className="d-none d-md-block col-4">
                                                        <div className="row no-gutters align-items-center">
                                                            <div className="col-4">
                                                                {item.comment == null ? 0 : item.comment}
                                                            </div>
                                                            <div className="media col-4 align-items-center">
                                                                <div className="media-body flex-truncate ml-2">
                                                                    <div className="line-height-1 text-truncate">
                                                                        <Moment fromNow>{item.updated_at}</Moment>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <button
                                                                    className="btn btn-sm btn-danger mr-2"
                                                                    onClick={() => deleteTopic(item.id)}
                                                                    title="Delete"
                                                                >
                                                                    Delete
                                                                </button>
                                                                <button
                                                                    className={`btn btn-sm ${item.status == 1
                                                                        ? "btn-success"
                                                                        : "btn-warning"
                                                                        }`}
                                                                    onClick={() =>
                                                                        changeStatus(item.id, item.status)
                                                                    }
                                                                    title={
                                                                        item.status == 1 ? "InActive" : "Active"
                                                                    }
                                                                >
                                                                    {item.status == 1 ? "Active" : "InActive"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                        </>
                                    ))
                                ) : (
                                    <p style={{color: "#000"}}>No Topic Post found..!</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={deleteWarning}
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
                                <p>Are you sure you want to delect?</p>
                                <img src="assets/images/warning.png" alt="" />
                                {/* <p>You have number of questions unanswered, confirm you want to end test</p> */}
                                {/*<p>You still have {notAnswer} unanswered questions.</p>*/}
                                <div className="row">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handelConfirmDelect()
                                        }}
                                        
                                        // onClick={handelConfirmDelect}
                                    >
                                        Yes
                                    </a>

                                    <button
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setDeleteWarning(false);
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
    )
}

export default MyTopic