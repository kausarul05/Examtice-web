import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    LOGIN_AFFILIATE,
    REGISTER,
    REGISTER_AFFILIATE,
} from "../../components/Api";
import { validateEmail } from "../../components/CommonFunction";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import Spinner from "../../components/spinner/Spinner";
import { login, profile } from "../../features/userSlice";

const SignIn = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loader, setLoader] = useState(false);
    const [warnpassword, setwarnpassword] = useState(false);
    const [eye, seteye] = useState(true);
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [eye2, seteye2] = useState(true);
    const [password2, setpassword2] = useState("password");
    const [type2, settype2] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        affiliate_login_type: 5,
    });

    const Eye = () => {
        if (password == "password") {
            setpassword("text");
            seteye(false);
            settype(true);
        }
        else {
            setpassword("password");
            seteye(true);
            settype(false);
        }
    }

    const Eye2 = () => {
        if (password2 == "password") {
            setpassword2("text");
            seteye2(false);
            settype2(true);
        }
        else {
            setpassword2("password");
            seteye2(true);
            settype2(false);
        }
    }

    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneno: "",
        password: "",
        confirmPassword: "",
        affiliate_type: 5,
        referral_code: "",
    });

    const handleRegisterChange = (e) => {
        if (e.target.name == "affiliate_type" && e.target.value == 5) {
            setTimeout(() => {
                setRegisterForm({
                    ...registerForm,
                    affiliate_type: 5,
                    referral_code: "",
                });
            }, 200);
        }

        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value,
        });
    };

    // User register
    const register = async (e) => {
        e.preventDefault();
        if (registerForm.firstName == "") {
            toast.error("Please enter your first name");
            return false;
        }
        if (registerForm.lastName == "") {
            toast.error("Please enter your last name");
            return false;
        }
        if (registerForm.email == "") {
            toast.error("Please enter your email");
            return false;
        } else {
            if (!validateEmail(registerForm.email)) {
                toast.error("Please enter valid email");
                return false;
            }
        }
        if (registerForm.phoneno == "") {
            toast.error("Please enter your phone number");
            return false;
        } else {
            if (!registerForm.phoneno.match("[0-9]{9,15}")) {
                toast.error("Please enter valid phone number");
                return false;
            }
        }
        if (registerForm.password == "") {
            toast.error("Please enter your password");
            return false;
        }
        if (registerForm.confirmPassword == "") {
            toast.error("Please enter your confirm password");
            return false;
        } else {
            if (registerForm.password != registerForm.confirmPassword) {
                toast.error("Passwords don't match.");
                return false;
            }
        }
        if (registerForm.affiliate_type == "") {
            toast.error("Please choose affiliate type");
            return false;
        }

        const body = {
            firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            email: registerForm.email,
            password: registerForm.password,
            phoneno: registerForm.phoneno,
            affiliate_type: registerForm.affiliate_type,
            referral_code: registerForm.referral_code,
            phoneno: registerForm.phoneno,
        };
        try {
            setLoader(true);
            const {
                data: { message, status, error_description },
            } = await axios.post(REGISTER_AFFILIATE, body);
            if (status == 200) {
                setLoader(false);
                toast.success(message);
                history.push("/");
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
    };

    //   Affiliate Login

    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };
    const config = {
        headers: {
            Authorization: Cookies.get("token"),
        },
    };
    // Login user
    const handleLogin = async (e) => {
        e.preventDefault();
        if (loginForm.email == "") {
            toast.error("Please enter your email or phone number");
            return false;
        }
        if (loginForm.password == "") {
            toast.error("Please enter your password");
            return false;
        }
        if (loginForm.affiliate_login_type == "") {
            toast.error("Please choose affiliate type");
            return false;
        }
        try {
            // const body2 = {
            //   _token:"jOXiu1ib9sy95hCp4xgGsC82736bPUtYj4ufp5Zs",
            //   email:loginForm.email,
            //   password:loginForm.password,
            // };
            // const {
            //   data: { status2, data2 },
            // } = await axios.post('https://examtice.com/support/login', body2, config);
            //setLoginForm({});
            setLoader(true);
            const body = {
                login: loginForm.email,
                password: loginForm.password,
                affiliate_type: loginForm.affiliate_login_type,
            };
            const {
                data: { message, status, data },
            } = await axios.post(LOGIN_AFFILIATE, body);
            if (status == 200) {
                //var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                var inTwoMinutes = new Date(
                    new Date().getTime() + 60 * 60 * 24 * 1000 * 7
                ); // 7 days
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                setLoader(false);
                dispatch(profile({ profile: data.user }));
                Cookies.set("token", "bearer " + data.token.access_token, expiryObject);
                Cookies.set("user_data", JSON.stringify(data.user), expiryObject);

                toast.success(message);
                setTimeout(() => {
                    dispatch(login(data.user));
                    history.push("/affiliate/dashboard");
                }, 200);
            }
        } catch (error) {
            if (error.response?.data?.status == 401) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }
    };

    return (
        <>
            <Header />
            {/* <section className="inner-banner">
        {" "}
        <img src="assets/images/affiliate-banner.jpg" alt="" />
        <div className="inner-banner-overlay">
          <h2>Affiliate Sign-In </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus
            mus.Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor
          </p>
        </div>
      </section> */}
            <section className="become-affilated eshop">
                <div className="container">
                    <h2 className="page-heading">Affiliate Sign-In </h2>
                </div>
            </section>
            <section className="become-affilated affiliate_signin">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card">
                        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item text-center">
                                {" "}
                                <a
                                    className="nav-link active btl"
                                    id="pills-home-tab"
                                    data-toggle="pill"
                                    href="#pills-home"
                                    role="tab"
                                    aria-controls="pills-home"
                                    aria-selected="true"
                                >
                                    Login
                                </a>{" "}
                            </li>
                            <li className="nav-item text-center">
                                {" "}
                                <a
                                    className="nav-link btr"
                                    id="pills-profile-tab"
                                    data-toggle="pill"
                                    href="#pills-profile"
                                    role="tab"
                                    aria-controls="pills-profile"
                                    aria-selected="false"
                                >
                                    Signup
                                </a>{" "}
                            </li>
                        </ul>
                        <div className="tab-content register-modals" id="pills-tabContent">
                            <div
                                className="tab-pane fade show active sign-tab-detail"
                                id="pills-home"
                                role="tabpanel"
                                aria-labelledby="pills-home-tab"
                            >
                                <div className="form px-4 pt-5">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter email or phone number"
                                            name="email"
                                            value={loginForm.email}
                                            onChange={handleLoginChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type={password}
                                            className={`${warnpassword ? "warning" : ""} ${type ? "type_password" : ""}`}
                                            placeholder="Password"
                                            name="password"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                        />
                                        <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash aff-login-eye" : "fa-eye aff-login-eye"}`}></i>
                                    </div>
                                    <div className="form-check-inline" style={{ display: 'none' }}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="affiliate_login_type"
                                            htmlFor="agent"
                                            value={"5"}
                                            checked={
                                                loginForm.affiliate_login_type == 5 ? "checked" : "checked"
                                            }
                                            onChange={handleLoginChange}
                                        />
                                        <label className="form-check-label-inline" htmlFor="agent">
                                            Agent
                                        </label>
                                    </div>
                                    <div className="form-check-inline" style={{ display: 'none' }}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="affiliate_login_type"
                                            htmlFor="partner"
                                            value={"6"}
                                            checked={
                                                loginForm.affiliate_login_type == 6 ? "checked" : ""
                                            }
                                            onChange={handleLoginChange}
                                        />
                                        <label
                                            htmlFor="partner"
                                            className="form-check-label-inline"
                                        >
                                            Partner
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <button
                                            type="submit"
                                            value="SIGN IN"
                                            className="btn btn-dark btn-block"
                                            onClick={handleLogin}
                                            disabled={loader}
                                        >
                                            SIGN IN {loader && "..."}
                                            {loader && <Spinner />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade sign-tab-detail"
                                id="pills-profile"
                                role="tabpanel"
                                aria-labelledby="pills-profile-tab"
                            >
                                <div className="form px-4">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={registerForm.firstName}
                                                    className="form-control"
                                                    placeholder="First name"
                                                    onChange={handleRegisterChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={registerForm.lastName}
                                                    className="form-control"
                                                    placeholder="Last name"
                                                    onChange={handleRegisterChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerForm.email}
                                            className="form-control"
                                            placeholder="Email"
                                            onChange={handleRegisterChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Phone number"
                                            className="form-control"
                                            minLength={10}
                                            maxLength={15}
                                            name="phoneno"
                                            value={registerForm.phoneno}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type={password2}
                                            className={`${warnpassword ? "warning" : ""} ${type2 ? "type_password" : ""}`}
                                            placeholder="Password"
                                            name="password"
                                            value={registerForm.password}
                                            onChange={handleRegisterChange}
                                        />
                                        <i onClick={Eye2} className={`fa ${eye2 ? "fa-eye-slash aff-signup-eye" : "fa-eye aff-signup-eye"}`}></i>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Confirm password"
                                            name="confirmPassword"
                                            value={registerForm.confirmPassword}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-check-inline" style={{ display: 'none' }}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="affiliate_type"
                                            value={"5"}
                                            checked={
                                                registerForm.affiliate_type == 5 ? "checked" : ""
                                            }
                                            onChange={handleRegisterChange}
                                        />
                                        <label className="form-check-label-inline">Agent</label>
                                    </div>
                                    <div className="form-check-inline" style={{ display: 'none' }}>
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="affiliate_type"
                                            value={"6"}
                                            checked={
                                                registerForm.affiliate_type == 6 ? "checked" : ""
                                            }
                                            onChange={handleRegisterChange}
                                        />
                                        <label className="form-check-label-inline">Partner</label>
                                    </div>
                                    {!!registerForm.affiliate_type &&
                                        registerForm.affiliate_type == 6 ? (
                                        <input
                                            type="text"
                                            name="referral_code"
                                            className="form-control"
                                            placeholder="Enter referal code"
                                            value={registerForm.referral_code}
                                            onChange={handleRegisterChange}
                                        />
                                    ) : (
                                        ""
                                    )}
                                    <div className="form-group">
                                        <button
                                            className="btn btn-dark btn-block"
                                            value="REGISTER"
                                            onClick={register}
                                            disabled={loader}
                                        >
                                            REGISTER {loader && "..."}
                                            {loader && <Spinner />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default SignIn;
