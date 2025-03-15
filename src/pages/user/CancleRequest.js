import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Route,Link, useHistory, useParams,Redirect } from "react-router-dom";
import { LMS_USER_BLOCK,LMS_REQUESTEDSTUDENTS,USER_STUDENTS,SEARCH_TEACHER_BY_EMAIL } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";

const CancleRequest = ({...rest}) => {
  const { teacherId } = useParams();
  const userData =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
 
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getSubscriptionrequest();
  }, []);

  const getSubscriptionrequest = async () => {
    try {
      const body = {
        student_id: userData ? userData.id : false,
        teacher_id: teacherId,
        request_from:userData ? userData.id : false,
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_USER_BLOCK, body);
      console.log(data, "data");
      if (status == 200) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      if (error.response.data.status == 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
      }
    }
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
export default CancleRequest;
