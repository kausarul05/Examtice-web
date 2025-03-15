import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { LOGIN, REGISTER, EDIT_PROFILE } from "../Api";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, profile } from "../../features/userSlice";
import Spinner from "../spinner/Spinner";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";


const EditProfile = ({ show, closePop }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [loader, setLoader] = useState(false);
    const [updateForm, setUpdateForm] = useState({
        firstName: "",
        user_id: "",
        lastName: "",
        phoneno: "",
    });

    var user_data = JSON.parse(Cookies.get("user_data"));

    const setProfile = () => {
        updateForm.user_id = user_data.id
        updateForm.firstName = user_data.first_name
        updateForm.lastName = user_data.last_name
        updateForm.phoneno = user_data.phoneno
    }

    const customStyles = {
        overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: "9999",
            overflowY: "auto",
        },
    };
    Modal.setAppElement("#root");

    const handleEditChange = (e) => {
        setUpdateForm({
            ...updateForm,
            [e.target.name]: e.target.value,
        });
    };


    // User register
    const updateProfile = async (e) => {
        e.preventDefault();
        if (user_data.firstName == "") {
            toast.error("Please enter your first name");
            return false;
        }
        if (user_data.lastName == "") {
            toast.error("Please enter your last name");
            return false;
        }
        if (user_data.phoneno == "") {
            toast.error("Please enter your phone number");
            return false;
        } else {
            // if (!user_data.phoneno.match("[0-9]{9,15}")) {
            //   console.log(user_data.phoneno,"registerForm.phoneno")
            //   toast.error("Please enter valid phone number");
            //   return false;
            // }
        }


        const config = {
            headers: {
                Authorization: Cookies.get("token"),
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            }
        }
        const bodyParameters = new FormData();
        bodyParameters.append("user_id", "" + updateForm.user_id);
        bodyParameters.append("first_name", "" + updateForm.firstName);
        bodyParameters.append("last_name", "" + updateForm.lastName);
        bodyParameters.append("phoneno", "" + updateForm.phoneno);

        try {
            setLoader(true);
            const {
                data: { message, status, data },
            } = await axios.post(EDIT_PROFILE, bodyParameters, config);
            if (status == 200) {

                var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
                let expiryObject = {
                    expires: inTwoMinutes,
                };
                Cookies.set("user_data", JSON.stringify(data), expiryObject);
                dispatch(profile({ profile: data }));

                setLoader(false);
                toast.success(message);
                handleClose();
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


    //Handle close popup modal
    const handleClose = () => {
        closePop(false);
    };

    useEffect(() => {
        setProfile();
    }, [])




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
                        {/* <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div> */}
                        <div className="modal-body">
                            <div className="login-deatils">
                                <ul className="nav nav-tabs">
                                    <li className="active">
                                        <a className="active">
                                            Edit profile
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div >
                                <div>
                                    <div className="sign-tab-detail">
                                        <form method="post" encType='multipart/form-data'>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            placeholder="First Name"
                                                            name="firstName"
                                                            value={updateForm.firstName}
                                                            onChange={handleEditChange}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            placeholder="Last Name"
                                                            name="lastName"
                                                            value={updateForm.lastName}
                                                            onChange={handleEditChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    placeholder="Phone Number"
                                                    minLength={10}
                                                    maxLength={15}
                                                    name="phoneno"
                                                    value={updateForm.phoneno}
                                                    onChange={handleEditChange}
                                                />
                                            </div>
                                            {/* <div className="form-group">
                      <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={updateForm.password}
                        onChange={handleEditChange}
                      />
                    </div> */}

                                            {/* <input
                        type="file"
                        id="profile_photo"
                        name="profile_photo"
                        onChange={handleEditChange}
                        className="form-group"
                        accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG"
                      /> */}

                                            <div className="form-group">
                                                <button
                                                    value="UPDATE"
                                                    onClick={updateProfile}
                                                    disabled={loader}
                                                >
                                                    UPDATE{" "}{loader && "..."}
                                                    {loader && <Spinner />}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditProfile;
