import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useHistory } from "react-router-dom";
import { AFFILIATE_TRANSACTION } from "../../components/Api";
import Cookies from "js-cookie";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Spinner from "../../components/spinner/Spinner";
import { getTestDate } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const Transaction = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [transactions, setTransactions] = useState([]);
  var userData =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));

  const config = {
    headers: {
      Authorization: Cookies.get("token"),
    },
  };

  useEffect(() => {
    getTransaction();
  }, []);

  //   get all Transaction that user has been done
  const getTransaction = async () => {
    try {
      setLoader(true);
      const {
        data: { message, status, data },
      } = await axios.get(AFFILIATE_TRANSACTION, config);
      if (status == 200) {
        setLoader(false);
        setTransactions(data);
      } else {
        setLoader(false);
        toast.error(message);
      }
    } catch (error) {
      setLoader(false);
      if (error?.response?.data?.status == 422) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong, please try again.!");
      }
    }
  };

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />
      <section className="free-testing-sec">
        <div className="container">
          <div className={`pagination ${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
            <span>
              <Link to="/affiliate/dashboard">
                <i className="fas fa-chevron-left" />
                Transaction
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
                <table className={` ${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                  <thead>
                    <tr>
                      <th scope="col">S.no</th>
                      <th scope="col">Email</th>
                      <th scope="col">Account no.</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Requested at</th>
                      <th scope="col">Status</th>
                      {/* <th scope="col" style={{ width: "10%" }}>
                        View report
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length ? (
                      transactions.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <th scope="row"> {item.email}</th>
                          <th scope="row"> {item.bank}</th>
                          <th scope="row">₦ {item.amount}</th>
                          <td>{getTestDate(item.created_at)}</td>
                          <td>
                            {item.status == 0 ? (
                              <span className="badge-warning badge mr-2">
                                Pending
                              </span>
                            ) : item.status == 1 ? (
                              <span className="badge-success badge mr-2">
                                Approved
                              </span>
                            ) : (
                              <span className="badge-danger badge mr-2">
                                Cancelled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>No transaction found..!</td>
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
export default Transaction;
