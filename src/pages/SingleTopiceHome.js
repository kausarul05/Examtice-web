import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { userProfile } from "../features/userSlice";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import Moment from "react-moment";
import Spinner from "../components/spinner/Spinner";
import { GET_SINGLE_TOPIC, POST_COMMENT_TOPIC } from "../components/Api";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import Signin from "../components/modals/signin";

const SingleTopicHome = () => {
    const [allcomment, setComment] = useState([]);
    const [description, setDescription] = useState("");
    const { forumIdHome = "" } = useParams();
    const [loader, setLoader] = useState(false);
    const [commentLoader, setCommentLoader] = useState(false);
    const userData = useSelector(userProfile).user.profile; //Redux user data
    const [open, setOpen] = useState(false);

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };

    // handle to close the modal
    const handleCloseModal = () => {
        setOpen(false);
    };

    //Get courses on page load
    const postComment = async (e) => {
        if (description == "" || description == null) {
            toast.error("Please enter your comment");
            return false;
        }
        const bodyParameters = {
            topic_id: forumIdHome,
            user_id: userData.id,
            comment: description,
        };
        try {
            setLoader(true);
            const {
                data: { data, status },
            } = await axios.post(POST_COMMENT_TOPIC, bodyParameters, config);
            if (status == 200) {
                setLoader(false);
                toast.success("posted successfully");
                setDescription("");
                getUserComment();
            }
        } catch (err) {
            setLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    //Get courses on page load
    const getUserComment = async () => {
        try {
            const bodyParameters = {
                id: forumIdHome,
            };
            setCommentLoader(true);
            const {
                data: { data, status },
            } = await axios.post(GET_SINGLE_TOPIC, bodyParameters, config);
            if (status == 200) {
                setCommentLoader(false);
                setComment(data);
            }
        } catch (err) {
            setCommentLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    const stringConvert = (string) => {
        return string.charAt(0).toUpperCase();
    };

    useEffect(() => {
        if (forumIdHome) {
            getUserComment();
        }
    }, [forumIdHome]);

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <section className="blog-page-main block-element">
                <div className="container mt-100 main_forum_container">

                    <div className={`card mb-3 ${isDarkMode ? 'singleForum_dark' : 'singleForum_light'} `}>
                        <div className="card-header pl-0 pr-0">
                            <div className="row no-gutters w-100 align-items-center">
                                <div className={`col ml-3 font-weight-bold ${isDarkMode ? "color_light" : "color_dark"}`}>
                                    {allcomment.topic_name}
                                </div>
                                <div className="col-12 text-muted"></div>
                            </div>
                        </div>

                        <div className="card-body py-3 main_forum_container_body">
                            <div className="row no-gutters align-items-center">
                                <div className="col-12">
                                    <p className={`${isDarkMode ? "color_light" : "color_dark"}`}>{allcomment.topic_description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {commentLoader && (
                    <div className="spinner_div">
                        <Spinner />
                    </div>
                )}

                <div className="container mt-5">
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-12">
                            <div className={`shadow p-3 bg-white rounded ${isDarkMode ? 'singleForum_dark' : 'singleForum_light'}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex flex-row align-items-center">
                                        {" "}
                                        <span className={`mr-1 fs-14 ${isDarkMode ? "color_light" : "color_dark"}`}>All comments</span>{" "}
                                    </div>
                                </div>

                                {allcomment.comments?.length > 0 ? (
                                    allcomment.comments?.map((item, index) => (
                                        <div className="d-flex flex-row mt-4" key={index}>
                                            {" "}
                                            <span className="person">
                                                {stringConvert(item.first_name)}
                                            </span>
                                            <div className="ml-2 w-100">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div className="d-flex flex-row align-items-center">
                                                        {" "}
                                                        <span className="font-weight-bold name">
                                                            {item.first_name} <i className="fa fa-heart" />
                                                        </span>{" "}
                                                        <span className="dots" />{" "}
                                                        <small className="text-muted time-text">
                                                            <Moment fromNow>{item.created_at}</Moment>{" "}
                                                        </small>{" "}
                                                    </div>
                                                </div>
                                                <p className="user-comment-text text-justify">
                                                    {item.comment}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={`${isDarkMode ? "color_light" : "color_dark"}`}>No Comment Posted yet..!</p>
                                )}

                                <div className="mt-3 d-flex flex-row">
                                    <div className="w-100 ml-2 comment-area">
                                        <textarea
                                            placeholder="Message"
                                            className="form-control"
                                            // value={description}
                                            // onChange={(e) => setDescription(e.target.value)}
                                        />
                                        <Link
                                            className="btn btn-secondary btn-block mt-2 post-btn"
                                           onClick={() => setOpen(true)}
                                        >
                                            Post
                                        </Link>{" "}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Signin show={open} closePop={handleCloseModal} />

            <Footer />
            {/* < ToastContainer /> */}
        </>
    );
};

export default SingleTopicHome;
