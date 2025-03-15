import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import Spinner from "../spinner/Spinner";
import { FORGET, RESET_USER_PASSWORD } from "../Api";
import axios from "axios";


const Reset = ({ show, close , token}) => {
    const [resetForm, setResetForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loader, setLoader] = useState(false);
    const history = useHistory();

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };
    Modal.setAppElement("#root");

    // handle reset password
    const handleReset = async (e) => {
        e.preventDefault();
        if (resetForm.password == "") {
            toast.error("Please enter your password");
            return false;
        }
        if (resetForm.confirmPassword == "") {
            toast.error("Please enter your confirm password");
            return false;
        } else {
            if (resetForm.password != resetForm.confirmPassword) {
                toast.error("Passwords don't match.");
                return false;
            }
        }
        try {
            setLoader(true);
            const body = {
                token: token.reset,
                password: resetForm.password,
            };
            const {
                data: { message, status },
            } = await axios.post(RESET_USER_PASSWORD, body);
            if (status == 200) {
                setLoader(false);
                toast.success(message);
                closeModal();
            }
        } catch (error) {
            console.log(error.response);
            if (error.response?.data?.status == '422') {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }
    }

    // close modal and clear state
    function closeModal() {
        setTimeout(() => {
            history.push("/");
            close();
            setResetForm({
                password: "",
                confirmPassword: "",
            });
        }, 400);
    }

    // handle on change
    const handleResetChange = (e) => {
        setResetForm({
            ...resetForm,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <Modal
            isOpen={show}
            //onRequestClose={() => setTestWarning(false)}
            style={customStyles}
            contentLabel="Finish test modal"
            className="register-modals"
            id="exampleModalLong"
            shouldReturnFocusAfterClose={false}
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={closeModal}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="login-deatils">
                            <ul className="nav nav-tabs">
                                <li className="active">
                                    <a className="active" data-toggle="tab" href="#">
                                        Reset password
                  </a>
                                </li>

                            </ul>
                        </div>

                        <div className="sign-tab-detail">

                            <form action="#">
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        value={resetForm.password}
                                        onChange={handleResetChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        placeholder="Confirm password"
                                        name="confirmPassword"
                                        value={resetForm.confirmPassword}
                                        onChange={handleResetChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <button
                                        type="submit"
                                        value="Forget password"
                                        onClick={handleReset}
                                        disabled={loader}
                                    >
                                        {loader && <Spinner />}
                                        Reset password{" "}{loader && '...'}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    )
};

export default Reset;