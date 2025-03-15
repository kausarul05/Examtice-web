import React, { useEffect, useState, userData} from "react";
import { Link } from "react-router-dom";
import EditProfile from "../../components/modals/edit";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  GET_COURSES,
  GET_SUBJECTS,
  GET_TOPICS_LIST,
  SAVE_FEEDBACK_QUESTION,
  SEARCH_QUESTION,
} from "../../components/Api";
import Spinner from "../../components/spinner/Spinner";
import { toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContaxt/ThemeContaxt";

const SearchandFeedback = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loader, setLoader] = useState(false);
  const [testData, setTestData] = useState({ type: 1 });
  const [topics, setTopics] = useState([]);
  const [searchquestionlist, setSearchquestionlist] = useState([]);
  const [updateForm, setUpdateForm] = useState({
    searchquestion:"",
    user_id: "",
    course_id: "",
    subject_id: "",
    topic_id: "",
    question: "",
    option_1: "",
    option_2: "",
    option_3: "",
    option_4: "",
    answer: "",
    explanation: "",
    searchquestion: "",
  });

  useEffect(() => {
    getCourses();
  }, []);
 

  //Get courses on page load
  const getCourses = async () => {
    try {
      setLoader(true);
      const {
        data: { data, status },
      } = await axios.get(GET_COURSES);
      if (status == 200) {
        setLoader(false);
        setCourses(data);
      }
    } catch (err) {
      setLoader(false);
      toast.error("Something went wrong please try again..!");
    }
  };

  const handleChange = (e) => {
    setTestData({ ...testData, [e.target.name]: e.target.value });
  };
  const handleEditChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value,
    });
  };

  //Get subject based on course change
  const handleCourseChange = async (e) => {
    var id = e.target.value;
    var userId =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
    if (!isNaN(id)) {
      setLoader(true);
      setTestData({
        ...testData,
        courseName: e.target.options[e.target.selectedIndex].text,
        courseId: id,
      });
      const body = {
        courseId: id,
        user_id: !!userId && userId.id,
      };
      try {
        const {
          data: { data, status, mcq, theory, practical, usersubscription, error },
        } = await axios.post(GET_SUBJECTS, body);
        if (status == 200) {
          setLoader(false);
          setSubjects(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubjectChange = async (e) => {
    var id = e.target.value;
    var userId =
    Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
    if (!isNaN(id)) {
      setLoader(true);
      setTestData({
        ...testData,
        subjectName: e.target.options[e.target.selectedIndex].text,
        subjectId: id,
      });
      const body = {
        subjectId: id,
        user_id: !!userId && userId.id,
      };
      try {
        const {
          data: { data, status, number_of_question,ave_total_question, error },
        } = await axios.post(GET_TOPICS_LIST, body);
        if (status == 200) {
          setLoader(false);
          setTopics(data);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleTopicChange = async (e) => {
    var id = e.target.value;
    if (!isNaN(id)) {
      setTestData({
        ...testData,
        topicName: e.target.options[e.target.selectedIndex].text,
        topicId: id,
      });
    }
  };
  const handleFeedbackQuestion = async (e) => {
    try {
      setLoader(true);
      const config = {
        headers: {
          Authorization: Cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        }
      }
      var userId =Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
      
      const body = {
        user_id: userId.id,
        course_id: testData.courseId,
        subject_id: testData.subjectId,
        topic_id: testData.topicId,
        question: updateForm.question,
        option_1: updateForm.option_1,
        option_2: updateForm.option_2,
        option_3: updateForm.option_3,
        option_4: updateForm.option_4,
        answer: updateForm.answer,
        explanation: updateForm.explanation,
      };

      const {
        data: { status, data, message },
      } = await axios.post(SAVE_FEEDBACK_QUESTION, body);
      if (status == 200) {
        var inTwoMinutes = new Date(new Date().getTime() + 360 * 60 * 1000);
        let expiryObject = {
          expires: inTwoMinutes,
        };
        Cookies.set("user_data", JSON.stringify(data), expiryObject);
        
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

  const handlesearchQuestion = async (e) => {
    try {
      setLoader(true);
      const config = {
        headers: {
          Authorization: Cookies.get("token"),
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        }
      }
      var userId =Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
     
      const body = {
        user_id: userId.id,
        searchq: updateForm.searchquestion,
      };

      const {
        data: { status, data, message },
      } = await axios.post(SEARCH_QUESTION, body);
      if (status == 200) {
        setLoader(false);
        setSearchquestionlist(data);
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

  const { isDarkMode} = useContext(ThemeContext);

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/user/dashboard"  className={`${isDarkMode ? 'color_light' : 'color_dark'}`}>
                <i className="fas fa-chevron-left" />
                Search Question/Feedback Question
              </Link>
            </span>
          </div>
          <div className="main-body text-dark">
            <div className="row gutters-sm">
              <div className="col-md-12 text-dark">
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
                            Search Question{" "}
                          </a>
                        </li>
                        <li>
                          <a href="#tab_default_2" data-toggle="tab">
                            Feedback Question{" "}
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active" id="tab_default_1">
                          <div className="row">
                            <div className="col-sm-9 text-secondary">
                              <div className="select-search">
                                <input
                                  type="text"
                                  placeholder="Search Question"
                                  name="searchquestion"
                                  value={updateForm.searchquestion}
                                  onChange={handleEditChange}
                                />
                              </div>
                            </div>
                            <div className="col-sm-3">
                              <Link
                                className="common-btn"
                                to="#"
                                onClick={handlesearchQuestion}
                              >
                                Search
                                
                              </Link>
                            </div>
                          </div>
                          <div className="row savedTest">
                            <div className="col-sm-12">
                              <div className="row searchquestionlisting" >
                                <h4 style={{ color: "#ffff" }}>Search Questions</h4>
                                <table className={` ${isDarkMode ? 'table table-hover table-dark' : 'table table-hover table-white'}`}>
                                  <thead>
                                    <tr>
                                      <td>Course Name</td>
                                      <td>Subject Name</td>
                                      <td>Topic Name</td>
                                      <td>Question</td>
                                      <td>Option 1</td>
                                      <td>Option 2</td>
                                      <td>Option 3</td>
                                      <td>Option 4</td>
                                      <td>Answer</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  {searchquestionlist &&
                                        searchquestionlist.map((item, index) => (
                                          <tr>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.courseName }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.subjectName }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.topicName }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.question }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_1 }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_2 }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_3 }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.option_4 }}></div></td>
                                            <td><div className="post__content" dangerouslySetInnerHTML={{ __html: item.answer }}></div></td>
                                          </tr>
                                        ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                        <div className="tab-pane" id="tab_default_2">
                          <h4> Feed Back Question </h4>
                          
                            <div className="row text-dark">
                              <div className="sign-tab-detail col-md-4">
                              
                                <div className="select-class select-testing">
                                  <p>Select Course</p>
                                  <select onChange={handleCourseChange} id="courses" name="course_id">
                                    <option value>Select course</option>
                                    {courses &&
                                      courses.map((item, index) => (
                                        <option value={item.id} key={index}>
                                          {" "}
                                          {item.name}{" "}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                  <p>Select Subject</p>
                                  <select id="subjects" name="subject_id" onChange={handleSubjectChange}>
                                    <option value="">Select subject</option>
                                    {subjects &&
                                      subjects.map((item, index) => (
                                        <option value={item.id} key={index}>
                                          {" "}
                                          {item.name}{" "}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                  <p>Select Topic</p>
                                  <select id="subjects" name="topic_id" onChange={handleTopicChange}>
                                    <option value="">Select topic</option>
                                    {topics &&
                                      topics.map((item, index) => (
                                        <option value={item.id} key={index}>
                                          {" "}
                                          {item.name}{" "}
                                        </option>
                                      ))}
                                  </select>
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                  <p>Question</p>
                                  <input 
                                  type="text"
                                  placeholder="Question" 
                                  name="question" 
                                  value={updateForm.question}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-8">
                                
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                  <p>Option 1</p>
                                  <input 
                                  type="text" 
                                  placeholder="Question" 
                                  name="option_1" 
                                  value={updateForm.option_1}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                <p>Option 2</p>
                                  <input 
                                  type="text" 
                                  placeholder="Question" 
                                  name="option_2" 
                                  value={updateForm.option_2}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                <p>Option 3</p>
                                  <input 
                                  type="text" 
                                  placeholder="Question" 
                                  name="option_3"
                                  value={updateForm.option_3}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                <p>Option 4</p>
                                  <input 
                                  type="text" 
                                  placeholder="Question" 
                                  name="option_4"
                                  value={updateForm.option_4}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                <p>Answer</p>
                                  <select id="subjects" name="answer" onChange={handleEditChange}>
                                    <option value="">Select Answer</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                    <option value="4">Option 4</option>
                                    
                                  </select>
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                <div className="select-subject select-testing">
                                  <p>Explanation</p>
                                  <input 
                                  type="text" 
                                  placeholder="Question" 
                                  name="explanation" 
                                  value={updateForm.explanation}
                                  onChange={handleEditChange}
                                  />
                                </div>
                              </div>
                              <div className="sign-tab-detail col-md-4">
                                
                              </div>
                              <div className="">
                                <div className="col-md-12">
                                  <div className="select-subject select-testing">
                                    {loader && <Spinner />}
                                    <button
                                      value="Save Feedback"
                                      className="common-btn"
                                      onClick={handleFeedbackQuestion}
                                      disabled={loader}
                                    >
                                      Save Feedback
                                    {loader && "..."}
                                    </button>
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
            </div>
          </div>
        </div>

      </section>

      <Footer />
    </>
  );
};

export default SearchandFeedback;
