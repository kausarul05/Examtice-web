import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { GET_COURSE_DETAIL, USER_SUBSCRIBE } from '../components/Api'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { global } from '../components/Config'
import { toast } from 'react-toastify'
import Spinner from '../components/spinner/Spinner'
import Accordion from '../components/accordion'
import { userProfile } from '../features/userSlice'
import Signin from '../components/modals/signin'
import { useContext } from 'react'
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt'

const Package = () => {
  const { id } = useParams()
  const userData =
    Cookies.get('user_data') && JSON.parse(Cookies.get('user_data'))
  const history = useHistory()
  const [loader, setLoader] = useState(false)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [course, setCourse] = useState([])
  const [interval, setInterval] = useState('Anually')
  // const userData = useSelector(userProfile).user.profile; //Redux user data
  const [open, setOpen] = useState(false)
  const [planData, setPlanData] = useState({
    planPrice: '',
    planId: ''
  })

  const config = {
    headers: {
      Authorization: Cookies.get('token')
    }
  }

  useEffect(() => {
    getCourse()
  }, [])

  const getCourse = async () => {
    try {
      setLoader(true)
      const body = {
        courseId: id,
        userId: userData ? userData.id : false
      }
      const {
        data: { message, status, data }
      } = await axios.post(GET_COURSE_DETAIL, body)
      if (status == 200) {
        setLoader(false)
        if (data) {
          setCourse(data)
          setInterval(() => {
            data.plans.length && getPlanPrice(data.plans[0].plan_id, data)
          }, 300)
        } else {
          setCourse(data)
          toast.error('Something went wrong, please try again.!')
        }
      } else {
        history.push('/eshop')
        toast.error('Something went wrong, please try again.!')
      }
    } catch (error) {
      console.log(error, '000000000000')
      setLoader(false)
      toast.error('Something went wrong, please try again.!')
    }
  }

  // handle subscribe button
  const handleSubscribe = async e => {
    e.preventDefault()
    try {
      setButtonLoader(true)
      const body = {
        email: userData.email,
        courseId: id,
        planId: planData.planId,
        totalPrice: planData.planPrice?.replace(/\./g, '')
      }
      const {
        data: { data, status, message }
      } = await axios.post(USER_SUBSCRIBE, body, config)
    //   console.log("authorization_url", data?.authorization_url)
      if (status == 200) {
        setButtonLoader(false)
        localStorage.setItem('planId', planData.planId)
        window.location = data.authorization_url
      } else {
        setButtonLoader(false)
        toast.error(message)
      }
    } catch (error) {
      setButtonLoader(false)
      console.log(error)
    }
  }

  const getPlanPrice = (planId, courseData) => {
    var selectedPlan = courseData.plans.filter(plan => plan.plan_id == planId)
    setPlanData({
      ...planData,
      ['planPrice']: selectedPlan[0]?.plan_amount,
      ['planId']: planId
    })
  }

  const handlePlan = e => {
    getPlanPrice(e.target.value, course)
  }

  // Open Sign in pop up if user not logged in
  const handleBuyCourse = e => {
    e.preventDefault()
    setOpen(true)
  }

  // handle to close the modal
  const handleCloseModal = () => {
    setOpen(false)
  }

  const handleNoPlan = e => {
    e.preventDefault()
    toast.error('No plans avaliable for this course.')
  }

  const { isDarkMode } = useContext(ThemeContext)

  return (
    <>
      <Header />

      <section className='e-shop-payment'>
        <div className='container'>
          <div className='pagination'>
            <span>
              <Link
                to='/eshop'
                className={`${isDarkMode ? 'color_light' : 'color_dark'}`}
              >
                <i className='fas fa-chevron-left' />
                Back
              </Link>
            </span>
          </div>

          <div className='row buy_package'>
            {loader ? (
              <div className='spinner_div' style={{ minHeight: '400px' }}>
                <Spinner />
              </div>
            ) : (
              <>
                <div className='col-md-6 col-12'>
                  <div className='e-shop-payment-left'>
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                    {/* <p>*Unlimited Explanation</p>
          <p>*Unlimited Saved Question</p>
          <p>*Unlimited Test</p> */}
                    <img
                      src={
                        `${global.API_HOST}assets/images/courses/` +
                        course.image
                      }
                      alt='course_image'
                    />
                  </div>
                  <div className='col-md-6 col-12 for_mobile'>
                    <div className='e-shop-payment-right'>
                      <h4>Choose Subscription</h4>
                      <form>
                        <div className='row'>
                          {course?.plans?.length ? (
                            course.plans.map((plan, key) => (
                              <div className='col-md-6 col-12' key={key}>
                                <div className='form-group'>
                                  <div className='radio-btn-page'>
                                    <label className='cs-radio'>
                                      ₦ {plan.plan_amount} /{' '}
                                      {plan.plan_interval == 1 && '1 Year'}
                                      <input
                                        type='radio'
                                        defaultChecked={
                                          key == 0 ? 'checked' : ''
                                        }
                                        name='plan'
                                        value={plan.plan_id}
                                        onChange={handlePlan}
                                      />
                                      <span className='checkmark' />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className='col-md-6 col-12'>
                              <div className='form-group'>
                                <h4>No plans found..!</h4>
                              </div>
                            </div>
                          )}

                          <div className='col-md-12'>
                            <div className='form-group'>
                              {/* <Link to="#">
                              <img src="assets/images/pro.png" alt="" />
                              Apply Promotional Code
                            </Link> */}
                            </div>
                          </div>
                        </div>
                        <h4>Payment Information</h4>
                        {planData.planPrice.length && (
                          <h6>Your total is ₦ {planData.planPrice}</h6>
                        )}
                        {/* <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing
                        elit. Aenean commodo ligula eget dolor. Aenean massa.
                        Cum sociis natoque penatibus et magnis dis parturient
                        montes, nascetur ridiculus mus.
                      </p> */}

                        <div className='form-group'>
                          {planData.planPrice.length ? (
                            course.isUserSubscribed ? (
                              <button
                                className='common-btn'
                                title='You already subscribe this course'
                                disabled
                              >
                                You already subscribe this course
                              </button>
                            ) : course.userNotExist ? (
                              <button
                                className='common-btn'
                                title='Kindly login to subscribe this course'
                                onClick={handleBuyCourse}
                              >
                                Subscribe
                              </button>
                            ) : (
                              <button
                                className='common-btn'
                                onClick={handleSubscribe}
                                title='Click here to subscribe'
                                disabled={buttonLoader}
                              >
                                Subscribe
                              </button>
                            )
                          ) : (
                            <button
                              className='common-btn'
                              title='No plans avaliable for this course.'
                              onClick={handleNoPlan}
                            >
                              No plans avaliable
                            </button>
                          )}
                        </div>

                        {buttonLoader && <Spinner />}
                      </form>
                    </div>
                  </div>
                  <div className='subject-detail'>
                    <p className='es-par-title'>
                      CONTAINS FOLLOWING {course.name} SUBJECTS
                    </p>
                    <div className='col-md-10'>
                      <div
                        className={`accordion ${
                          isDarkMode
                            ? 'according_text_dark'
                            : 'according_text_light'
                        }`}
                      >
                        {course?.subjects?.length ? (
                          <Accordion subjects={course.subjects} />
                        ) : (
                          <p>No subjects found..!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-6 for_desktop'>
                  <div className='e-shop-payment-right'>
                    <h4>Choose Subscription</h4>
                    <form>
                      <div className='row'>
                        {course?.plans?.length ? (
                          course.plans.map((plan, key) => (
                            <div className='col-md-6' key={key}>
                              <div className='form-group'>
                                <div className='radio-btn-page'>
                                  <label className='cs-radio'>
                                    ₦ {plan.plan_amount} /{' '}
                                    {plan.plan_interval == 1 && '1 Year'}
                                    <input
                                      type='radio'
                                      defaultChecked={key == 0 ? 'checked' : ''}
                                      name='plan'
                                      value={plan.plan_id}
                                      onChange={handlePlan}
                                    />
                                    <span className='checkmark' />
                                  </label>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className='col-md-6'>
                            <div className='form-group'>
                              <h4>No plans found..!</h4>
                            </div>
                          </div>
                        )}

                        <div className='col-md-12'>
                          <div className='form-group'>
                            {/* <Link to="#">
                              <img src="assets/images/pro.png" alt="" />
                              Apply Promotional Code
                            </Link> */}
                          </div>
                        </div>
                      </div>
                      <h4>Payment Information</h4>
                      {planData.planPrice.length && (
                        <h6>Your total is ₦ {planData.planPrice}</h6>
                      )}
                      {/* <p>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing
                        elit. Aenean commodo ligula eget dolor. Aenean massa.
                        Cum sociis natoque penatibus et magnis dis parturient
                        montes, nascetur ridiculus mus.
                      </p> */}

                      <div className='form-group'>
                        {planData.planPrice.length ? (
                          course.isUserSubscribed ? (
                            <button
                              className='common-btn'
                              title='You already subscribe this course'
                              disabled
                            >
                              You already subscribe this course
                            </button>
                          ) : course.userNotExist ? (
                            <button
                              className='common-btn'
                              title='Kindly login to subscribe this course'
                              onClick={handleBuyCourse}
                            >
                              Subscribe
                            </button>
                          ) : (
                            <button
                              className='common-btn'
                              onClick={handleSubscribe}
                              title='Click here to subscribe'
                              disabled={buttonLoader}
                            >
                              Subscribe
                            </button>
                          )
                        ) : (
                          <button
                            className='common-btn'
                            title='No plans avaliable for this course.'
                            onClick={handleNoPlan}
                          >
                            No plans avaliable
                          </button>
                        )}
                      </div>

                      {buttonLoader && <Spinner />}
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* Sign in Pop up open  */}
      <Signin show={open} closePop={handleCloseModal} />
      <Footer />
    </>
  )
}

export default Package
