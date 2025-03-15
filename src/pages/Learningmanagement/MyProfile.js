import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditProfile from "../../components/modals/edit";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { profile, userProfile } from "../../features/userSlice";
import Cookies from "js-cookie";
import Spinner from "../../components/spinner/Spinner";
import { toast } from "react-toastify";
import { EDIT_PROFILE } from "../../components/Api";
import { global } from "../../components/Config";
import axios from "axios";
import { returnImageType } from "../../components/CommonFunction";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";


const MyProfile = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const userData = useSelector(userProfile).user.profile;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const config = {
    headers: {
      Authorization: Cookies.get("token"),
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    }
  };
  // const userData = JSON.parse(Cookies.get("user_data"));
  const [updatePassword, setUpdatePassword] = useState({
    password: "",
    confirmPassword: "",
  });


  const handleCloseModal = () => {
    setOpen(false);
  };


  const handleEditChange = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.name]: e.target.value,
    });
  };

  // handlePasswordChange
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (updatePassword.password == "") {
      toast.error("Please enter your password");
      return false;
    }
    if (updatePassword.confirmPassword == "") {
      toast.error("Please enter your confirm password");
      return false;
    } else {
      if (updatePassword.password != updatePassword.confirmPassword) {
        toast.error("Passwords don't match.");
        return false;
      }
    }
    try {
      const bodyParameters = {
        user_id: !!userData && userData.id,
        first_name: !!userData && userData.first_name,
        last_name: !!userData && userData.last_name,
        password: updatePassword.password
      }
      setLoader(true);
      const {
        data: { message, status },
      } = await axios.post(EDIT_PROFILE, bodyParameters, config);
      if (status == 200) {
        setLoader(false);
        toast.success(message);
        setUpdatePassword({
          password: "",
          confirmPassword: "",
        });
      } else {
        setLoader(false);
        toast.error("Something went wrong, please try again..!");
        //        toast.error(error_description);
      }
    } catch (err) {
      if (err.response?.data?.status == 400) {
        toast.error(err.response?.data?.error_description);
      }
      setLoader(false);
    }

  }

  // Onchange proile image
  const uploadProfile = async (e) => {
    try {
      setLoader(true);
      const body = new FormData();
      body.append("user_id", "" + !!userData && userData.id);
      body.append("first_name", "" + !!userData && userData.first_name);
      body.append("last_name", "" + !!userData && userData.last_name);
      body.append("phoneno", "" + !!userData && userData.phoneno);
      body.append('image', e.target.files[0]);

      const {
        data: { status, data, message },
      } = await axios.post(EDIT_PROFILE, body, config);
      if (status == 200) {
        var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
        let expiryObject = {
          expires: inTwoMinutes,
        };
        Cookies.set("user_data", JSON.stringify(data), expiryObject);
        dispatch(profile({ profile: data }));

        setLoader(false);
        toast.success(message);
      }else{
        setLoader(false);
        toast.error(message);

      }
    } catch (err) {
      console.log(err)
      if (err.response?.data?.status == 400) {
        toast.error(err.response?.data?.error_description);
      } else {
        toast.error("Something went wrong, please try again..!");
      }
      setLoader(false);
    }


  }

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/lms/dashboard" className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                My Account
              </Link>
            </span>
          </div>
          <div className="main-body">
            <div className="row gutters-sm">
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center profile-img">
                      <img
                        src={
                          !!userData?.image ?  
                          returnImageType(userData?.image):
                            "assets/images/no-profile.png"
                        }
                        alt="Admin"
                        className="rounded-circle"
                        width={150}
                      />
                      {loader && <Spinner />}
                      <div className="file btn btn-lg btn-primary">
                        Change Photo
                        <input type="file" name="file" accept="image/*" onChange={uploadProfile} />
                      </div>

                      <div className="mt-3">
                        <h4 className=" my_acount">
                          {!!userData && userData.first_name} {!!userData && userData.last_name}
                        </h4>
                        <p className="text-secondary mb-1">
                          {!!userData && userData.email}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="tabbable-line">
                      <ul className="nav nav-tabs text-dark">
                        <li>
                          <a
                            href="#tab_default_1"
                            data-toggle="tab"
                            className="active"
                          >
                            User Detail{" "}
                          </a>
                        </li>
                        <li>
                          <a href="#tab_default_2" data-toggle="tab">
                            Change password{" "}
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active" id="tab_default_1">
                          <div className="row">
                            <div className="col-sm-3">
                              <h5 className="mb-0 my_acount">Full Name</h5>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {!!userData && userData.first_name} {!!userData && userData.last_name}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h5 className="mb-0 my_acount">Email</h5>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {!!userData && userData.email}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-3">
                              <h5 className="mb-0 my_acount">Phone</h5>
                            </div>
                            <div className="col-sm-9 text-secondary">
                              {!!userData && userData.phoneno}
                            </div>
                          </div>
                          <hr />
                          <div className="row">
                            <div className="col-sm-12">
                              <Link
                                className="common-btn"
                                to="#"
                                onClick={() => setOpen(true)}
                              >
                                Edit
                                
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="tab-pane" id="tab_default_2">
                          <h4 style={{color: '#000'}}> Change password </h4>
                          <div className="sign-tab-detail col-12">
                            <form action="#">
                              <div className="form-group">
                                <input
                                  type="password"
                                  placeholder="Password"
                                  name="password"
                                  value={updatePassword.password}
                                  onChange={handleEditChange}
                                />
                              </div>
                              <div className="form-group">
                                <input
                                  type="password"
                                  placeholder="Confim password"
                                  name="confirmPassword"
                                  value={updatePassword.confirmPassword}
                                  onChange={handleEditChange}
                                />
                              </div>

                              <div className="form-group">
                                {loader && <Spinner />}
                                <button
                                  type="submit"
                                  className="common-btn"
                                  onClick={handlePasswordChange}
                                >
                                  Change password
                                {loader && "..."}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EditProfile show={open} closePop={handleCloseModal} />
      </section>

      <Footer />
    </>
  );
};

export default MyProfile;
