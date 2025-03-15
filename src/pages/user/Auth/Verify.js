import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { VERIFY_USER } from "../../../components/Api";

const Verify = () => {
  const history = useHistory();
  const { id, token } = useParams();

  useEffect(() => {
    verifyUser();
  }, []);

  //   Verify user
  const verifyUser = async () => {
    try {
        const {
            data: { message, status },
          } = await axios.get(VERIFY_USER + "/" + id + "/" + token);
       if (status == 200) {
          toast.success(message);
          history.push("/");
       }
    } catch (error) {
        if(error.response.data.status == 422){
            toast.error(error.response.data.message);
        }else{
            toast.error("Something went wrong, please try again.!");
        }
        history.push("/");
    }
  };

  return <></>;
};
export default Verify;
