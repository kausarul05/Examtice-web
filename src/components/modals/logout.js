import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import Modal from "react-modal";


const Logout = ({ show, yesLogout, noLogout }) => {

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            //display: "flex",
            zIndex: "9999",
            overflowY: "auto",
        },
    };
    Modal.setAppElement("#root");

    const handleLogout = (e) => {
        e.preventDefault();
        yesLogout();
    }

    return (
        <Modal
            isOpen={show}
            //onRequestClose={() => setTestWarning(false)}
            style={customStyles}
            contentLabel="Finish test modal"
            className="logout-modals"
            id="exampleModalLong"
            shouldReturnFocusAfterClose={false}
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="payment-sucess">
                            <img src="assets/images/warning.png" alt="" />
                            <p>Do you really want to <span>log out </span>?</p>
                            <div className="row">
                                <a href="#" onClick={handleLogout}>
                                    Yes
                                </a>
                                <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    noLogout()
                                }}>
                                    No
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>

    )
};

export default Logout;