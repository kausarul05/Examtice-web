import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import {
  FLAG_QUESTION,
  GET_LMS_EXAM_QUESTIONS_START,
  QUESTION_COMMENT,
  SAVE_LMS_QUESTIONS,
  SAVE_LMS_TIME,
  SAVE_USER_TEST
} from '../../components/Api'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { userAuth, isTestStart } from '../../features/userSlice'
import LmsquestionsCount from '../../components/exam/LmsquestionsCount'
import { Link, useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import Spinner from '../../components/spinner/Spinner'
import { useStopwatch } from 'react-timer-hook'
import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import Comment from '../../components/exam/Comment'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { formatTime } from '../../components/CommonFunction'
import Statistics from '../../components/exam/statistics'
import { Helmet } from 'react-helmet'
import { ThemeContext } from '../../ThemeContaxt/ThemeContaxt'

const ResumeSavedTest = () => {
  const { lmsExamtId } = useParams()
  const [loader, setLoader] = useState(false)
  const history = useHistory()
  const [questionsData, setQuestionsData] = useState([])
  const [finishWarning, setFinishWarning] = useState(false)
  const [notAnswer, setNotAnswer] = useState('')
  const [cancelWarning, setCancelWarning] = useState(false)
  const [saveLoader, setSaveLoader] = useState(false)
  const [step, setStep] = useState(0)
  const [comment, setComment] = useState('')
  const [commentLoader, setCommentLoader] = useState(false)
  const [answerLoader, setAnswerLoader] = useState(false)
  const [saveWarning, setSaveWarning] = useState(false)

  const [flagWarning, setFlagWarning] = useState(false)
  const [radioOption, setRadioValue] = useState(false)
  const [radioInnerValue, setRadioInner] = useState(1)
  const [selectedQuestionId, setQuestionId] = useState(null)
  const [otherOption, setOtherOption] = useState(null)
  const [isExam, setIsExam] = useState(true)

  const dispatch = useDispatch()
  var stopwatchOffset = new Date()
  const [stopWatch, setStopWatch] = useState()

  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
    offsetTimestamp: !!stopwatchOffset && stopwatchOffset ? stopwatchOffset : ''
  })

  const isAuth = useSelector(userAuth) //using redux useSelector here

  const SetTime = () => {
    var stopwatchOffset = new Date()
    stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + stopWatch)
    reset(stopwatchOffset, true)
    start()
  }

  useEffect(() => {
    getSavedTetQuestion()
  }, [lmsExamtId])

  useEffect(() => {
    SetTime()
  }, [stopWatch])

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: '9999',
      overflowY: 'auto'
    }
  }
  Modal.setAppElement('#root')

  // get saved test data based on testId
  const getSavedTetQuestion = async () => {
    if (lmsExamtId == undefined) {
      history.push('/user/lmsexam')
    }
    try {
      const config = {
        headers: {
          Authorization: Cookies.get('token')
        }
      }
      setLoader(true)
      var userId =
        Cookies.get('user_data') && JSON.parse(Cookies.get('user_data'))
      const body = {
        exam_id: lmsExamtId,
        user_id: userId.id
      }
      const {
        data: { status, data }
      } = await axios.post(GET_LMS_EXAM_QUESTIONS_START, body)
      if (status == 200) {
        setQuestionsData(data.questions)

        var hms = '15:10' //data.time_spent; // your input string
        var a = hms.split(':') // split it at the colons
        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
        setStopWatch(seconds)
        var index
        // if(data.is_exam==1){
        //   setIsExam(true);
        // }
        data.questions.some(function (x, i) {
          if (x.isAttempt == true) {
            index = i + 1
          } else if (x.isAttempt != true) {
            index = i >= 0 ? 1 : i
          } else {
            index = 1
          }
          return index
        })

        dispatch(isTestStart(true))
        if (step !== data.questions.length) {
          setStep(step + index)
        }
        setLoader(false)
      } else {
        history.push('/user/lmsexam')
        toast.error('Something went wrong, please try again.!')
      }
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong, please try again.!')
    }
  }

  // Handle user answer
  const handleAnswer = async (quesId, choosenAnswer) => {
    var exam_id = lmsExamtId
    if (exam_id == null) {
      toast.error('Something went wrong, Kindly restart your test..!')
      return false
    }
    var userId =
      Cookies.get('user_data') && JSON.parse(Cookies.get('user_data'))
    const bodyParameter = {
      exam_id: exam_id,
      question_id: quesId,
      choosen_option: choosenAnswer,
      user_id: userId.id
    }
    try {
      const isAttemptQuestionState = questionsData.map(item =>
        item.id === quesId
          ? {
              ...item,
              isAttempt: true
            }
          : item
      )
      setQuestionsData(isAttemptQuestionState)
      setAnswerLoader(true)
      const {
        data: { result, status, error }
      } = await axios.post(SAVE_LMS_QUESTIONS, bodyParameter)
      if (status == 200) {
        setAnswerLoader(false)
        const updateQuestionState = questionsData.map(item =>
          item.id === quesId
            ? {
                ...item,
                isAttempt: true,
                rightOption: result.rightOption,
                userOption: choosenAnswer,
                isCorrect: result.rightOption == choosenAnswer ? true : false
              }
            : item
        )
        setQuestionsData(updateQuestionState)
        if (isExam) {
          setTimeout(() => {
            if (step !== questionsData.length) {
              setStep(step + 1)
            }
          }, 500)
        } else {
          if (choosenAnswer == result.rightOption) {
            setTimeout(() => {
              if (step !== questionsData.length) {
                setStep(step + 1)
              }
            }, 500)
          }
        }
      }
    } catch (err) {
      toast.error('Something went wrong, please try again..!')
      setAnswerLoader(false)
      console.log(err)
    }
  }

  // Handle user cancel the test
  const handleUserCancelTest = e => {
    e.preventDefault()
    dispatch(isTestStart(false))

    setTimeout(() => {
      history.push('/user/lmsexam')
    }, 300)
  }

  //Get how many questions user not attempt
  function getUserQuestionsNotAttempt () {
    return questionsData.filter(item => item?.isAttempt !== true).length
  }

  //Get how many questions user attempt
  function getUserQuestionsAttempt () {
    return questionsData.filter(item => item?.isAttempt == true).length
  }

  // increment progeress bar count
  const progressStatus = {
    width:
      Math.floor((getUserQuestionsAttempt() / questionsData.length) * 100) + '%'
  }

  // handle jump to question
  const handleJumpQuestion = index => {
    setStep(index + 1)
  }

  // handleUserCommnet
  const handleUserCommnet = async (e, questionId) => {
    e.preventDefault()
    if (comment == '') {
      toast.error('Please write your comment')
      return false
    }
    try {
      //setCommentLoader(true);
      const config = {
        headers: {
          Authorization: Cookies.get('token')
        }
      }
      var userData = JSON.parse(Cookies.get('user_data'))
      var bodyParameters = {
        user_id: userData.id,
        question_id: questionId,
        comment: comment
      }
      const {
        data: { data, status }
      } = await axios.post(QUESTION_COMMENT, bodyParameters, config)
      if (status == 200) {
        var tempData = [...questionsData]
        tempData.filter(
          ques => ques.id == questionId && ques.comments.unshift(data)
        )
        setQuestionsData(tempData)
        setCommentLoader(false)
        setComment('')
      }
    } catch (err) {
      console.log(err)
      setCommentLoader(false)
      toast.error('Something went wrong please try again..!')
    }
  }

  //Save test spent time
  const saveTestTime = async time => {
    try {
      setLoader(true)
      var userId =
        Cookies.get('user_data') && JSON.parse(Cookies.get('user_data'))
      var examId = lmsExamtId
      const {
        data: { status, message }
      } = await axios.post(SAVE_LMS_TIME, {
        exam_id: examId,
        spentTime: time,
        user_id: userId.id
      })
      console.log('LMS check')
      if (status == 200) {
        console.log('LMS finished')
        setTimeout(() => {
          // history.push("/user/lmsexam/" + lmsExamtId);
          history.push('/user/lmsexam/')
        }, 200)
      }
    } catch (err) {
      toast.error('Something went wrong, please try again..!')
      setLoader(false)
      console.log(err)
    }
  }

  //If user cancel the test
  const handleCancelTest = e => {
    e.preventDefault()
    setCancelWarning(true)
  }

  // change question comment state if user delete it
  const handleCommentChange = useCallback((commentId, questionId) => {
    const newState = [...questionsData]
    let updatedComments = newState.map(item => {
      if (item.id == questionId) {
        return {
          ...item,
          comments: item.comments.filter(comm => comm.id != commentId)
        }
      }
      return item
    })
    setQuestionsData(updatedComments)
  })

  // Dispay time
  const myTimer = () => {
    return (
      <div className='timer'>
        <img src='assets/images/timer.png' alt='' />
        <span>
          {formatTime(hours)} : {formatTime(minutes)} : {formatTime(seconds)}
        </span>
      </div>
    )
  }

  //If user finish the test
  const handleFinishTest = e => {
    e.preventDefault()
    var userNotAttempted = getUserQuestionsNotAttempt()
    setNotAnswer(userNotAttempted)
    var time = [hours, minutes, seconds]
    if (userNotAttempted > 0) {
      setFinishWarning(true)
    } else {
      saveTestTime(time.join(':'))
      dispatch(isTestStart(false))
    }
  }

  const handleConfirmButton = async e => {
    e.preventDefault()

    var time = [hours, minutes, seconds]
    saveTestTime(time.join(':'))
  }

  // save test
  const handleUserSaveTest = async e => {
    e.preventDefault()
    try {
      const config = {
        headers: {
          Authorization: Cookies.get('token')
        }
      }
      setSaveLoader(true)
      var testId = lmsExamtId
      var time = [hours, minutes, seconds]
      const {
        data: { status, message }
      } = await axios.post(
        SAVE_USER_TEST,
        { testId: testId, spentTime: time.join(':') },
        config
      )
      if (status == 200) {
        dispatch(isTestStart(false))
        setSaveLoader(false)
        setTimeout(() => {
          history.push('/user/dashboard')
        }, 200)
      }
    } catch (err) {
      toast.error('Something went wrong, please try again..!')
      setSaveLoader(false)
      console.log(err)
    }
  }

  // Radio option flag
  const handlerRadio = option => {
    setRadioInner(option)
    !!option && option == 3 ? setRadioValue(true) : setRadioValue(false)
  }

  // Handle user flag the test
  const handleUserFlagTest = async e => {
    e.preventDefault()

    try {
      //setCommentLoader(true);
      const config = {
        headers: {
          Authorization: Cookies.get('token')
        }
      }
      var userData = JSON.parse(Cookies.get('user_data'))
      var bodyParameters = {
        user_id: userData.id,
        question_id: selectedQuestionId,
        flag_option: radioInnerValue,
        flag_option_text:
          !!radioInnerValue && radioInnerValue == 1
            ? 'its Spam'
            : radioInnerValue == 2
            ? 'Wrong Q/A'
            : otherOption
      }
      const {
        data: { data, status }
      } = await axios.post(FLAG_QUESTION, bodyParameters, config)
      if (status == 200) {
        // Pushing element to the arrray of object with previous object
        var tempData = questionsData.map(el =>
          el.id === selectedQuestionId
            ? {
                ...el,
                isFlag: true
              }
            : el
        )
        // Set the new array
        setQuestionsData(tempData)
        setFlagWarning(false)
      }
    } catch (err) {
      console.log(err)
      // setCommentLoader(false);
      toast.error('Something went wrong please try again..!')
    }
  }

  const handleFlag = questionId => {
    setFlagWarning(true)
    setQuestionId(questionId)
  }

  const { isDarkMode } = useContext(ThemeContext)

  // console.log(questionsData)

  return (
    <>
      <Header />
      <section className='free-testing-sec'>
        <div className='container'>
          <div className='pagination'>
            <span>
              <Link
                to='/user/lmsexam'
                className={`${isDarkMode ? 'color_light' : 'color_dark'}`}
              >
                <i className='fas fa-chevron-left' />
                LMS EXAM
              </Link>
            </span>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              <div className='row short-container'>
                {loader ? (
                  <div className='spinner_div' style={{ minHeight: '400px' }}>
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <div className='col-md-9'>
                      {questionsData.map((item, index) => (
                        <div
                          className={`free-test-tabing-left ${
                            step && step == index + 1 ? 'active_qa' : 'hide_qa'
                          } `}
                          key={index}
                        >
                          <div className='timerr-inner'>
                            <h5>
                              {step > 1 && (
                                <i
                                  className='fas fa-chevron-left pointer'
                                  onClick={() => setStep(step - 1)}
                                />
                              )}
                              Q {index + 1} / {questionsData.length}{' '}
                              {isAuth && item.isFlag == false ? (
                                <i
                                  className='fas fa-flag fa-sm'
                                  onClick={e => handleFlag(item.id)}
                                ></i>
                              ) : isAuth && item.isFlag == true ? (
                                <i
                                  className='fas fa-flag fa-sm flaged-icon'
                                  title='Already flagged this question'
                                ></i>
                              ) : (
                                ''
                              )}
                            </h5>
                            {myTimer()}
                            <h5>
                              {step !== questionsData.length && (
                                <i
                                  className='fas fa-chevron-right pointer'
                                  onClick={() => setStep(step + 1)}
                                />
                              )}
                            </h5>
                          </div>
                          <div className='free-test-tabing-left-bar'>
                            <span style={progressStatus}></span>
                          </div>
                          <div className='tabing-inner-page'>
                            <ul className='nav nav-pills'>
                              <li className='active'>
                                <a
                                  className='active'
                                  data-toggle='pill'
                                  href={`#home_${index + 1}`}
                                >
                                  <i className='fas fa-play fa-sm'></i> Question
                                </a>
                              </li>
                              <li>
                                <a
                                  data-toggle='pill'
                                  href={`#explanation_${index + 1}`}
                                >
                                  <i className='fas fa-newspaper fa-sm'></i>{' '}
                                  Excerpt
                                </a>
                              </li>
                              <li>
                                <a
                                  data-toggle='pill'
                                  href={`#statistics${index + 1}`}
                                >
                                  <i className='fas fa-chart-pie fa-sm'></i>{' '}
                                  Statistics
                                </a>
                              </li>
                              <li style={{ position: 'relative' }}>
                                <a
                                  data-toggle='pill'
                                  href={`#comment_${index + 1}`}
                                >
                                  <i className='fas fa-comments fa-sm'></i>{' '}
                                  {/* {item.comments.length > 0 && (
                                    <span className="commentCount">
                                      {" "}
                                      {item.comments.length}
                                    </span>
                                  )} */}
                                  Comments
                                </a>
                              </li>
                              {/* <li>
                                <a
                                  data-toggle="pill"
                                  href={`#save_${index + 1}`}
                                >
                                  <i className="fas fa-sticky-note fa-sm"></i>{" "}
                                  Notes
                                </a>
                              </li> */}
                            </ul>
                            <div className='tab-content'>
                              <div
                                id={`home_${index + 1}`}
                                className='tab-pane fade in active show'
                              >
                                <Helmet>
                                  <script
                                    src='https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image&async=true'
                                    type='text/javascript'
                                  />
                                </Helmet>

                                <div
                                  className='post__content'
                                  dangerouslySetInnerHTML={{
                                    __html: item.question
                                  }}
                                ></div>
                                {answerLoader && <Spinner />}

                                <ul>
                                  <button
                                    className={`${
                                      item.isAttempt && item.userOption == 1
                                        ? 'exam'
                                        : ''
                                    }`}
                                    onClick={() => handleAnswer(item.id, 1)}
                                    //disabled={item.isAttempt}
                                  >
                                    <span>A</span>
                                    <div
                                      className='post__content'
                                      dangerouslySetInnerHTML={{
                                        __html: item.option_1
                                      }}
                                    />
                                  </button>
                                  <button
                                    className={`${
                                      item.isAttempt && item.userOption == 2
                                        ? 'exam'
                                        : ''
                                    }`}
                                    onClick={() => handleAnswer(item.id, 2)}
                                    //disabled={item.isAttempt}
                                  >
                                    <span>B</span>
                                    <div
                                      className='post__content'
                                      dangerouslySetInnerHTML={{
                                        __html: item.option_2
                                      }}
                                    />
                                  </button>
                                  <button
                                    className={`${
                                      item.isAttempt && item.userOption == 3
                                        ? 'exam'
                                        : ''
                                    }`}
                                    onClick={() => handleAnswer(item.id, 3)}
                                    //disabled={item.isAttempt}
                                  >
                                    <span>C</span>
                                    <div
                                      className='post__content'
                                      dangerouslySetInnerHTML={{
                                        __html: item.option_3
                                      }}
                                    />
                                  </button>
                                  <button
                                    className={`${
                                      item.isAttempt && item.userOption == 4
                                        ? 'exam'
                                        : ''
                                    }`}
                                    onClick={() => handleAnswer(item.id, 4)}
                                    //disabled={item.isAttempt}
                                  >
                                    <span>D</span>
                                    <div
                                      className='post__content'
                                      dangerouslySetInnerHTML={{
                                        __html: item.option_4
                                      }}
                                    />
                                  </button>
                                </ul>
                              </div>
                              <div
                                id={`explanation_${index + 1}`}
                                className='tab-pane fade explanation'
                              >
                                {
                                  item.excerpt && (
                                    <div
                                      className='post__content'
                                      dangerouslySetInnerHTML={{
                                        __html: item.excerpt
                                      }}
                                    ></div>
                                  )
                                  //   <MathJax.Provider>
                                  //   <MathJax.Html html={item.explanation} />
                                  // </MathJax.Provider>
                                }
                              </div>
                              <div
                                id={`statistics${index + 1}`}
                                className='tab-pane fade explanation'
                              >
                                <p>Statistics</p>
                                <Statistics stats={item.statistics} />
                              </div>
                              <div
                                id={`comment_${index + 1}`}
                                className='tab-pane fade'
                              >
                                <h3>User comments</h3>
                                {/* {item.comments.length && (
                                  <Comment
                                    comments={item.comments}
                                    questionId={item.id}
                                    commentChange={handleCommentChange}
                                  />
                                )} */}
                                {isAuth && (
                                  <form>
                                    <div className='form-group'>
                                      <textarea
                                        placeholder='Comment'
                                        readOnly={!isAuth}
                                        value={comment}
                                        onChange={e =>
                                          setComment(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className='form-group'>
                                      <button
                                        onClick={e =>
                                          handleUserCommnet(e, item.id)
                                        }
                                        disabled={commentLoader}
                                        style={{ cursor: 'pointer' }}
                                      >
                                        Post comment
                                      </button>
                                    </div>
                                  </form>
                                )}
                              </div>
                              <div
                                id={`save_${index + 1}`}
                                className='tab-pane fade'
                              >
                                <h3>
                                  Your Personal Note{' '}
                                  <span>(Not Visible to others)</span>
                                </h3>
                                <form>
                                  <div className='form-group'>
                                    <textarea
                                      placeholder='Personal Note'
                                      readOnly
                                    ></textarea>
                                  </div>
                                  <div className='form-group'>
                                    <button
                                      disabled
                                      title={
                                        isAuth
                                          ? ''
                                          : 'You have to login to save your own note for this question.'
                                      }
                                    >
                                      Save Note
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='col-md-3'>
                      <div
                        className={`${
                          isDarkMode
                            ? 'free-test-tabing-right_light_color'
                            : 'free-test-tabing-right_dark_color'
                        }`}
                      >
                        <span>Test Details</span>
                        <div
                          className={`cal-btn ${
                            isDarkMode
                              ? 'cal-btn cat_btn_light'
                              : 'cal-btn cat_btn_dark'
                          }`}
                        >
                          <a
                            href='#'
                            onClick={handleCancelTest}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Cancel Exam
                          </a>
                          <a
                            href='#'
                            onClick={handleFinishTest}
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            Finish Exam
                          </a>
                        </div>
                        <div className='cal-btn'></div>

                        {/* <div className="cal-btn" style={{ marginBottom: '10px' }}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSaveWarning(true);
                            }}
                          >
                            Save test
                          </a>
                        </div> */}

                        <LmsquestionsCount
                          questions={questionsData}
                          jumpOnQuestion={handleJumpQuestion}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* If user finish the test */}
        <Modal
          isOpen={finishWarning}
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
                  <p>Incomplete test</p>
                  <img src='assets/images/warning.png' alt='' />
                  <p>You have to answer all questions to finish the test.</p>
                  <p>You still have {notAnswer} unanswered questions.</p>
                  <div className='row'>
                    <a
                      href='#'
                      // onClick={(e) => {
                      //     e.preventDefault();
                      //     setFinishWarning(false);
                      // }}

                      onClick={handleConfirmButton}
                    >
                      Yes
                    </a>

                    <button
                      href='#'
                      onClick={e => {
                        e.preventDefault()
                        setFinishWarning(false)
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
        {/* If user Flag Question */}
        <Modal
          isOpen={flagWarning}
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
                  <div className='edit-profile-modal__inner'>
                    <h4 className='theme-txt text-center mb-4 '>
                      Flag Question
                    </h4>
                    <img src='assets/images/warning.png' alt='' />
                    <form>
                      <div className='choose-report'>
                        <div className='form-group'>
                          <input
                            type='radio'
                            name='report'
                            id='first-option'
                            defaultValue="it's spam"
                            defaultChecked
                            onClick={e => handlerRadio(1)}
                          />
                          <label htmlFor='first-option' />
                          <span className='ml-1'>It's a spam</span>
                        </div>
                        <div className='form-group'>
                          <input
                            type='radio'
                            name='report'
                            id='second-option'
                            defaultValue='Wrong Q/A'
                            onClick={e => handlerRadio(2)}
                          />
                          <label htmlFor='second-option' />
                          <span className='ml-1'>Wrong Q/A</span>
                        </div>
                        <div className='form-group'>
                          <input
                            type='radio'
                            name='report'
                            id='third-option'
                            defaultValue='Other'
                            onClick={e => handlerRadio(3)}
                          />
                          <label htmlFor='third-option' />
                          <span className='ml-1'>Other</span>
                        </div>
                        <div className='form-group'>
                          {radioOption ? (
                            <input
                              type='text'
                              className='form-control'
                              name='otherqa'
                              placeholder='Write here'
                              value={otherOption}
                              onChange={e => setOtherOption(e.target.value)}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* If user cancel the test */}
        <Modal
          isOpen={cancelWarning}
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
                  <p>Incomplete test</p>
                  <img src='assets/images/warning.png' alt='' />
                  <p>Do you really want to cancel this test?</p>
                  <div className='row'>
                    <a href='#' onClick={handleUserCancelTest}>
                      Yes
                    </a>
                    <a
                      href='#'
                      onClick={e => {
                        e.preventDefault()
                        setCancelWarning(false)
                        //blockRoutes();
                      }}
                    >
                      No
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* If user saved the test */}
        <Modal
          isOpen={saveWarning}
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
                  <p>Save test</p>
                  <img src='assets/images/warning.png' alt='' />
                  <p>Do you really want to save this test?</p>
                  <div className='row'>
                    {saveLoader && <Spinner />}
                    <button
                      href='#'
                      onClick={handleUserSaveTest}
                      disabled={saveLoader}
                    >
                      Yes
                    </button>
                    <button
                      href='#'
                      onClick={e => {
                        e.preventDefault()
                        setSaveWarning(false)
                        setLoader(false)
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
      </section>
      <Footer />
      {/* < ToastContainer /> */}
    </>
  )
}
export default ResumeSavedTest
