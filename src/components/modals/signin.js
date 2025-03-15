import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { LOGIN, REGISTER } from "../Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, profile } from "../../features/userSlice";
import { validateEmail } from "../CommonFunction";
import { global } from "../Config";
import Spinner from "../spinner/Spinner";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import Forget from "./forget";
//import { GoogleLogin } from "react-google-login";
//import FacebookLogin from "react-facebook-login";

const Signin = ({ show, closePop }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loader, setLoader] = useState(false);
    const [isRobot, setIsRobot] = useState(false);
    const [warnpassword, setwarnpassword] = useState(false);
    const [eye, seteye] = useState(true);
    const [password, setpassword] = useState("password");
    const [type, settype] = useState(false);
    const [eye2, seteye2] = useState(true);
    const [password2, setpassword2] = useState("password");
    const [type2, settype2] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneno: "",
        password: "",
        confirmPassword: "",
        referCode: "",
    });

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
        remember: "",
    });
    const [forgetShow, setForgetShow] = useState(false);
    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };

    const config = {
        headers: {
            Authorization: Cookies.get("token"),
        },
    };
    Modal.setAppElement("#root");

    const handleRegisterChange = (e) => {
        setRegisterForm({
            ...registerForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginChange = (e) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

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
            };
            const {
                data: { message, status, data },
            } = await axios.post(LOGIN, body);
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
                handleClose();
                toast.success(message);
                setTimeout(() => {
                    dispatch(login(data.user));
                    history.push("/user/dashboard");
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

    // console.log(dispatch(profile({ profile})))

    // social login
    const responseGoogle = async (response) => {
        //console.log(response.profileObj,"wwwwwwwwwww");
        var gLogin = response.profileObj;

        try {
            setLoader(true);
            const body = {
                google_id: gLogin.googleId,
                email: gLogin.email,
                firstName: gLogin.givenName,
                profilePic: gLogin.imageUrl,
                lastName: gLogin.familyName,
            };
            const {
                data: { message, status, data },
            } = await axios.post(LOGIN, body);
            if (status == 200) {
                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                setLoader(false);
                dispatch(profile({ profile: data.user }));
                Cookies.set("token", "bearer " + data.token.access_token, expiryObject);
                Cookies.set("user_data", JSON.stringify(data.user), expiryObject);
                handleClose();
                toast.success(message);
                setTimeout(() => {
                    dispatch(login(data.user));
                    history.push("/user/dashboard");
                }, 200);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.status == 401) {
                toast.error(error.response.data.message);
            }
            // }else{
            //   toast.error("Something went wrong, please try again..!");
            // }
            setLoader(false);
        }
    };

    const responseFacebook = async (response) => {
        console.log(response.profileObj, "wwwwwwwwwww");
        var fLogin = response;

        try {
            setLoader(true);
            const body = {
                facebook_id: fLogin.id,
                email: fLogin.email,
                firstName: fLogin.name,
                profilePic: fLogin.picture.data.url,
                lastName: fLogin.name,
            };
            const {
                data: { message, status, data },
            } = await axios.post(LOGIN, body);
            if (status == 200) {
                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                setLoader(false);
                dispatch(profile({ profile: data.user }));
                Cookies.set("token", "bearer " + data.token.access_token, expiryObject);
                Cookies.set("user_data", JSON.stringify(data.user), expiryObject);
                handleClose();
                toast.success(message);
                setTimeout(() => {
                    dispatch(login(data.user));
                    history.push("/user/dashboard");
                }, 200);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.status == 401) {
                toast.error(error.response.data.message);
            }
            //  }else{
            //    toast.error("Something went wrong, please try again..!");
            //  }
            setLoader(false);
        }
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
        } 
        else {
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
        if (!isRobot) {
            toast.error("Confirm you're not a robot.");
            return false;
        }
        const body = {
            firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            email: registerForm.email,
            password: registerForm.password,
            phoneno: registerForm.phoneno,
            referCode: registerForm.referCode,
        };
        try {
            setLoader(true);
            const {
                data: { message, status, error_description },
            } = await axios.post(REGISTER, body);
            if (status == 200) {
                setLoader(false);
                toast.success(message);
                handleClose();
                handleIsRobot();
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

    // handle is Robot checkbox
    const handleIsRobot = () => setIsRobot(!isRobot);

    //Handle close popup modal
    const handleClose = () => {
        closePop(false);
        setTimeout(() => {
            // Empty login state
            setLoginForm({ email: "", password: "" });
            // Empty register state
            setRegisterForm({
                firstName: "",
                lastName: "",
                email: "",
                phoneno: "",
                password: "",
                confirmPassword: "",
            });
        }, 300);
    };

    // handle forget click
    const handleForget = (e) => {
        e.preventDefault();
        handleClose();
        setForgetShow(true);
    };

    return (
        <>
            <Modal
                isOpen={show}
                onRequestClose={handleClose}
                style={customStyles}
                contentLabel="Login Modal"
                className="register-modals"
                id="exampleModalLong"
                shouldReturnFocusAfterClose={true}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={handleClose}
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="login-deatils">
                                <ul className="nav nav-tabs">
                                    <li className="active">
                                        <a className="active" data-toggle="tab" href="#home">
                                            Sign In
                                        </a>
                                    </li>
                                    <li>
                                        <a data-toggle="tab" href="#menu1">
                                            Register
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content">
                                <div id="home" className="tab-pane fade in active show">
                                    <div className="sign-tab-detail">
                                        <form action="#">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Enter email or phone number"
                                                    name="email"
                                                    value={loginForm.email}
                                                    onChange={handleLoginChange}
                                                />
                                            </div>
                                            <div className="form-group input-text" style={{position: "relative"}}>
                                                <input
                                                    type={password}
                                                    className={`${warnpassword ? "warning" : ""} ${type ? "type_password" : ""}`}
                                                    placeholder="Password"
                                                    name="password"
                                                    value={loginForm.password}
                                                    onChange={handleLoginChange}
                                                />
                                                <i onClick={Eye} className={`fa ${eye ? "fa-eye-slash login-eye" : "fa-eye login-eye"}`}></i>
                                            </div>
                                            <div className="form-group lms-login">
                                                <input
                                                    type="checkbox"
                                                    id="remember"
                                                    name="remember"
                                                    onChange={handleLoginChange}
                                                />
                                                Remember me
                                            </div>

                                            <div className="form-group">
                                                <button
                                                    type="submit"
                                                    value="SIGN IN"
                                                    onClick={handleLogin}
                                                    disabled={loader}
                                                >
                                                    SIGN IN {loader && "..."}
                                                    {loader && <Spinner />}
                                                </button>
                                            </div>

                                            <p className="text-center font-weight-bold" style={{ display: 'none' }}>OR</p>
                                            <div className="gorm group forn-social" style={{ display: 'none' }}>
                                                {/* <GoogleLogin
                          clientId={`${global.GOOGLE_CLIENT_ID}`}
                          buttonText="Sign In with Google"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          isSignedIn={true}
                          className="google-login"
                          cookiePolicy={"single_host_origin"}
                        />
                        <FacebookLogin
                          appId={`${global.FACEBOOK_APP_ID}`}
                          autoLoad={false}
                          fields="name,email,picture"
                          callback={responseFacebook}
                          icon="fa-facebook"
                        /> */}
                                            </div>
                                            <div className="form-group forgot-pass">
                                                <Link to="#" onClick={handleForget}>
                                                    Forget your password?
                                                </Link>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div id="menu1" className="tab-pane fade">
                                    <div className="sign-tab-detail">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            placeholder="First name"
                                                            name="firstName"
                                                            value={registerForm.firstName}
                                                            onChange={handleRegisterChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            placeholder="Last name"
                                                            name="lastName"
                                                            value={registerForm.lastName}
                                                            onChange={handleRegisterChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Email address"
                                                    name="email"
                                                    value={registerForm.email}
                                                    onChange={handleRegisterChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Phone number"
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
                                                <i onClick={Eye2} className={`fa ${eye2 ? "fa-eye-slash signup-eye" : "fa-eye signup-eye"}`}></i>
                                            </div>
                                            <div className="form-group">
                                                <input
                                                    type="password"
                                                    placeholder="Confirm password"
                                                    name="confirmPassword"
                                                    value={registerForm.confirmPassword}
                                                    onChange={handleRegisterChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Refer code"
                                                    name="referCode"
                                                    value={registerForm.referCode}
                                                    onChange={handleRegisterChange}
                                                />
                                            </div>

                                            <div className="form-group lms-login">
                                                <input
                                                    type="checkbox"
                                                    id="isRobot"
                                                    name="isRobot"
                                                    defaultChecked={isRobot}
                                                    // checked={isRobot}
                                                    onClick={handleIsRobot}
                                                />
                                                I'm not a Robot
                                            </div>
                                            <div className="form-group">
                                                <button
                                                    value="REGISTER"
                                                    onClick={register}
                                                    disabled={loader}
                                                >
                                                    REGISTER {loader && "..."}
                                                    {loader && <Spinner />}
                                                </button>
                                            </div>

                                            <p className="text-center font-weight-bold" style={{ display: 'none' }}>OR</p>
                                            <div className="gorm group forn-social" style={{ display: 'none' }}>
                                                {/* <GoogleLogin
                          clientId={`${global.GOOGLE_CLIENT_ID}`}
                          buttonText="Sign In with Google"
                          autoLoad={false}
                          className="google-login"
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          cookiePolicy={"single_host_origin"}
                        />

                        <FacebookLogin
                          appId={`${global.FACEBOOK_APP_ID}`}
                          autoLoad={false}
                          fields="name,email,picture"
                          callback={responseFacebook}
                          icon="fa-facebook"
                        /> */}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Forget show={forgetShow} close={() => setForgetShow(false)} />
        </>
    );
};

export default Signin;
