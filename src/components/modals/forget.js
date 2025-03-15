import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { validateEmail } from "../CommonFunction";
import Spinner from "../spinner/Spinner";
import { FORGET } from "../Api";
import axios from "axios";



const Forget = ({ show, close }) => {
    const [email, setEmail] = useState("");
    const [loader, setLoader] = useState(false);


    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };
    Modal.setAppElement("#root");


    const handleForget = async (e) => {
        e.preventDefault();
        if (email == "") {
            toast.error("Please enter your email");
            return false;
        } else {
            if (!validateEmail(email)) {
                toast.error("Please enter valid email");
                return false;
            }
        }
        try {
            setLoader(true);
            const body = {
                email: email,
            };
            const {
                data: { message, status },
            } = await axios.post(FORGET, body);
            if (status == 200) {
                setLoader(false);
                toast.success(message);
                closeModal();
            }
        } catch (error) {
            if (error.response?.data?.status == 422) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong, please try again..!");
            }
            setLoader(false);
        }
    }

    // close modal and clear state
    function closeModal(){
        setTimeout(() => {
            close();
            setEmail("");
        }, 400);
    }

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
                                        Forget password
                  </a>
                                </li>

                            </ul>
                        </div>

                        <div className="sign-tab-detail">

                            <form action="#">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <button
                                        type="submit"
                                        value="Forget password"
                                        onClick={handleForget}
                                        disabled={loader}
                                    >
                                        {loader && <Spinner />}
                                        Forget password{" "}{loader && '...'}
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

export default Forget;