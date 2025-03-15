import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import OwlCarousel from "../components/owl-carousel";
import { Link } from "react-router-dom";
import Spinner from "../components/spinner/Spinner";
import {
    home_crousal,
    promise,
    owlCourses,
    news,
    getTestDate,
    removeTags,
} from "../components/CommonFunction";
import {
    GET_COURSES,
    GET_LATEST_BLOGS,
    GET_TESTIMONIALS,
    ABOUT_HOME,
    HOME_PAGE_SLIDER,
    HOME_PAGE_VIDEO
} from "../components/Api";
import { global } from "../components/Config";
import { useDispatch, useSelector } from "react-redux";
import ContactUs from "../components/Contact-us";
import { ThemeContext } from "../ThemeContaxt/ThemeContaxt";
//import { selectTestimonials, setTestimonials } from "../features/userSlice";

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRef } from "react";



const Home = (props) => {
    const [blogs, setBlogs] = useState([]);
    const [courses, setCourses] = useState([]);
    const [aboutUs, setAboutUs] = useState([]);
    const [slider, setSlider] = useState([]);
    const [aboutUsLoader, setAboutUsLoader] = useState(false);
    const [blogLoader, setBlogLoader] = useState(false);
    const [courseLoader, setCourseLoader] = useState(false);
    const [testimonialsLoader, setTestimonialsLoader] = useState(false);
    const [testimonialsData, setTestimonialsData] = useState([]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const thumbRef = useRef(null);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [slides, setSlides] = useState([])
    const dispatch = useDispatch();

    useEffect(() => {
        getCourses();
        getBlogs();
        getTestimonials();
        getAboutUs()
        getSlider()
        getVideos()
    }, []);

    // Get latest course
    const getSlider = async () => {
        try {
            setCourseLoader(true);
            const {
                data: { data, status },
            } = await axios.get(HOME_PAGE_SLIDER);
            if (status == 200) {
                setSlider(data);
                setCourseLoader(false);
            }
        } catch (error) {
            setCourseLoader(false);
            console.log(error);
        }
    };
    // console.log(slider)

    // Get latest course
    const getCourses = async () => {
        try {
            setCourseLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_COURSES);
            if (status == 200) {
                setCourses(data);
                setCourseLoader(false);
            }
        } catch (error) {
            setCourseLoader(false);
            console.log(error);
        }
    };

    // Get About Us
    const getAboutUs = async () => {
        try {
            setAboutUsLoader(true);
            const {
                data: { data, status },
            } = await axios.get(ABOUT_HOME);
            if (status == 200) {
                setAboutUs(data);
                setAboutUsLoader(false);
            }
        } catch (error) {
            setAboutUsLoader(false);
            console.log(error);
        }
    };

    // Get latest blogs
    const getBlogs = async () => {
        try {
            setBlogLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_LATEST_BLOGS);
            if (status == 200) {
                setBlogs(data);
                setBlogLoader(false);
            }
        } catch (error) {
            setBlogLoader(false);
            console.log(error);
        }
    };

    // GET_TESTIMONIALS
    const getTestimonials = async () => {
        try {
            setTestimonialsLoader(true);
            const {
                data: { data, status },
            } = await axios.get(GET_TESTIMONIALS);
            if (status == 200) {
                setTestimonialsData(data);
                setTestimonialsLoader(false);
            }
        } catch (error) {
            setTestimonialsLoader(false);
            console.log(error);
        }
    };

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);



    // GET_vIDEO sLIDER
    useEffect(() => {
        // Update the number of items to display based on screen width
        const handleResize = () => {
            const screenWidth = window.innerWidth;

            if (screenWidth >= 1024) {
                // Large screen (desktop view)
                setItemsPerPage(10);
            } else if (screenWidth >= 768) {
                // Medium screen (tab view)
                setItemsPerPage(7);
            } else {
                // Small screen (mobile view)
                setItemsPerPage(2);
            }
        };

        // Initial setup
        handleResize();

        // Listen for window resize events
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    const getVideos = async () => {
        try {
            setCourseLoader(true);
            const {
                data: { data, status },
            } = await axios.get(HOME_PAGE_VIDEO);
            if (status == 200) {
                setSlides(data);
                setCourseLoader(false);
            }
        } catch (error) {
            setCourseLoader(false);
            console.log(error);
        }
    };

    // get video link img
    const [imgUrl, setImgUrl] = useState([]);

    const findImg = () => {
        const imgUrls = slides.map((slide) => {
            const iframeTag = slide.link;

            // Regular expression to extract the src attribute value
            const srcRegex = /src="([^"]+)"/;
            const match = iframeTag.match(srcRegex);

            if (match) {
                // Extract the video ID from the iframe src attribute
                const iframeSrc = match[1];
                const videoId = iframeSrc.match(/embed\/([^?]+)/)[1];

                // Constructing the thumbnail URL
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;


                return thumbnailUrl;
            }

            return null;
        });

        const filteredUrls = imgUrls.filter((url) => url !== null);
        setImgUrl(filteredUrls);
        console.log(filteredUrls);
    };

    useEffect(() => {
        findImg();
    }, [slides]);

    const handleMainSlideChange = (index) => {
        setCurrentSlide(index);
        setIsVideoPlaying(false);
    };

    const handlePlayButtonClick = (index) => {
        const video = document.getElementById(`video-${index}`);
        if (video) {
            video.play();
            setIsVideoPlaying(true);
        }
    };

    const goToNextThumbnail = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousThumbnail = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    // Calculate the current page index
    const currentPage = Math.floor(currentSlide / itemsPerPage);

    const visibleSlides = slides.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    // console.log(visibleSlides)


    return (
        <>
            <Header />
            {/* home page banner */}
            <section className="banner-section">
                <OwlCarousel
                    customid="home-crousal"
                    adClass="owl-carousel owl-theme"
                    options={home_crousal}
                >
                    {
                        slider.map(sl => (
                            <>
                                <div className="item">
                                    <a href={sl.link}>
                                        <img src={`https://www.examtice.com/backend${sl.image}`} alt="Examtice" />
                                    </a>
                                </div>
                            </>
                        ))
                    }
                </OwlCarousel>
            </section>

            <section className="service-home">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="about-left">
                                <h6>MAIN FEATURES</h6>
                                <h2 className="page-heading">Top Exams</h2>
                            </div>
                        </div>
                        {courseLoader ? (
                            <div className="spinner_div">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {courses.slice(0, 5).map((item, key) => (
                                    <div
                                        className="col-md-2 wow fadeInUp animate latest_courses"
                                        style={{ animationDuration: "1s" }}
                                        key={key}
                                    >
                                        <Link to={`/user/buy-package/${item.id}`}>
                                            <div className="service-inner">
                                                <img
                                                    src={
                                                        `${global.API_HOST}assets/images/courses/` +
                                                        item.image
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className={` service-inner-title ${isDarkMode ? 'course_des_dark_mode' : 'course_des_light_mode'}`}>
                                                <h3>{item.name}</h3>
                                                <p>{item.description}</p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </section>


            <section className={`${isDarkMode ? "video-section" : "video-section-light"}`}>
                <div className="container">
                    <div className="about-left">
                        <h6>TOUR</h6>
                        <h2 className="page-heading">Media Guide</h2>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Carousel
                            infiniteLoop={true}
                            selectedItem={currentSlide}
                            onChange={handleMainSlideChange}
                            className="video-carousel"
                            style={{ border: 'none' }}
                        >
                            {slides.map((slide, index) => (
                                <div className="video-content" key={index}>
                                    {slide && (
                                        <div className="video-slide" style={{ border: 'none' }}>
                                            <div dangerouslySetInnerHTML={{ __html: slide.link }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </Carousel>
                    </div>

                    <div className='thumbs' style={{ display: 'flex', justifyContent: 'center', marginTop: "20px" }} ref={thumbRef}>

                        <button onClick={goToPreviousThumbnail} className="rounded" style={{ width: "30px", background: "none", outline: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "25px", marginRight: "5px" }}><span><i class="fas fa-solid fa-chevron-left video-thumb-left-arrow"></i></span></button>

                        <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>

                            {visibleSlides.map((slide, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleMainSlideChange(currentPage * itemsPerPage + index)}
                                    className={`thumb-item ${currentPage * itemsPerPage + index === currentSlide ? 'selected-thumb' : ''}`}
                                    style={{
                                        listStyle: 'none',
                                        marginRight: '5px', // You can adjust the margin as needed
                                        background: currentPage * itemsPerPage + index === currentSlide ? 'blue' : 'none',
                                    }}
                                >
                                    <img
                                        src={imgUrl[index]} // Use the imgUrl corresponding to the current slide
                                        alt={`Image ${index + 1}`}
                                        width='100'
                                        style={{ backgroundColor: 'black' }}
                                    />
                                </li>
                            ))}
                        </div>

                        <button onClick={goToNextThumbnail} className="" style={{ width: "30px", background: "none", outline: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "25px" }}><span><i class="fas fa-solid fa-chevron-right video-thumb-right-arrow"></i></span></button>
                    </div>
                </div>
            </section>


            <section className="about-home">
                <div className="container">
                    {
                        aboutUsLoader ? (
                            <div className="spinner_div">
                                <Spinner />
                            </div>
                        )
                            :
                            (
                                <>
                                    <div className="row d-flex align-items-center">
                                        <div className="col-md-6 col-12">
                                            <div className="about-left">
                                                <h6>ABOUT US</h6>
                                                <h2 className="page-heading">{aboutUs.title}</h2>

                                                <div className="">
                                                    <p dangerouslySetInnerHTML={{ __html: aboutUs.description }}></p>
                                                </div>

                                                <Link className="common-btn" to="/about">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div >
                                        <div className="col-md-6 d-md-block d-none">
                                            <div className="about-right">
                                                <div className="row d-flex align-items-center">
                                                    <img src="assets/images/about-preview.png" />
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </>
                            )
                    }
                </div >
            </section >

            < section className="latest-news" >
                <div className="container">
                    <h2 className="page-heading">Latest News</h2>
                    {blogLoader ? (
                        <div className="spinner_div">
                            <Spinner />
                        </div>
                    ) : (
                        <OwlCarousel
                            adClass="owl-carousel owl-theme"
                            customid="news"
                            options={news}
                        >
                            {blogs &&
                                blogs.map((item, key) => (
                                    <div className={`item blog-item ${isDarkMode ? 'latest_news_dark_mode' : 'latest_news_light_mode'}`} key={key}>
                                        <Link to={`blog/${item.slug}`}>
                                            <div className="page-blog">
                                                <img
                                                    src={
                                                        `${global.API_HOST}assets/images/blogs/` +
                                                        item.image
                                                    }
                                                    alt={item.title}
                                                />
                                                <h5>{item.title}</h5>
                                                <p>
                                                    {removeTags(item.description).length > 100
                                                        ? removeTags(item.description).substring(0, 100) +
                                                        "..."
                                                        : removeTags(item.description)}
                                                </p>
                                                <div className="lates-clinder">
                                                    {/* <span>
                        <i className="fas fa-globe-asia" />
                        Long Name Here
                      </span> */}
                                                    <span>
                                                        <i className="fas fa-clock" />
                                                        {getTestDate(item.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </OwlCarousel>
                    )}
                    {blogs && (
                        <Link className="common-btn common-blue" to="/blog">
                            See More Blogs
                        </Link>
                    )}
                </div>
            </ section>

            {/* contact us form */}
            < ContactUs />
            {/* contact us form */}

            < Footer />
        </>
    );
};

export default Home;
