import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useHistory } from "react-router-dom";
import Footer from "../components/Footer";
import Moment from "react-moment";
import moment from "moment";
import { toast } from "react-toastify";
import axios from "axios";
import { GET_ALL_TOPIC } from "../components/Api";
import Spinner from "../components/spinner/Spinner";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
import { useSelector } from "react-redux";
import { userAuth } from "../features/userSlice";
import Signin from "../components/modals/signin";

const Forum = () => {
    const [topic, setTopic] = useState([]);
    const [loader, setLoader] = useState(false);

    const config = {
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };

    //Get courses on page load

    //Get courses on page load
    const getTopics = async () => {
        try {
            setLoader(true);

            const {
                data: { data, status },
            } = await axios.get(GET_ALL_TOPIC);
            if (status == 200) {
                setLoader(false);
                setTopic(data);
            }
        } catch (err) {
            setLoader(false);
            toast.error("Something went wrong please try again..!");
        }
    };

    useEffect(() => {
        getTopics();
    }, []);

    console.log(topic)

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />
            <section className="blog-page-main block-element">
                <div className="container mt-100 main_forum_container">
                    <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                        <span>
                            <Link to="/">
                                <i className="fas fa-chevron-left" />
                                Back
                            </Link>
                        </span>
                    </div>
                    <div className="d-flex flex-wrap ">

                        <div className="col-md-2 p-0 mb-3">
                            <Link className="common-btn-md" to={`/topic-create`}>
                                <span className="btn-icon-wrapper pr-2 opacity-7">
                                    {" "}
                                    <i className="fa fa-plus fa-w-20" />{" "}
                                </span>
                                New thread
                            </Link>
                        </div>

                        <div className="col-md-3 p-0 mb-3">
                            <Link className="common-btn-md" to={`/my-topic`}>
                                <span className="btn-icon-wrapper pr-2 opacity-7">
                                    {" "}
                                    {/* <i className="fa fa-plus fa-w-20" />{" "} */}
                                </span>
                                My Topice
                            </Link>
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-header pl-0 pr-0">
                            <div className="row no-gutters w-100 align-items-center">
                                <div className={`col ml-3 ${isDarkMode ? 'topics_dark' : 'topics_light'}`}>Topics</div>
                                <div className="col-4 text-muted">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-6 col-md-4">Replies</div>
                                        <div className="col-6 col-md-8">Last update</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loader ? (
                            <div className="spinner_div" style={{ minHeight: "400px" }}>
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {topic?.data?.length > 0 ? (
                                    topic?.data?.map((item, i) => (
                                        <>
                                            <div
                                                className="card-body py-3 main_forum_container_body"
                                                key={i}
                                            >
                                                <div className="row no-gutters align-items-center">
                                                    <div className="col">
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
                                                    <div className=" d-md-block col-4">
                                                        <div className="row no-gutters align-items-center">
                                                            <div className={`col-4 ${isDarkMode ? 'topics_light' : 'topics_dark'}`}>
                                                                {item.comment == null ? 0 : item.comment}
                                                            </div>
                                                            <div className="media col-8 align-items-center">
                                                                <div className="media-body flex-truncate ml-2">
                                                                    <div className={`line-height-1 text-truncate ${isDarkMode ? 'topics_light' : 'topics_dark'}`}>
                                                                        <Moment fromNow>{item.updated_at}</Moment>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="m-0" />
                                        </>
                                    ))
                                ) : (
                                    <p>No Topic Post found..!</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Forum;
