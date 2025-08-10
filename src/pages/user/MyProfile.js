import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EditProfile from '../../components/modals/edit'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { profile, userProfile } from '../../features/userSlice'
import Cookies from 'js-cookie'
import Spinner from '../../components/spinner/Spinner'
import { toast } from 'react-toastify'
import { EDIT_PROFILE, GET_RESET_GRAPH } from '../../components/Api'
import Modal from 'react-modal'
import { global } from '../../components/Config'
import axios from 'axios'
import { returnImageType } from '../../components/CommonFunction'
import { ThemeContext } from '../../ThemeContaxt/ThemeContaxt'

const MyProfile = () => {
  const userData = useSelector(userProfile).user.profile
  const dispatch = useDispatch()

  const [open, setOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [password, setPassword] = useState("")
  const [loader, setLoader] = useState(false)
  const [resetGrapth, setResetGrapth] = useState(false)
  const config = {
    headers: {
      Authorization: Cookies.get('token'),
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  }

  const config2 = {
    headers: {
      Authorization: Cookies.get('token')
    }
  }
  // const userData = JSON.parse(Cookies.get("user_data"));
  const [updatePassword, setUpdatePassword] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleCloseModal = () => {
    setOpen(false)
  }

  const handleEditChange = e => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.name]: e.target.value
    })
  }

  // handlePasswordChange
  const handlePasswordChange = async e => {
    e.preventDefault()
    if (updatePassword.password == '') {
      toast.error('Please enter your password')
      return false
    }
    if (updatePassword.confirmPassword == '') {
      toast.error('Please enter your confirm password')
      return false
    } else {
      if (updatePassword.password != updatePassword.confirmPassword) {
        toast.error("Passwords don't match.")
        return false
      }
    }
    try {
      const bodyParameters = {
        user_id: !!userData && userData.id,
        first_name: !!userData && userData.first_name,
        last_name: !!userData && userData.last_name,
        password: updatePassword.password
      }
      setLoader(true)
      const {
        data: { message, status }
      } = await axios.post(EDIT_PROFILE, bodyParameters, config)
      if (status == 200) {
        setLoader(false)
        toast.success(message)
        setUpdatePassword({
          password: '',
          confirmPassword: ''
        })
      } else {
        setLoader(false)
        toast.error('Something went wrong, please try again..!')
        //        toast.error(error_description);
      }
    } catch (err) {
      if (err.response?.data?.status == 400) {
        toast.error(err.response?.data?.error_description)
      }
      setLoader(false)
    }
  }

  // Onchange proile image
  const uploadProfile = async e => {
    try {
      setLoader(true)
      const body = new FormData()
      body.append('user_id', '' + !!userData && userData.id)
      body.append('first_name', '' + !!userData && userData.first_name)
      body.append('last_name', '' + !!userData && userData.last_name)
      body.append('phoneno', '' + !!userData && userData.phoneno)
      body.append('image', e.target.files[0])

      const {
        data: { status, data, message }
      } = await axios.post(EDIT_PROFILE, body, config)
      if (status == 200) {
        var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000)
        let expiryObject = {
          expires: inTwoMinutes
        }
        Cookies.set('user_data', JSON.stringify(data), expiryObject)
        dispatch(profile({ profile: data }))

        setLoader(false)
        toast.success(message)
      } else {
        setLoader(false)
        toast.error(message)
      }
    } catch (err) {
      console.log(err)
      if (err.response?.data?.status == 400) {
        toast.error(err.response?.data?.error_description)
      } else {
        toast.error('Something went wrong, please try again..!')
      }
      setLoader(false)
    }
  }

  // reset button action
  const handleResetGraph = async () => {
    try {
      setLoader(true)
      setResetGrapth(true)
    } catch (error) {
      setLoader(false)
      // console.log(error)
    }
  }

  const handleConfirmReset = async () => {
    try {
      setLoader(true)
      var user_data = JSON.parse(Cookies.get('user_data'))
      const body = {
        userId: user_data.id
      }
      const {
        data: { status, data }
      } = await axios.post(GET_RESET_GRAPH, body, config2)
      //console.log(status)
      if (status == 200) {
        // console.log('test')
        setLoader(false)
        setResetGrapth(false)
        window.location.reload()
      }
    } catch (error) {
      setLoader(false)
      console.log(error)
    }
  }

  const handleDeleteProfile = async () => {
    // try {
    setLoader(true)
    var user_data = JSON.parse(Cookies.get('user_data'))
    const body = {
      userId: user_data.id,
      password : "password",
    }
    // console.log(body)
    const {
      data: { status, data }
    } = await axios.post(
      `https://www.examtice.com/backend/api/delete_profile?userId=${body.userId}&password=${password}`,
      body,
      config
    )
    // console.log(data)
    
    if (data?.success) {
      window.location("https://www.examtice.com/")
    } 
    // } catch (error) {
    //   setLoader(false)
    //   console.log(error)
    // }
  }

//   console.log(password)

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: '9999',
      overflowY: 'auto'
    }
  }

  const { isDarkMode } = useContext(ThemeContext)

  return (
    <>
      <Header />

      <section className='free-testing-sec'>
        <div className='container'>
          <div
            className={`pagination ${
              isDarkMode ? 'text_color_light' : 'text_color_dark'
            }`}
          >
            <span>
              <Link to='/user/dashboard'>
                <i className='fas fa-chevron-left' />
                My Account
              </Link>
            </span>
          </div>
          <div className='main-body'>
            <div className='row gutters-sm'>
              <div className='col-md-4 mb-3'>
                <div className='card'>
                  <div className='card-body'>
                    <div className='d-flex flex-column align-items-center text-center profile-img'>
                      <img
                        src={
                          !!userData?.image
                            ? returnImageType(userData?.image)
                            : 'assets/images/no-profile.png'
                        }
                        alt='Admin'
                        className='rounded-circle'
                        width={150}
                      />
                      {loader && <Spinner />}
                      <div className='file btn btn-lg btn-primary'>
                        Change Photo
                        <input
                          type='file'
                          name='file'
                          accept='image/*'
                          onChange={uploadProfile}
                        />
                      </div>

                      <div className='mt-3 my_acount'>
                        <h4>
                          {!!userData && userData.first_name}{' '}
                          {!!userData && userData.last_name}
                        </h4>
                        <p className='text-secondary mb-1'>
                          {!!userData && userData.email}
                        </p>
                        <button
                          onClick={handleResetGraph}
                          className='btn btn-danger btn-md mt-3'
                        >
                          Reset Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-md-8'>
                <div className='card mb-3'>
                  <div className='card-body'>
                    <div className='tabbable-line'>
                      <ul className='nav nav-tabs'>
                        <li>
                          <a
                            href='#tab_default_1'
                            data-toggle='tab'
                            className='active'
                          >
                            User Detail{' '}
                          </a>
                        </li>
                        <li>
                          <a href='#tab_default_2' data-toggle='tab'>
                            Change password{' '}
                          </a>
                        </li>
                      </ul>
                      <div className='tab-content'>
                        <div className='tab-pane active' id='tab_default_1'>
                          <div className='row'>
                            <div className='col-sm-3'>
                              <h5 className='mb-0 my_acount'>Full Name</h5>
                            </div>
                            <div className='col-sm-9 text-secondary'>
                              {!!userData && userData.first_name}{' '}
                              {!!userData && userData.last_name}
                            </div>
                          </div>
                          <hr />
                          <div className='row'>
                            <div className='col-sm-3'>
                              <h5 className='mb-0 my_acount'>Email</h5>
                            </div>
                            <div className='col-sm-9 text-secondary'>
                              {!!userData && userData.email}
                            </div>
                          </div>
                          <hr />
                          <div className='row'>
                            <div className='col-sm-3'>
                              <h5 className='mb-0 my_acount'>Phone</h5>
                            </div>
                            <div className='col-sm-9 text-secondary'>
                              {!!userData && userData.phoneno}
                            </div>
                          </div>
                          <hr />
                          <div className='d-flex' style={{ gap: '40px' }}>
                            <div className='row'>
                              <div className='col-sm-12'>
                                <Link
                                  className='common-btn'
                                  to='#'
                                  onClick={() => setOpen(true)}
                                >
                                  Edit
                                </Link>
                              </div>
                            </div>
                            {/* <div className='row'>
                              <div className='col-sm-12'>
                                <Link
                                  className='common-btn'
                                  to='#'
                                  onClick={() => setDeleteModal(true)}
                                >
                                  Delete
                                </Link>
                              </div>
                            </div> */}
                          </div>
                        </div>
                        <div className='tab-pane text-dark' id='tab_default_2'>
                          <h4> Change password </h4>
                          <div className='sign-tab-detail col-12'>
                            <form action='#'>
                              <div className='form-group'>
                                <input
                                  type='password'
                                  placeholder='Password'
                                  name='password'
                                  value={updatePassword.password}
                                  onChange={handleEditChange}
                                />
                              </div>
                              <div className='form-group'>
                                <input
                                  type='password'
                                  placeholder='Confim password'
                                  name='confirmPassword'
                                  value={updatePassword.confirmPassword}
                                  onChange={handleEditChange}
                                />
                              </div>

                              <div className='form-group'>
                                {loader && <Spinner />}
                                <button
                                  type='submit'
                                  className='common-btn'
                                  onClick={handlePasswordChange}
                                >
                                  Change password
                                  {loader && '...'}
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

      <Modal
        isOpen={resetGrapth}
        //onRequestClose={() => setTestWarning(false)}
        style={customStyles}
        contentLabel='Finish test modal'
        className='logout-modals'
        id='exampleModalLong'
        shouldReturnFocusAfterClose={false}
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-body'>
              <div className='payment-sucess'>
                <p>Reset Warning</p>
                <img src='assets/images/warning.png' alt='' />
                <p>Are you sure you want to reset your profile?</p>
                <div className='row'>
                  {/* {saveLoader && <Spinner />} */}
                  <button href='#' onClick={handleConfirmReset}>
                    Yes
                  </button>
                  <button
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      setLoader(false)
                      setResetGrapth(false)
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* delete modal  */}
      <Modal
        isOpen={deleteModal}
        //onRequestClose={() => setTestWarning(false)}
        style={customStyles}
        contentLabel='Finish test modal'
        className='logout-modals'
        id='exampleModalLong'
        shouldReturnFocusAfterClose={false}
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-body'>
              <div className='payment-sucess'>
                {/* <p>Delete</p> */}
                <img src='assets/images/warning.png' alt='' />
                <p>Are you sure you want to delete your profile?</p>
                <form
                  className='mb-3 mx-auto text-center'
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ margin: 'auto' }}
                >
                  <input
                    type='password'
                    placeholder='Enter you password'
                    className=' w-75'
                  />
                </form>
                <div className='row'>
                  {/* {saveLoader && <Spinner />} */}
                  <button href='#' onClick={handleDeleteProfile}>
                    Delete
                  </button>
                  <button
                    href='#'
                    onClick={e => {
                      e.preventDefault()
                      setLoader(false)
                      setDeleteModal(false)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  )
}

export default MyProfile
