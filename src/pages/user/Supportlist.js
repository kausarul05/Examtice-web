import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { MY_TICKETLIST} from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const Supportlist = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [tickets, setTicketdata] = useState([]);
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getTicketlist();
  }, []);

  //   Verify user
  const getTicketlist = async () => {
    try {
      setLoader(true);
      var user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
      };
      const {
        data: { message, status, data },
      } = await axios.post(MY_TICKETLIST,body, config);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setTicketdata(data);
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
          <div className={`pagination row dash-graph ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
            <div className="col-md-6">
              <span>
                <Link to="/user/dashboard">
                  <i className="fas fa-chevron-left" />
                  Dashboard
                </Link>
              </span>
            </div>
            <div className="col-md-6">
              <span className="right">
                <Link to="/user/addticket" className="common-btn">
                  Create Ticket
                </Link>
              </span>
            </div>
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
                
                <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                  <thead>
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Category</th>
                      <th scope="col">Date</th>
                      <th scope="col" style={{ width: "10%" }}>
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.length ? (
                      tickets.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row"> {item.title}</th>
                          <td>
                            {item.status_id == 3 ? (
                              <span className="badge-success badge mr-2">
                                Open
                              </span>
                            ) : (
                              <>
                                {item.status_id==4?(
                                  <span className="badge-danger badge mr-2">Close</span>
                                ):(
                                  <span className="badge-warning badge mr-2">Awaiting</span>
                                )}
                              </>
                            )}
                          </td>
                          <td>{item.category_name}</td>
                          <td>{getTestDate(item.created_at)}</td>
                          <td className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                            <Link to={"/user/supportdetails/" + item.id}>
                              <span>
                                View <i className="fas fa-chevron-right"></i>
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No Ticket found..!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default Supportlist;
