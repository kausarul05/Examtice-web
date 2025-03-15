import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory,useParams } from "react-router-dom";
import { MY_TICKETDETAILS,MY_TICKETCOMMENTS,MY_TICKETCOMMENTSSTORE} from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const TicketDetails = () => {
  const history = useHistory();
  const { ticketId } = useParams();
  const [loader, setLoader] = useState(false);
  const [tickets, setTicketdata] = useState([]);
  const [ticketcomments, setTicketComments] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    comment_text: "",
  });
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getTicketDetails();
  }, []);

  //   Verify user
  const getTicketDetails = async () => {
    try {
      setLoader(true);
      var user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
        ticketId: ticketId,
      };
      const {
        data: { message, status, data },
      } = await axios.post(MY_TICKETDETAILS,body, config);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setTicketdata(data);
        getTicketComments();
      } else {
        setLoader(false);
        toast.error(message);
      }
    } catch (error) {
      setLoader(false);
      if (error.data.status == 422) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
      }
    }
  };

  

  const handleTickektsComments = async () => {
    try {
      setLoader(true);
      const config = {
        headers: {
          Authorization: Cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        }
      }
      var userId =Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
      
      const body = {
        userId: userId.id,
        ticket_id: ticketId,
        comment_text: updateForm.comment_text,
      };

      const {
        data: { status, data, message },
      } = await axios.post(MY_TICKETCOMMENTSSTORE, body);
      if (status == 200) {
        getTicketComments();
        setLoader(false);
        toast.success(message);
      }else{
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

  const getTicketComments = async () => {
    try {
      setLoader(true);
      var user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
        ticketId: ticketId,
      };
      const {
        data: { message, status, data },
      } = await axios.post(MY_TICKETCOMMENTS,body, config);
      console.log(data, "data");
      if (status == 200) {
        setLoader(false);
        setTicketComments(data);

      } else {
        setLoader(false);
        toast.error(message);
      }
    } catch (error) {
      setLoader(false);
      if (error.data.status == 422) {
        toast.error(error.data.message);
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
              <Link to="/user/support">
                <i className="fas fa-chevron-left" />
                Ticket List
              </Link>
            </span>
          </div>

          <div className="row savedTest">
                <table className="table table-bordered table-striped">
                  <tbody>
                      <tr>
                          <th> IDh </th>
                          <td>{tickets.id} </td>
                      </tr>
                      <tr>
                          <th> Created at </th>
                          <td> {getTestDate(tickets.created_at)} </td>
                      </tr>
                      <tr>
                          <th> Title </th>
                          <td> {tickets.title} </td>
                      </tr>
                      <tr>
                          <th> Content </th>
                          <td> {tickets.content} </td>
                      </tr>
                      
                      <tr>
                          <th> Status </th>
                          <td> 
                            {tickets.status_id && tickets.status_id==3?(
                              <span className="badge-success badge mr-2">Open</span>
                            ):(
                              <>
                                {tickets.status_id==4?(
                                  <span className="badge-danger badge mr-2">Close</span>
                                ):(
                                  <span className="badge-warning badge mr-2">Awaiting</span>
                                )}
                              </>
                            )}
                          </td>
                      </tr>
                      
                      <tr>
                          <th> Category </th>
                          <td>{tickets.category_name}</td>
                      </tr>
                      <tr>
                          <th> Author Name </th>
                          <td> {tickets.author_name} </td>
                      </tr>
                      <tr>
                          <th> Author Email </th>
                          <td> {tickets.author_email} </td>
                      </tr>
                      
                      <tr>
                          <th> Comments </th>
                          <td>
                          {ticketcomments.length ? (
                            ticketcomments.map((item, index) => (
                              <>
                              <div className="row">
                                <div className="col">
                                  <p className="font-weight-bold">
                                    <a href="#">{item.author_name}</a> {getTestDate(item.created_at)}</p>
                                  <p>{item.comment_text}</p>
                                </div>
                              </div>
                            <hr/>
                            </>
                            ))
                          ) : (
                            <>
                              <div className="row">
                                
                              </div>
                            </>
                          )}
                        
                            {loader && <Spinner />}
                            <hr/>
                              <div className="form-group">
                                <label for="comment_text">Leave a comment</label>
                                <textarea className="form-control" value={updateForm.comment_text} onChange={handleEditChange} id="comment_text" name="comment_text" rows="3" required=""></textarea>
                              </div>

                              <button
                                value="Save Feedback"
                                className="common-btn"
                                onClick={handleTickektsComments}
                                disabled={loader}
                              >
                                      Submit
                                    {loader && "..."}
                              </button>
                              
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default TicketDetails;
