import React, { useEffect, useState } from 'react'
//import { Link, useHistory } from "react-router-dom";
import Header from '../components/Header'
import { useParams } from 'react-router-dom'
import { Link, useHistory } from 'react-router-dom'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { GET_LATEST_BLOGS, GET_SINGLE_BLOG } from '../components/Api'
import { global } from '../components/Config'
import Spinner from '../components/spinner/Spinner'
import { useContext } from 'react'
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt'
import { useSelector } from 'react-redux'
import { userAuth } from '../features/userSlice'

const BlogSingle = () => {
  const [singleBlog, setBlogPost] = useState([])
  const [blogs, setBlogs] = useState([])
  const { slug } = useParams()
  const [loader, setLoader] = useState(false)
  const isAuth = useSelector(userAuth) //using redux useSelector here
  const history = useHistory()

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }

  const body = {
    slug: slug
  }

  //Get courses on page load
  const getSingleBlog = async () => {
    try {
      setLoader(true)

      const {
        data: { data, status, message }
      } = await axios.post(GET_SINGLE_BLOG, body)
      if (status == 200) {
        setLoader(false)
        setBlogPost(data)
      } else {
        toast.error(message)
        history.push('/blog')
      }
    } catch (err) {
      setLoader(false)

      toast.error('Something went wrong please try again..!')
    }
  }

  //Get courses on page load
  const getBlogs = async () => {
    try {
      const {
        data: { data, status }
      } = await axios.get(GET_LATEST_BLOGS)
      if (status === 200) {
        data && setBlogs(data)
      }
    } catch (err) {
      toast.error('Something went wrong please try again..!')
    }
  }

  function blogDescription (text) {
    return <div dangerouslySetInnerHTML={{ __html: text }} />
  }

  const formatUpdateDate = date => {
    const formattedDate = new Date(date)
    return `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${formattedDate.getDate().toString().padStart(2, '0')}`
  }

  useEffect(() => {
    getSingleBlog()
    getBlogs()
  }, [slug])

  const { isDarkMode } = useContext(ThemeContext)

  const autoReload = () => {
    // Reload the current page
    window.location.reload()
  }

  return (
    <>
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
              <Link to={isAuth ? '/blog' : '/blog'}>
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
                    <div className='blog-content-inner'>
                      {/* {singleBlog?.img === null ? (
                        singleBlog?.video ? (
                          <video
                            src={
                              `${global.API_HOST}assets/images/blogs/` +
                              singleBlog.video
                            }
                            controls
                            className='w-100'
                          ></video>
                        ) : (
                          singleBlog?.video_url
                        )
                      ) : (
                        <img
                          src={
                            `${global.API_HOST}assets/images/blogs/` +
                            singleBlog.image
                          }
                          alt=''
                        />
                      )} */}
                      {singleBlog?.image === '' ? (
                        singleBlog?.video ? (
                          <video
                            src={
                              `${global.API_HOST}assets/images/blogs/` +
                              singleBlog.video
                            }
                            controls
                            className='w-100'
                          ></video>
                        ) : (
                          // item?.video_url
                          <iframe
                            width='100%'
                            height='600'
                            src={singleBlog?.video_url}
                            title='YouTube video player'
                            frameborder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                            referrerpolicy='strict-origin-when-cross-origin'
                            allowfullscreen
                          ></iframe>
                        )
                      ) : (
                        <img
                          src={
                            `${global.API_HOST}assets/images/blogs/` +
                            singleBlog.image
                          }
                          alt=''
                        />
                      )}
                      <span
                        className={`${
                          isDarkMode ? 'blog-date-dark' : 'blog-date-light'
                        }`}
                      >
                        Last Update on {formatUpdateDate(singleBlog.updated_at)}
                      </span>
                      <span>{singleBlog.title}</span>
                      <div className='content'>
                        {blogDescription(singleBlog.description)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='blog-content-list'>
                    <div className='recen-post'>
                      {' '}
                      <span>Recent Posts</span>
                      <ul>
                        {blogs.length > 0 ? (
                          blogs.slice(0, 6).map((item, i) => (
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
        </div>
      </section>

      <Footer />
      {/* < ToastContainer /> */}
    </>
  )
}

export default BlogSingle
