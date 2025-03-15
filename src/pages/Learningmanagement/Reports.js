import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { GET_LMS_STUDENTREPORTS } from "../../components/Api";
import { getTestDate } from "../../components/CommonFunction";
import { useParams } from "react-router-dom";
import Spinner from "../../components/spinner/Spinner";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const LmsStudentReports = () => {
  //const userData = JSON.parse(useSelector(userProfile).user.user);
  const [loader, setLoader] = useState(false);
  const [report, setReports] = useState([]);
  const { studentsId } = useParams();

  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    try {
      var user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
        studentsId: studentsId,
      };
      const {
        data: { message, status, data },
      } = await axios.post(GET_LMS_STUDENTREPORTS, body, config);
      if (status === 200) {
        setLoader(false);
        setReports(data);
      } else {
        setLoader(false);
        toast.error(data.message);
      }
    } catch (error) {
      setLoader(false);
      toast.error("Student Didn't Complete Any Exam!");
    }
  };

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/lms/dashboard" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                Reports
              </Link>
            </span>
          </div>

          {loader ? (
            <div className="spinner_div" style={{ minHeight: "400px" }}>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="report-menu">
                <div className="category free-testing-tabs">
                  <ul>
                    <li>
                      <p>{report.userReport?.length>0 ? report.userReport?.length
                      : "0"}
                      </p>
                      Exam Assign
                    </li>
                    <li>
                      <p>{report.totalQues>0 ? report.totalQues
                      : "0"}</p>
                      Total Questions
                    </li>
                    <li>
                      <p>{report.totalgivenExam>0 ? report.totalgivenExam
                      : "0"}</p>
                      Exam Complete
                    </li>
                    <li>
                      <p>{report.totalQuesseen>0 ? report.totalQuesseen
                      : "0"}</p>
                      Questions seen
                    </li>
                    <li>
                      <p>{report.totalTime?.length>0 ? report.totalTime
                      : "00:00"}</p>
                      Time spent
                    </li>
                  </ul>
                </div>
              </div>
              <table className={` ${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                <thead>
                  <tr>
                    <th scope="col">S.no</th>
                    <th scope="col">Exam Name</th>
                    <th scope="col">Course Name</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Student Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time spent</th>
                    <th scope="col">Score</th>
                    <th scope="col" style={{ width: "10%" }}>
                      View report
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.userReport?.length ? (
                    report.userReport?.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.exam_name}</td>
                        <td>{item.courseName}</td>
                        <td>{item.subjectName}</td>
                        <td>{item.sfirst_name} {item.slast_name}</td>
                        <td>{getTestDate(item.created_at)}</td>
                        <td>{item.time_spent}</td>
                        <td>
                          {item.is_exam == 1 ? (
                            <div className="report-grade-right">
                              <span>
                                {Math.floor(
                                  (item.totaCorrectOption /
                                    item.total_questions) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                          ) : (
                            <span></span>
                          )}
                        </td>
                        <td>
                          {item.is_exam == 1 ? (
                            <Link to={"/lms/studentexamdetails/" + item.lmsexamId +"/"+item.created_for}>View</Link>
                          ) : (
                            <span></span>
                          )}
                           {/* <Link to={"/user/studentexamdetails/" + item.lmsexamId +"/"+item.created_for}>View</Link> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>No data found..!</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {loader && <Spinner />}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LmsStudentReports;
