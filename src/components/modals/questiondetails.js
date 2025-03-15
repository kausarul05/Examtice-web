import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { SEARCH_QUESTIONBYID } from "../Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";


const Questiondetails = ({ show, closePop, questionsid }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [searchquestiondetails, setSearchquestiondetails] = useState([]);
  //const [questionsidData, setquestionsidData] = useState([]);

  useEffect(() => {
    //setquestionsidData(questionsid);
    viewquestiondetails();
  }, [questionsid]);

  // console.log(searchquestiondetails)

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: "9999",
      overflowY: "auto",
    },
  };
  Modal.setAppElement("#root");

  //Handle close popup modal
  const handleClose = () => {
    closePop(false);
  };

  const viewquestiondetails = async () => {
    try {
      var queid = questionsid;
      const config = {
        headers: {
          Authorization: Cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        }
      }
      var userId = Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

      const body = {
        questionId: queid,
      };

      const {
        data: { status, data, message },
      } = await axios.post(SEARCH_QUESTIONBYID, body);
      if (status == 200) {
        setLoader(false);
        setSearchquestiondetails(data);
        // toast.success(message);
        console.log(data)
      } else {
        setLoader(false);
        toast.error(message);

      }
    } catch (err) {
      console.log(err)
      if (err.response?.data?.status == 400) {
        toast.error(err.response?.data?.error_description);
      } else {
        toast.error("Something went wrong, please try again..!");
      }
      setLoader(false);
    }

  };

  return (
    <>
      <Modal
        isOpen={show}
        onRequestClose={handleClose}
        style={customStyles}
        contentLabel="Login Modal"
        className="questiondetails-modals"
        id="exampleModalLong"
        shouldReturnFocusAfterClose={true}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-body">
              <div className="login-deatils">
                <ul className="nav nav-tabs">
                  <li className="active">
                    <a className="active">
                      Question Details
                    </a>
                  </li>
                </ul>
              </div>
              <div >
                <div>
                  <br />
                  <br />
                  <div className="sign-tab-detail">
                    {searchquestiondetails &&
                      searchquestiondetails.map((item, index) => (
                        <div className="row searchquestionlisting">
                          <div className="col-sm-3 ">
                            <b>Course Name:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.courseName }}></div>

                          </div>

                          <div className="col-sm-3 text-black">
                            <b>Subject Name:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.subjectName }}></div>

                          </div>

                          <div className="col-sm-4 text-black">
                            <b>Topic Name:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.topicName }}></div>
                          </div>

                          <div className="col-sm-2 text-black text-center">
                            <b>Year:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.year }}></div>
                          </div>

                          <div className="col-sm-12 text-black">
                            <b>Question:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div>

                          </div>
                          <div className="col-sm-6">
                            <b>Option 1:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_1 }}></div>

                          </div>
                          <div className="col-sm-6">
                            <b>Option 2:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_2 }}></div>

                          </div>
                          <div className="col-sm-6">
                            <b>Option 3:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_3 }}></div>

                          </div>
                          <div className="col-sm-6">
                            <b>Option 4:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_4 }}></div>

                          </div>
                          <div className="col-sm-12">
                            <b>Answer:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.answer }}></div>

                          </div>
                          <div className="col-sm-12">
                            <b>Explanation:</b> <div className="post__content" dangerouslySetInnerHTML={{ __html: item.explanation }}></div>

                          </div>

                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Questiondetails;
