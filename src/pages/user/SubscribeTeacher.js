import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory, useParams,Route,Redirect } from "react-router-dom";
import { LMS_TEACHER_SEND_REQUEST,LMS_REQUESTED_TEACHER,SEARCH_TEACHER_BY_EMAIL } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";

const SubscribeUsers = ({...rest}) => {
  const { teacherId } = useParams();
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
    getSubscriptionrequest();
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
        teacher_id: teacherId,
        request_from:userData ? userData.id : false,
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_TEACHER_SEND_REQUEST, body);
      console.log(data, "data");
      if (status == 200) {
        toast.success(message);
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
      setLoader(true);
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

  return (
    <Route
      {...rest}
      render={(props) =>
        Cookies.get("token") &&
        Cookies.get("user_data") && (
        <>
          <Redirect
            to={{
              pathname: "/user/teachersubscription",
              state: { from: props.location },
            }}
          />
        </>
      )
    }
    />
  );
};
export default SubscribeUsers;
