import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { DELETE_COMMENT } from "../Api";
import { getTestDate } from "../CommonFunction";

const Comment = ({ comments, commentChange, questionId }) => {
    const [userComments, setUserComments] = useState([]);
    const userData = Cookies.get("user_data") != null && JSON.parse(Cookies.get("user_data"));

    const [showDelete, setShowDelete] = useState(true);
    const location = useLocation();
    let reportParam = location.pathname.split('/');
    useEffect(() => {
        reportParam.filter((val) => { val == 'report' && setShowDelete(false) });
    });
    useEffect(() => {
        setUserComments(comments);

    }, [comments])


    //   delete commnet 
    const deleteComment = async (e, id) => {
        e.preventDefault();
        setUserComments(comments.filter((item) => item.id !== id));
        commentChange(id, questionId);
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };
            const {
                data: { status, message },
            } = await axios.post(DELETE_COMMENT, { commentId: id }, config);
            if (status == 200) {
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <>
            {comments?.map((item, index) => (
                <div className="card mb-3 main_forum_container_body" key={index}>
                    <div className="row no-gutters align-items-center m-2">
                        <div className="col">
                            <div className="text-muted large mt-1">
                                <Link
                                    to="#"
                                    onClick={(e) => e.preventDefault()}
                                    className="text-muted"
                                    data-abc="true"
                                >
                                    {item.first_name}
                                </Link>
                                &nbsp;·&nbsp; {getTestDate(item.created_at)}{" "}
                            </div>
                            <div style={{color: "#000"}}>
                                {item.comment}
                            </div>
                        </div>
                        {userData && item.userId == userData.id && showDelete && (
                            <div className="col">
                                <button
                                    className="float-right"
                                    title="Delete comment"
                                    style={{ cursor: "pointer", border: "none" }}
                                    onClick={(e) => deleteComment(e, item.id)}
                                >
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};
export default Comment;
