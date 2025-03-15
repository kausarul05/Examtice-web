import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PAYMENT_VERIFY, VERIFY_USER } from "../../../components/Api";
import { useLocation } from "react-router-dom";
import "./callbackCss.css";
import Cookies from "js-cookie";

const Callback = () => {
  const history = useHistory();
  const { id, token } = useParams();
  const search = useLocation().search;
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    verifyTransaction();
    const id = new URLSearchParams(search).get("reference");
    console.log(id); //12345
  }, []);

  //   Verify user Transaction
  const verifyTransaction = async () => {
    try {
      const body = {
        reference: new URLSearchParams(search).get("reference"),
        planId: localStorage.getItem("planId"),
      };
      const {
        data: { message, status },
      } = await axios.post(PAYMENT_VERIFY, body, config);
      if (status == 200) {
        toast.success(message);
        history.push("/user/subscription");
        localStorage.removeItem("planId");
      } else {
        toast.error(message);
        history.push("/user/dashboard");
        localStorage.removeItem("planId");
      }
    } catch (error) {
      if (error?.response?.data?.status == 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
      }
      history.push("/user/dashboard");
      localStorage.removeItem("planId");
    }
  };

  return (
    <>
      <div className="load">
        <div className="alert_msg">
          <span>Processing... please wait!</span>
          <p>[Please do not refresh and do not press back button.]</p>
        </div>
        <div className="preloader-js-container">
          <div className="shadow" />
          <div className="preloader-js">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </>
  );
};
export default Callback;
