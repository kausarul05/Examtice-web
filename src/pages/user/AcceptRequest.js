import React, { useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Route,useParams,Redirect } from "react-router-dom";
import { LMS_USER_ACCEPT } from "../../components/Api";
import Cookies from "js-cookie";


const AcceptRequest = ({...rest}) => {
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

  //   Verify user
  
  const getSubscriptionrequest = async () => {
    try {
      const body = {
        student_id: userData ? userData.id : false,
        teacher_id: teacherId,
        request_from:userData ? userData.id : false,
      };
      const {
        data: { message, status, data },
      } = await axios.post(LMS_USER_ACCEPT, body);
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
export default AcceptRequest;
