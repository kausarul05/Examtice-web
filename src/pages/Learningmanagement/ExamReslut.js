import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { MY_SUBSCRIPTION } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const ExamReslut = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [subscription, setSubscription] = useState([]);
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getSubscription();
  }, []);

  //   Verify user
  const getSubscription = async () => {
    try {
      setLoader(true);
      const {
        data: { message, status, data },
      } = await axios.get(MY_SUBSCRIPTION, config);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setSubscription(data);
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

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />
      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/user/dashboard" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                Exam Results List
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
                    <h4 style={{ color: "#ffff" }}>Student List</h4>
                    <table className={` ${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                      <thead>
                        <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Exam Name</th>
                          <th scope="col">Course Name</th>
                          <th scope="col">Subject Name</th>
                          <th scope="col">Student Name</th>
                          <th scope="col">Total Questions</th>
                          <th scope="col">Create Date</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: "15%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscription.length ? (
                          subscription.map((item, index) => (
                            <tr key={index}>
                              <td scope="row">{index + 1}</td>
                              <td scope="row"> {item.plan_name}</td>
                              <td scope="row"> {item.plan_name}</td>
                              <td scope="row"> {item.plan_name}</td>
                              <td scope="row"> {item.plan_name}</td>
                              <td>
                                {item.is_active == 1 ? (
                                  <span className="badge-success badge mr-2">
                                    Active
                                  </span>
                                ) : (
                                  <span className="badge-danger badge mr-2">
                                    Inactive
                                  </span>
                                )}
                              </td>
                              <td>
                                <Link to={"/lms/examdetails/" + item.id}>
                                  <span>
                                    Details <i className="fas fa-chevron-right"></i>
                                  </span>
                                </Link>
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
        </div>
      </section>
      <Footer />
    </>
  );
};
export default ExamReslut;
