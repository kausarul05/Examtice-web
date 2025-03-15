import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory, useParams} from "react-router-dom";
import { LMS_TEACHER_SEND_REQUEST,LMS_REQUESTED_TEACHER,SEARCH_TEACHER_BY_EMAIL } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const SubscribeUsers = () => {
  const { TeacherId } = useParams();
  const userData =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [subscription, setSubscription] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [pendingconfirm, setPending_confirm] = useState([]);
  const [pendingrequest, setPending_request] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    searchstudentbyemail:"",
  });
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getSubscriptionsstudent();
  }, []);

  //   Verify user
  const getSubscription = async () => {
    try {
      setLoader(false);
      const body = {
        searchstudentbyemail: updateForm.searchstudentbyemail,
      };
      const {
        data: { message, status, data },
      } = await axios.post(SEARCH_TEACHER_BY_EMAIL, body);
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
  const getSubscriptionrequest = async () => {
    try {
      setLoader(true);
      const body = {
        student_id: userData ? userData.id : false,
        teacher_id: TeacherId,
        request_from:userData ? userData.id : false,
        userId: userData ? userData.id : false,
        userRole:userData ? userData.affiliate_role : false,
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_TEACHER_SEND_REQUEST, body);
      //console.log(data, "data");
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

  const getSubscriptionsstudent = async () => {
    try {
      setLoader(false);
      const body = {
        userId: userData ? userData.id : false,
        userRole:userData ? userData.affiliate_role : false,
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_REQUESTED_TEACHER, body);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setAccepted(data.accepted);
        setPending_confirm(data.pending_confirm);
        setPending_request(data.pending_request);
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

  const handleEditChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value,
    });
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
                <div className="col-md-5">
                  <div className="row savedTest" >
                    <h4>Teacher/Parent List</h4>
                    <br/>
                    <div className="serach-box row">
                      <div className="col-8">
                        <input
                          type="text"
                          placeholder="Search student by email"
                          name="searchstudentbyemail" 
                          value={updateForm.searchstudentbyemail} 
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="col-4">
                        <span
                          className="common-btn"
                          onClick={getSubscription}
                        >
                          Search
                        </span>
                      </div>
                    </div>
                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                      <thead>
                        <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: "10%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {subscription.length ? (
                          subscription.map((item, index) => (
                            <tr key={index}>
                              <th>{index + 1}</th>
                              <th> {item.first_name} {item.last_name}</th>
                              <th> {item.email}</th>
                              
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
                              <td>
                                <Link className="badge-danger badge mr-2" to={"/lms/teachersubscriptionrequest/" + item.id}>
                                  <span>
                                    Request
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
                  </div>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-5">
                  <div className="row savedTest" >
                    <h4>List of Teacher/Parent</h4>
                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                      <thead>
                        <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: "20%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {accepted.length ? (
                          accepted.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <th scope="row"> {item.first_name} {item.last_name}</th>
                              <th scope="row"> {item.email}</th>
                              
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
                              <td>
                                <Link className="badge-danger badge mr-2" to={"/lms/subscriptionblockteacher/" + item.id}>
                                  <span>
                                    Delete
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
                    
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="row savedTest" >
                    <h4>Waiting for Confirmation</h4>
                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                      <thead>
                      <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Name</th>
                          <th scope="col">Emai</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: "20%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingconfirm.length ? (
                          pendingconfirm.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <th scope="row"> {item.first_name} {item.last_name}</th>
                              <th scope="row"> {item.email}</th>
                              
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
                              <td>
                                <Link className="badge-danger badge mr-2" to={"/lms/request-cancle/" + item.id}>
                                  <span>
                                    Cancel
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
                    
                  </div>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-5">
                  <div className="row savedTest" >
                    <h4>Pending for Confirmation</h4>
                    <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                      <thead>
                      <tr>
                          <th scope="col">S.no</th>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Status</th>
                          <th scope="col" style={{ width: "20%" }}>
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingrequest.length ? (
                          pendingrequest.map((item, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <th scope="row"> {item.first_name} {item.last_name}</th>
                              <th scope="row"> {item.email}</th>
                              
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
                              <td>
                                <div className="row">
                                  <div className="col-5">
                                    <Link className="badge-danger badge mr-2" to={"/lms/subscriptionblockteacher/" + item.id}>
                                      <span>
                                        Delete
                                      </span>
                                    </Link>
                                  </div>
                                  <div className="col-5">
                                    <Link className="badge-success badge mr-2" to={"/lms/request-accept/" + item.id}>
                                      <span>
                                        Accept
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                                
                                
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
