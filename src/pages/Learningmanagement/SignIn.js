import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
    LOGIN_LMS,
    REGISTER,
    REGISTER_LMS,
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
        learningmanagement_login_type: "",
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
        learningmanagement_type: "",
        referral_code: "",
    });

    const handleRegisterChange = (e) => {
        if (e.target.name == "learningmanagement_type" && e.target.value == 8) {
            setTimeout(() => {
                setRegisterForm({
                    ...registerForm,
                    learningmanagement_type: 8,
                    //referral_code: "",
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
        if (registerForm.learningmanagement_type == "") {
            toast.error("Please choose learningmanagement type");
            return false;
        }

        const body = {
            firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            email: registerForm.email,
            password: registerForm.password,
            phoneno: registerForm.phoneno,
            learningmanagement_type: registerForm.learningmanagement_type,
            referral_code: registerForm.referral_code,
            phoneno: registerForm.phoneno,
        };
        try {
            setLoader(true);
            const {
                data: { message, status, error_description },
            } = await axios.post(REGISTER_LMS, body);
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
        if (loginForm.learningmanagement_login_type == "") {
            toast.error("Please choose Learning Management System type");
            return false;
        }
        try {
            //setLoginForm({});
            // const body2 = {
            //   _token:"jOXiu1ib9sy95hCp4xgGsC82736bPUtYj4ufp5Zs",
            //   email:loginForm.email,
            //   password:loginForm.password,
            // };
            // const {
            //   data: { status2, data2 },
            // } = await axios.post('https://examtice.com/support/login', body2, config);

            setLoader(true);
            const body = {
                login: loginForm.email,
                password: loginForm.password,
                learningmanagement_type: loginForm.learningmanagement_login_type,
            };
            const {
                data: { message, status, data },
            } = await axios.post(LOGIN_LMS, body);
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
                    history.push("/lms/dashboard");
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
            <section className="become-affilated eshop">
                <div className="container">
                    <h2 className="page-heading">Learning Management System Sign-In </h2>
                </div>
            </section>
            <section className="become-affilated learningmanagement_signin">
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
                                </a>
                                {" "}
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
                                    <div className="form-check-inline lms-login">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="learningmanagement_login_type"
                                            id="teacher"
                                            value={"7"}
                                            checked={
                                                loginForm.learningmanagement_login_type == 7 ? "checked" : ""
                                            }
                                            onChange={handleLoginChange}
                                        />
                                        <label className="form-check-label-inline label-color" htmlFor="teacher">
                                            Teacher
                                        </label>
                                    </div>
                                    <div className="form-check-inline lms-login">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="learningmanagement_login_type"
                                            id="parent"
                                            value={"8"}
                                            checked={
                                                loginForm.learningmanagement_login_type == 8 ? "checked" : ""
                                            }
                                            onChange={handleLoginChange}
                                        />
                                        <label
                                            htmlFor="parent"
                                            className="form-check-label-inline"
                                        >
                                            Parent
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
                                            type="phone"
                                            // type="text"
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
                                            // type="password"
                                            placeholder="Confirm password"
                                            name="confirmPassword"
                                            value={registerForm.confirmPassword}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-check-inline lms-login">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="learningmanagement_type"
                                            value={"7"}
                                            id="reg_teacher"
                                            checked={
                                                registerForm.learningmanagement_type == 7 ? "checked" : ""
                                            }
                                            onChange={handleRegisterChange}
                                        />
                                        <label className="form-check-label-inline" htmlFor="reg_teacher">Teacher</label>
                                    </div>
                                    <div className="form-check-inline lms-login">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            name="learningmanagement_type"
                                            value={"8"}
                                            id="reg_parents"
                                            checked={
                                                registerForm.learningmanagement_type == 8 ? "checked" : ""
                                            }
                                            onChange={handleRegisterChange}
                                        />
                                        <label className="form-check-label-inline" htmlFor="reg_parents">Parent</label>
                                    </div>
                                    {/*!!registerForm.learningmanagement_type &&
                  registerForm.learningmanagement_type == 8 ? (
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
                  )*/}
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
