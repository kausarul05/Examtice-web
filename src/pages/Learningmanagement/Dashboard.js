import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { GET_MONTHLY_REPORT } from "../../components/Api";
import { GET_AFFILIATE_DASHBOARD } from "../../components/Api";
import Cookies from "js-cookie";
import { getTestDate } from "../../components/CommonFunction";
import Spinner from "../../components/spinner/Spinner";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const LearningmanagementDashboard = () => {
  const [reports, setReports] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [loader, setLoader] = useState(false);
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    try {
      setLoader(true);
      var user_data = JSON.parse(Cookies.get("user_data"));
      const body = {
        userId: user_data.id,
      };
      const {
        data: { status, data },
      } = await axios.post(GET_MONTHLY_REPORT, body, config);
      if (status === 200) {
        getDate(data);
        setReports(data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  function getDate(data) {
    var dates = [];
    var scores = [];
    data?.userReport
      ?.reverse()
      .map(
        (val, i) => (
          dates.push(getTestDate(val.created_at)),
          scores.push(
            Math.floor((val.totaCorrectOption / val.total_questions) * 100)
          )
        )
      );
    setReportData(dates);
    setScoreData(scores);
  }

  const getsupportlogin = async () => {
    try {
      setLoader(true);
      var user_data = JSON.parse(Cookies.get("user_data"));
      
      window.location.replace('https://examtice.com/support');
     
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  const state = {
    labels: reportData,
    datasets: [
      {
        label: "Score board",
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "#ffff",
        borderWidth: 2,
        data: scoreData,
      },
    ],
  };

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />
      <section className="dashboad-page">
        <div className="container">
          <div className="row">
         
            <div className="col-md-4">
              <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                <Link className="dash-panel" to="/lms/create-test">
                  <span className="dash-icon-round">
                    <i className="fas fa-clipboard-check" />
                  </span>
                  <br />
                  Create Test
                </Link>
              </div>
            </div>
            
            {/* <div className="col-md-4">
              <div className="dashboad-page-inner">
                <Link className="dash-panel" to="#">
                  <span className="dash-icon-round">
                    <i className="fas fa-list" />
                  </span>
                  <br />
                  Questions
                </Link>
              </div>
            </div> */}
            <div className="col-md-4">
              <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                <Link className="dash-panel" to="/lms/subscription">
                  <span className="dash-icon-round">
                  <i className="fas fa-users-cog" />
                  </span>
                  <br />
                 Subscribe Students
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                <Link className="dash-panel" to="/lms/my-account">
                  <span className="dash-icon-round">
                    <i className="fas fa-user" />
                  </span>
                  <br />
                  My Account
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                <Link className="dash-panel" to="/lms/exam">
                  <span className="dash-icon-round">
                    <i className="fas fa-book-reader" />
                  </span>
                  <br />
                  Exams
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`dashboad-page-inner ${isDarkMode ? 'dashboad-page-inner-bg-dark' : 'dashboad-page-inner-bg-light'}`}>
                <Link className="dash-panel" to="/lms/support" >
                    <span className="dash-icon-round">
                    <i className="fas fa-sms" />
                    </span>
                    <br />
                  Support
                  </Link>
              </div>
            </div>
            {/* <div className="col-md-4">
              <div className="dashboad-page-inner">
                <Link className="dash-panel" to="/lms/results">
                  <span className="dash-icon-round">
                    <i className="fas fa-wifi" />
                  </span>
                  <br />
                  Results
                </Link>
              </div>
            </div> */}
           
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LearningmanagementDashboard;
