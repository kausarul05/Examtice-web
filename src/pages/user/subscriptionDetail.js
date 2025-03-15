import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  MY_SUBSCRIPTION_DETAIL,
  CANCEL_SUBSCRIPTION,
} from "../../components/Api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import { getTestDate } from "../../components/CommonFunction";
import Spinner from "../../components/spinner/Spinner";
import Accordion from "../../components/accordion";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const SubscriptionDetail = () => {
  const history = useHistory();
  const { subscriptionId } = useParams();
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getSubscriptionDetail();
  }, []);

  //  MY_SUBSCRIPTION_DETAIL
  const getSubscriptionDetail = async () => {
    try {
      setLoader(true);
      const {
        data: { status, data },
      } = await axios.get(
        MY_SUBSCRIPTION_DETAIL + "/" + subscriptionId,
        config
      );
      if (status == 200) {
        setSubscriptionData(data);
        setLoader(false);
      }
    } catch (error) {
      if (error?.response?.data?.status == 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
        history.push("/user/subscription");
      }
      setLoader(false);
    }
  };

  //handleCancelSubscription
  const handleCancelSubscription = async (e) => {
    e.preventDefault();
    try {
      setButtonLoader(true);
      const body = {
        subscribeId: subscriptionId,
        token: subscriptionData.email_token,
        code: subscriptionData.subscription_code,
      };
      const {
        data: { status, data, message },
      } = await axios.post(CANCEL_SUBSCRIPTION, body, config);
      if (status == 200) {
        toast.success(message);
        setButtonLoader(false);
        history.push("/user/subscription");
      } else {
        toast.error(message);
        setButtonLoader(false);
      }
    } catch (error) {
      if (error?.response?.data?.status == 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
      }
      setButtonLoader(false);
      //history.push("/");
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
              <Link to="/user/subscription" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                Back
              </Link>
            </span>
          </div>

          <div className="card mb-3">
            <div className="row m-3">
              {loader ? (
                <div className="spinner_div" style={{ minHeight: "400px" }}>
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="col-md-6 col-12">
                    <div className="card">
                      <div className="card-body py-3 main_forum_container_body">
                        <div className="row no-gutters align-items-center">
                          <div className="col text-dark">
                            <h5>Course Detail</h5>
                            <div className="subscription-detail-row">
                              <div className="col-6">Course name</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData?.course?.name}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row">
                              <div className="col-6">Subjects</div>
                            </div>
                            <div className="subscription-detail-row">
                              <div className="col-12">
                                <div className="accordion">
                                  {subscriptionData?.subjects?.length ? (
                                    // subscriptionData.subjects.map(
                                    //   (subject, key) => (
                                    <Accordion
                                      subjects={subscriptionData?.subjects}
                                    />
                                  ) : (
                                    // )
                                    //)
                                    <p>No subjects found..!</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12">
                    <div className="card">
                      <div className="card-body py-3 main_forum_container_body">
                        <div className="row no-gutters align-items-center">
                          <div className="col text-dark">
                            <h5>Subscription</h5>

                            <div className="subscription-detail-row">
                              <div className="col-6">Plan</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.plan_name}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row">
                              <div className="col-6">Subscription Code</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.subscription_code}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row">
                              <div className="col-6">Amount</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.plan_amount}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row ">
                              <div className="col-6">Interval</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.plan_interval == 1
                                    ? "Annually"
                                    : ""}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row ">
                              <div className="col-6">Subscribed On</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {getTestDate(subscriptionData.created_at)}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row ">
                              <div className="col-6">Next Charge Date</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.next_subscription_date &&
                                    getTestDate(
                                      subscriptionData.next_subscription_date
                                    )}
                                </span>
                              </div>
                            </div>
                            <div className="subscription-detail-row ">
                              <div className="col-6">Status</div>
                              <div className="col-6">
                                <span className="v2-text-bold">
                                  {subscriptionData.is_active ? (
                                    <h5>
                                      <span class="badge-success badge mr-2">
                                        Active
                                      </span>
                                    </h5>
                                  ) : (
                                    <h5>
                                      <span class="badge-danger badge mr-2">
                                        Inactive
                                      </span>
                                    </h5>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {subscriptionData.is_active == 1 && (
                    <div className="col-md-12">
                      <div className="text-center mt-4 mb-4">
                        <button
                          className="common-btn cancel_subscription"
                          onClick={handleCancelSubscription}
                          disabled={buttonLoader}
                        >
                          {buttonLoader && <Spinner />}
                          {/* <span className="text-bold text-14px ng-binding"> */}
                          Cancel Subscription
                          {/* </span> */}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
export default SubscriptionDetail;
