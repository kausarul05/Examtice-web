import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { AFFILIATE_SUBSCRIPTION_USERS } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const SubscribeUsers = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [subscription, setSubscription] = useState([]);
  var userData =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

  console.log(userData, "userData");

  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getSubscribeUsers();
  }, []);

  //   getSubscribeUsers user
  const getSubscribeUsers = async () => {
    try {
      setLoader(true);
      const {
        data: { message, status, data },
      } = await axios.get(AFFILIATE_SUBSCRIPTION_USERS, config);
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

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/affiliate/dashboard" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                Subscribe Users
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
                <table  className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                  <thead>
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Full Name</th>
                      <th scope="col">Phone no.</th>
                      {userData.affiliate_role == 5 && (
                        <th scope="col">Role</th>
                      )}
                      <th scope="col">Join on</th>
                      <th scope="col">Status</th>
                      {/* <th scope="col" style={{ width: "10%" }}>
                        View report
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {subscription.length ? (
                      subscription.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row">
                            {" "}
                            {item.first_name + " " + item.last_name}
                          </th>
                          <th scope="row"> {item.phoneno}</th>
                          {userData.affiliate_role == 5 && (
                            <td>
                              {item.affiliate_role == 6 ? (
                                <span className="badge-info badge mr-2">
                                  Affiliate partner
                                </span>
                              )
                              :
                              (
                                <span className="badge-light badge mr-2">
                                    Student
                                </span>
                              )
                            }
                            </td>
                          )}
                          <td>{getTestDate(item.created_at)}</td>

                          <td>
                            {item.status == 1 ? (
                              <span className="badge-success badge mr-2">
                                Active
                              </span>
                            ) : (
                              <span className="badge-danger badge mr-2">
                                Inactive
                              </span>
                            )}
                          </td>
                          {/* <td>
                            <Link to={"/user/subscription/" + item.id}>
                              <span>
                                View <i class="fas fa-chevron-right"></i>
                              </span>
                            </Link>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No user found..!</td>
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
export default SubscribeUsers;
