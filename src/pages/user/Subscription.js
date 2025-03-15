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

const Subscription = () => {
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
          <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
            <span>
              <Link to="/user/dashboard">
                <i className="fas fa-chevron-left" />
                Subscription
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
                <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                  <thead>
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Plan</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Subscribed on</th>
                      <th scope="col">Expired on</th>
                      <th scope="col">Status</th>
                      <th scope="col" style={{ width: "10%" }}>
                        View report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.length ? (
                      subscription.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row"> {item.plan_name}</th>
                          <td>
                            ₦ {item.plan_amount} /{" "}
                            {item.plan_interval == 1 && "Anually"}{" "}
                          </td>
                          <td>{getTestDate(item.created_at)}</td>
                          <td>{getTestDate(item.next_subscription_date)}</td>
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
                            <Link to={"/user/subscription/" + item.id}>
                              <span>
                                View <i className="fas fa-chevron-right"></i>
                              </span>
                            </Link>
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
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default Subscription;
