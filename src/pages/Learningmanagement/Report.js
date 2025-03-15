import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { LMS_EXAM_DETAILS,LMS_EXAMSTUDENTS } from "../../components/Api";
import { Link } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import { useHistory } from "react-router-dom";
import { getTestDate, removeTags } from "../../components/CommonFunction";
import { userAuth } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Comment from "../../components/exam/Comment";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const LmsReport = () => {
  const history = useHistory();
  const isAuth = useSelector(userAuth); //using redux useSelector here
  const [result, setResult] = useState([]);
  const [loader, setLoader] = useState(false);
  const [examforstudents, setexamforstudent] = useState([]);
  const { examId } = useParams();

  useEffect(() => {
    getTestReport();
    getExamforstudent();
  }, []);

  const getTestReport = async () => {
    if (
      examId == undefined &&
      localStorage.getItem("userTestId") == undefined
    ) {
      //history.push("/free-test");
      //return false;
    }

    try {
      setLoader(true);
      const body = {
        examId: examId ? examId : localStorage.getItem("userTestId"),
      };
      const {
        data: { result, status },
      } = await axios.post(LMS_EXAM_DETAILS, body);
      if (status == 200) {
        setResult(result);
        setLoader(false);
      } else {
        //history.push("/free-test");
      }
    } catch (error) {
      console.log(error);
      //toast.error("Something went wrong, please try again.!");
    }
  };
  
  const getExamforstudent = async () => {
    try {
      setLoader(true);
      const body = {
        examId: examId ? examId : localStorage.getItem("userTestId"),
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_EXAMSTUDENTS, body);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setexamforstudent(data);
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

  // Get options common function
  function getOption(option, items) {
    var rightAnser = "";
    switch (option) {
      case 1:
        rightAnser = items.option_1;
        break;
      case 2:
        rightAnser = items.option_2;
        break;
      case 3:
        rightAnser = items.option_3;
        break;
      case 4:
        rightAnser = items.option_4;
        break;
      default:
        rightAnser = "No Answer";
        break;
    }
    return rightAnser;
  }

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          {loader ? (
            <div className="spinner_div" style={{ minHeight: "400px" }}>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="pagination">
                <span>
                  {examId ? (
                    <Link to="/lms/exam" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                      <i className="fas fa-chevron-left" />
                      Back
                    </Link>
                  ) : (
                    <Link to="/" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                      <i className="fas fa-chevron-left" />
                      Grade Report
                    </Link>
                  )}
                </span>
              </div>
              <div className="frade-timing">
                <div className="row">
                  <div className="col-md-12">
                    <div className="grade-left">
                      <p>
                        {`${
                          result.courseName
                            ? "Course name -" + result.courseName + " | "
                            : ""
                        }`}
                        {`${
                          result.subjectName
                            ? "Subject name -" + result.subjectName + " | "
                            : ""
                        }`}
                        {`${
                          result.type
                            ? result.type == 1
                              ? "Type - MCQ"
                              : "Type - Theory"
                            : ""
                        }`}
                      </p>
                      <p>
                        {getTestDate(result.created_at)} <span>|</span>
                        Total{" "} {result.total_questions} questions
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="row ">
                <div className="col-md-9 col-12">
                  <div className="grade-report-chart">
                    <Helmet>
                      <script
                        src="https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image&async=true"
                        type="text/javascript"
                      />
                    </Helmet>
                    <ul>
                      {result.questionsData?.length > 0 ? (
                        result.questionsData?.map((item, index) => (
                          <li
                            className="green-list"

                            key={index}
                          >
                            <div className="chart-left">
                            <div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div>
                             
                                <h5 className="green">
                                  <span>
                                    {" "}
                                    <i
                                      className="fa fa-check"
                                      aria-hidden="true"
                                    />
                                  </span>
                                  <div
                                    className="post__content"
                                    dangerouslySetInnerHTML={{
                                      __html: getOption(item.answer,item),
                                    }}
                                  />
                                </h5>
                            </div>
                            <div className="chart-center">
                              <p
                                style={{ cursor: "pointer" }}
                                data-toggle="modal"
                                data-target={`#explanation-${index} `}
                              >
                                <img src="assets/images/not.png" alt="" />
                                Explanation
                              </p>

                              {/*Expalanation modal  */}
                              <div
                                className="modal fade bd-example-modal-lg"
                                key={index}
                                id={`explanation-${index} `}
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div
                                  className="modal-dialog modal-lg"
                                  role="document"
                                >
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLabel"
                                      >
                                        Explanation
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <span aria-hidden="true">×</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      {
                                        item.explanation ? (
                                          <div
                                            className="post__content"
                                            dangerouslySetInnerHTML={{
                                              __html: item.explanation,
                                            }}
                                          ></div>
                                        ) : (
                                          <div className="post__content">
                                            <p>No examination found..</p>
                                          </div>
                                        )
                                        //   <MathJax.Provider>
                                        //   <MathJax.Html html={item.explanation} />
                                        // </MathJax.Provider>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* modal  */}
                            </div>
                            <div className="chart-center">
                              <p
                                style={{ cursor: "pointer" }}
                                data-toggle="modal"
                                data-target={`#comment-${index} `}
                              >
                                <img src="assets/images/chat.png" alt="" />
                                Comments
                              </p>
                              {/*Comment modal  */}
                              <div
                                className="modal fade bd-example-modal-lg"
                                key={index}
                                id={`comment-${index} `}
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div
                                  className="modal-dialog modal-lg"
                                  role="document"
                                >
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLabel"
                                      >
                                        Comments
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <span aria-hidden="true">×</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      {item.comments.length ? (
                                        <Comment
                                          comments={item.comments}
                                          questionId={item.id}
                                          //commentChange={handleCommentChange}
                                        />
                                      ) : (
                                        <div className="post__content">
                                          <p>No comment found..</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* modal  */}
                            </div>
                          </li>
                        ))
                      ) : (
                        <p>No questions found..!</p>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-12">
                  <div className="free-test-tabing-right">
                    <span>Exam For Student List</span>
                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-white'}`}>
                      <thead>
                      <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Student Name</th>
                          <th scope="col">Email</th>
                          <th scope="col" style={{ width: "15%" }}>
                            Status
                          </th>
                          <th scope="col" style={{ width: "15%" }}>
                            Result
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {examforstudents.length ? (
                          examforstudents.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <th scope="row"> {item.first_name} {item.last_name}</th>
                              <th scope="row"> {item.email}</th>
                              
                              <td>
                                {item.status == 1 ? (
                                  <span class="badge-success badge mr-2">
                                    Active
                                  </span>
                                ) : (
                                  <span class="badge-danger badge mr-2">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td>
                                {item.is_exam == 1 ? (
                                  <Link to={"/lms/studentexamdetails/" + examId +"/"+item.studentId}>
                                  <span className="badge-danger badge mr-2">
                                    View
                                  </span>
                                </Link>
                                ) : (
                                  <span></span>
                                )}
                              </td>
                              
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5}>No subscription found..!</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LmsReport;
