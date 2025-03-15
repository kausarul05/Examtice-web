import React, { useEffect, useState} from "react";
import axios from "axios";
import { Link,useHistory } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import {CREATE_TICKET,GET_TICKETSTATUS} from "../../components/Api";
import { toast } from "react-toastify";

const CreateTicket = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState();
  const [testData, setTestData] = useState({ type: 1 });
  const [updateForm, setUpdateForm] = useState({
    title:"",
    content: "",
    category_id: "",
  });

  useEffect(() => {
    getCategory();
  }, []);

  //Get courses on page load
  const getCategory = async () => {
    try {
      setLoader(true);
      const {
        data: { data, status },
      } = await axios.get(GET_TICKETSTATUS);
      if (status == 200) {
        setLoader(false);
        setCategory(data);
      }
    } catch (err) {
      setLoader(false);
      toast.error("Something went wrong please try again..!");
    }
  };

  const handleEditChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value,
    });
  };


  const handleCategoryChange = async (e) => {
    var id = e.target.value;
    if (!isNaN(id)) {
      setTestData({
        ...testData,
        categoryId: id,
      });
    }
  };

  const handleCreateTicket = async (e) => {
    try {
      setLoader(true);
      if (updateForm.title=="") {
        toast.error('Title Must be fill');
        setLoader(false);
      }else{
        if (updateForm.content=="") {
          toast.error('Content Must be fill');
          setLoader(false);
        }else{
          if (isNaN(testData.categoryId)) {
            toast.error('Must Select a Category');
            setLoader(false);
          }else{
            const config = {
              headers: {
                Authorization: Cookies.get("token"),
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              }
            }
            var userId =Cookies.get("user_data") && JSON.parse(Cookies.get("user_data"));
            
            const body = {
              userId: userId.id,
              title:updateForm.title,
              content: updateForm.content,
              category_id: testData.categoryId,
            };
      
            const {
              data: { status, data, message },
            } = await axios.post(CREATE_TICKET, body);
            if (status == 200) {
              setLoader(false);
              toast.success(message);
              history.push("/lms/support");
            }else{
              setLoader(false);
              toast.error(message);
      
            }
          }
        }
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

  };

  return (
    <>
      <Header />

      <section className="free-testing-sec">
        <div className="container">
          <div className="pagination">
            <span>
              <Link to="/lms/support">
                <i className="fas fa-chevron-left" />
                Ticket List
              </Link>
            </span>
          </div>
          <div className="main-body">
            <div className="row gutters-sm search-section">
              <div className="col-md-12">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="tabbable-line">
                      <ul className="nav nav-tabs ">
                        <li>
                          <a
                            href="#tab_default_1"
                            data-toggle="tab"
                            className="active"
                          >
                            Create Ticket{" "}
                          </a>
                        </li>
                       
                      </ul>
                      <div className="tab-content">
                        <div className="tab-pane active" id="tab_default_1">
                          <div className="row">
                            <div className="sign-tab-detail col-md-12">
                              
                              <div className="select-class select-testing">
                                <p>Title</p>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Title"
                                  name="title"
                                  value={updateForm.title}
                                  onChange={handleEditChange}
                                />
                              </div>
                            </div>
                            <div className="sign-tab-detail col-md-12">
                              <div className="select-subject select-testing">
                                <p>Content</p>
                                <textarea value={updateForm.content} className="form-control" name="content" onChange={handleEditChange} />
                              </div>
                            </div>
                            <div className="sign-tab-detail col-md-12">
                              <div className="select-subject select-testing">
                                <p>Select Category</p>
                                <select id="category_id" name="category_id" className="form-control" onChange={handleCategoryChange}>
                                <option value=''>Select Category</option>
                                {category &&
                                    category.map((item, index) => (
                                      <option value={item.id} key={index}>
                                        {" "}
                                        {item.name}{" "}
                                      </option>
                                ))}
                                    
                                </select>
                              </div>
                              <div className="select-testing">
                                <div className="submit-btn" style={{float:"left"}}>
                                  <button
                                    value="Save Feedback"
                                    className="common-btn"
                                    onClick={handleCreateTicket}
                                    disabled={loader}
                                  >
                                          Submit
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

export default CreateTicket;
