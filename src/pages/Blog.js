import React, { useContext, useEffect, useState } from 'react'
//import { Link, useHistory } from "react-router-dom";
import Header from '../components/Header'
import { Link, useHistory } from 'react-router-dom'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { GET_LATEST_BLOGS } from '../components/Api'
import { removeTags } from '../components/CommonFunction'
import { global } from '../components/Config'
import Spinner from '../components/spinner/Spinner'
import DarkAndLightMode from '../DarkAndLightMode/DarkAndLightMode'
import Pagination from '../Pagination/Pagination'
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt'
import { useSelector } from 'react-redux'
import { userAuth } from '../features/userSlice'

const Blog = () => {
  const [blogs, setBlogs] = useState([])
  const [data, setData] = useState([])
  const isAuth = useSelector(userAuth) //using redux useSelector here
  const [loader, setLoader] = useState(false)
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(5)

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }

  //paniganition with 5 posts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoader(true)
      const res = await axios.get(GET_LATEST_BLOGS)
      setPosts(res.data.data)
      setLoader(false)
    }

    fetchPosts()
  }, [])

  //get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  //change page
  const paginate = pageNumber => setCurrentPage(pageNumber)

  // console.log(currentPosts)

  //Get courses on page load
  const getBlogs = async () => {
    try {
      setLoader(true)
      const {
        data: { data, status }
      } = await axios.get(GET_LATEST_BLOGS)
      if (status == 200) {
        setLoader(false)
        setBlogs(data)
      }
    } catch (err) {
      setLoader(false)
      toast.error('Something went wrong please try again..!')
    }
  }

  const formatUpdateDate = date => {
    const formattedDate = new Date(date)
    return `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${formattedDate.getDate().toString().padStart(2, '0')}`
  }

  useEffect(() => {
    getBlogs()
  }, [])

  const autoReload = () => {
    // Reload the current page
    window.location.reload()
  }

  console.log(currentPosts)

  const { isDarkMode } = useContext(ThemeContext)

  return (
    <>
      {/* <DarkAndLightMode></DarkAndLightMode> */}
      <Header />
      <section className='blog-page-main block-element'>
        <div className='container'>
          <div className='pagination'>
            <span
              onClick={autoReload}
              className={`${
                isDarkMode ? 'text_color_light' : 'text_color_dark'
              }`}
            >
              <Link to={isAuth ? '/user/dashboard' : '/'}>
                <i className='fas fa-chevron-left' />
                Back
              </Link>
            </span>
          </div>

          <div className='row'>
            {loader ? (
              <div className='spinner_div' style={{ minHeight: '400px' }}>
                <Spinner />
              </div>
            ) : (
              <>
                <div className='col-md-9'>
                  <div className='blog-content'>
                    {currentPosts.length > 0 ? (
                      currentPosts.map((item, i) => (
                        <div className='blog-content-inner' key={i}>
                          <Link to={`/blog/${item.slug}`} id={item.slug}>
                            {item?.image === "" ? (
                              item?.video ? (
                                <video
                                  src={
                                    `${global.API_HOST}assets/images/blogs/` +
                                    item.video
                                  }
                                  controls
                                  className='w-100'
                                ></video>
                              ) : (
                                // item?.video_url
                                <iframe width="100%" height="600" src={item?.video_url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                              )
                            ) : (
                              <img
                                src={
                                  `${global.API_HOST}assets/images/blogs/` +
                                  item.image
                                }
                                alt=''
                              />
                            )}
                            {/* {item?.image !== '' ? (
                              <img
                                src={
                                  `${global.API_HOST}assets/images/blogs/` +
                                  item.image
                                }
                                alt=''
                              />
                            ) : (
                              ""
                            )} */}
                            <span
                              className={`${
                                isDarkMode
                                  ? 'blog-date-dark'
                                  : 'blog-date-light'
                              }`}
                            >
                              Last Update on {formatUpdateDate(item.updated_at)}
                            </span>
                            <span>{item.title}</span>
                          </Link>
                          <div className='content'>
                            <p>
                              {removeTags(item.description).length > 300
                                ? removeTags(item.description).substring(
                                    0,
                                    300
                                  ) + '...'
                                : removeTags(item.description)}
                            </p>
                          </div>
                          <Link
                            className='common-btn'
                            to={`/blog/${item.slug}`}
                            id={item.slug}
                          >
                            Read More
                          </Link>
                        </div>
                      ))
                    ) : (
                      <p>No Blog found..!</p>
                    )}
                  </div>
                </div>
                <div className='col-md-3 col-12'>
                  <div className='blog-content-list'>
                    <div className='recen-post'>
                      {' '}
                      <span>Recent Posts</span>
                      <ul>
                        {currentPosts.length > 0 ? (
                          currentPosts.map((item, i) => (
                            <li key={i}>
                              {' '}
                              <Link
                                className=''
                                to={`/blog/${item.slug}`}
                                id={item.slug}
                              >
                                {item.title}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <p>No Recent Post found..!</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <Pagination
            postsPerpage={postsPerPage}
            totalPosts={posts.length}
            paginate={paginate}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          ></Pagination>
        </div>
      </section>

      <Footer />
      {/* < ToastContainer /> */}
    </>
  )
}

export default Blog
