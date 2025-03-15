import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GET_MONTHLY_REPORT, WITHDRAW_AMOUNT } from "../../components/Api";
import Cookies from "js-cookie";
import { getTestDate } from "../../components/CommonFunction";
import Spinner from "../../components/spinner/Spinner";
import { userProfile } from "../../features/userSlice";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";
import { Link } from "react-router-dom/cjs/react-router-dom";


const Withdraw = () => {
    const [loader, setLoader] = useState(false);
    const history = useHistory();
    const [withdrawForm, setWithdrawForm] = useState({
        bank: "",
        email: "",
        withdrawAmount: "",
        confirmPassword: "",
    });

    //  Handle withdraw amount here
    const handleWithdrawChange = (e) => {
        setWithdrawForm({
            ...withdrawForm,
            [e.target.name]: e.target.value,
        });
    };
    const userData = useSelector(userProfile).user.profile; //Getting user data from redux

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (withdrawForm.bank == "") {
            toast.error("Please enter your Bank account number");
            return false;
        }
        if (withdrawForm.email == "") {
            toast.error("Please enter your email");
            return false;
        }
        if (withdrawForm.confirmPassword == "") {
            toast.error("Please enter your password");
            return false;
        }
        if (withdrawForm.withdrawAmount == "") {
            toast.error("Please enter your withdraw amount");
            return false;
        }

        if (!!userData && userData.amount < withdrawForm.withdrawAmount) {
            toast.error("You don't have sufficient balance");
            return false;
        }

        if (withdrawForm.withdrawAmount <= 10000) {
            toast.error("Minimum balance required ");
            return false;
        }

        const config = {
            headers: {
                Authorization: Cookies.get("token"),
            },
        };

        const body = {
            bank: withdrawForm.bank,
            email: withdrawForm.email,
            withdrawAmount: withdrawForm.withdrawAmount,
            confirmPassword: withdrawForm.confirmPassword,
        };

        // Api call here 
        try {
            setLoader(true);
            const {
                data: { message, status, error_description },
            } = await axios.post(WITHDRAW_AMOUNT, body, config);
            if (status == 200) {
                setLoader(false);
                toast.success(message);
                history.push("/affiliate/dashboard");
            } else {
                setLoader(false);
                toast.error(message);
            }
        } catch (err) {
            if (err.response?.data?.status == 400) {
                toast.error(err.response?.data?.error_description);
            }
            setLoader(false);
        }
    }

    const autoReload = () => {
        // Reload the current page
        window.location.reload();
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <>
            <Header />

            <section className="e-shop-payment eshop-three">
                <div className="container">

                    <div className="pagination">
                        <span onClick={autoReload} className={`${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                            <Link to="/affiliate/dashboard">
                                <i className="fas fa-chevron-left" />
                                Back
                            </Link>
                        </span>
                    </div>

                    <div className="row d-flex align-items-center">
                        <div className="col-md-6 col-12">
                            <div className="e-shop-payment-right">
                                <h5>Withdraw Your Money</h5>
                                <form>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="bank"
                                            placeholder="Bank account number"
                                            value={withdrawForm.bank}
                                            onChange={handleWithdrawChange}

                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            value={withdrawForm.email}
                                            onChange={handleWithdrawChange}
                                        />
                                    </div>
                                    <ul>
                                        <li>
                                            <span>Available balance</span> ₦ {!!userData && userData.amount ? userData.amount : '0'}
                                        </li>
                                    </ul>
                                    <div className="widthral">
                                        {/* <p>Amount to withdraw</p> */}

                                        <div className="form-group">
                                            <label htmlFor="">Amount to withdraw</label>
                                            <input
                                                type="text"
                                                name="withdrawAmount"
                                                placeholder="Enter amount"
                                                value={withdrawForm.withdrawAmount}
                                                onChange={handleWithdrawChange}

                                            />
                                        </div>
                                        <img src="assets/images/mark.png" alt="" />

                                    </div>
                                    {/* <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                    Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                    natoque penatibus et magnis dis parturient montes, nascetur
                    ridiculus mus.
                  </p> */}
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm password"
                                            value={withdrawForm.confirmPassword}
                                            onChange={handleWithdrawChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button value="Withdraw" onClick={handleWithdraw} >Withdraw</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="house-left">
                                <img src="assets/images/house.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Withdraw;
