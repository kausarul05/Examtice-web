import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useDispatch, useSelector } from "react-redux";
import { login, profile } from "../../features/userSlice";
import Cookies from "js-cookie";
import axios from "axios";
import { AFFILIATE_SUBSCRIPTION_USERS } from '../../components/Api';
import { useContext } from 'react';
import { ThemeContext } from '../../ThemeContaxt/ThemeContaxt';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const RefferUser = () => {
    const [getUsers, setGetUsers] = useState([])

    useEffect(() => {
        getAffiliateDashboard();
    }, []);

    const getAffiliateDashboard = async () => {
        try {
            const config = {
                headers: {
                    Authorization: Cookies.get("token"),
                },
            };

            fetch(AFFILIATE_SUBSCRIPTION_USERS, config)
                .then(res => res.json())
                .then(data => setGetUsers(data.data))

        }
        catch (error) {
            console.log("error", error);
        }
    };
    // console.log(getUsers)

    const autoReload = () => {
        // Reload the current page
        window.location.reload();
    };

    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div>
            <Header></Header>
            <div style={{ height: '50vh' }}>



                {getUsers.length > 0 ?
                    (
                        <>
                            <div className={`container mt-4 ${isDarkMode ? 'table-dark' : 'table-white'} `}>

                                <div className="pagination">
                                    <span onClick={autoReload} className={`${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                                        <Link to="/affiliate/dashboard">
                                            <i className="fas fa-chevron-left" />
                                            Back
                                        </Link>
                                    </span>
                                </div>

                                <h2>RefferUser</h2>
                            </div>

                            <table className={`table table-striped container ${isDarkMode ? 'table-dark' : 'table-white'}`}>
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">User Phone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        getUsers.map(user => (
                                            <tr>
                                                <th scope="row">1</th>
                                                <td>{user.first_name}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.phoneno}</td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </>
                    )
                    :
                    (
                        <div className='container mt-4 '>
                            <div className="pagination">
                                    <span onClick={autoReload} className={`${isDarkMode ? 'text_color_light' : 'text_color_dark'}`}>
                                        <Link to="/affiliate/dashboard">
                                            <i className="fas fa-chevron-left" />
                                            Back
                                        </Link>
                                    </span>
                                </div>
                            <h1>No User Reffer Your Code</h1>
                        </div>
                    )
                }
            </div>
            <Footer></Footer>
        </div>
    )
}


export default RefferUser
