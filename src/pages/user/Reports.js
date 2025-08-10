import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { GET_REPORTS } from "../../components/Api";
import { getTestDate } from "../../components/CommonFunction";
import Spinner from "../../components/spinner/Spinner";
import Cookies from "js-cookie";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import Pagination from "../../Pagination/Pagination";

const MyReports = () => {
  const [loader, setLoader] = useState(false);
  const [reports, setReports] = useState({}); // Default to an object
  const [postsPerPage, setPostsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
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
      setLoader(true);
      const user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
      };
      const {
        data: { message, status, data },
      } = await axios.post(GET_REPORTS, body, config);
      if (status === 200) {
        setLoader(false);
        setReports(data || {}); // Store the object directly or an empty object if not present
      } else {
        setLoader(false);
        toast.error("Something went wrong, please try again!");
      }
    } catch (error) {
      setLoader(false);
      toast.error("Something went wrong, please try again!");
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  
  // Ensure `reports.userReport` is defined before using `slice`
  const currentPosts = reports.userReport ? reports.userReport.slice(indexOfFirstPost, indexOfLastPost) : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
            <span>
              <Link to="/user/dashboard">
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
                      <p>{reports.userReport?.length || 0}</p> {/* Updated */}
                      Tests taken
                    </li>
                    <li>
                      <p>{reports.totalQues || 0}</p> {/* Adjust as needed */}
                      Questions seen
                    </li>
                    <li>
                      <p>{reports.totalTime || 0}</p> {/* Adjust as needed */}
                      Time spent
                    </li>
                  </ul>
                </div>
              </div>
              <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-white'}`}>
                <thead>
                  <tr>
                    <th scope="col">S.no</th>
                    <th scope="col">Course Name</th>
                    <th scope="col">Subject Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time spent</th>
                    <th scope="col">Score</th>
                    <th scope="col" style={{ width: "10%" }}>View report</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.length ? (
                    currentPosts.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1 + indexOfFirstPost}</th>
                        <td>{item.course_name}</td>
                        <td>{item.subject_name}</td>
                        <td>{getTestDate(item.created_at)}</td>
                        <td>{item.time_spent}</td>
                        <td>
                          <div className="report-grade-right">
                            <span>
                              {Math.floor((item.totaCorrectOption / item.total_questions) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/user/report/${item.test_id}`}>View</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>No data found..!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
          <Pagination
            postsPerpage={postsPerPage}
            totalPosts={reports.userReport ? reports.userReport.length : 0}
            paginate={paginate}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default MyReports;


