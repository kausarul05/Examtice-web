import React, { useContext, useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ThemeContext } from '../../ThemeContaxt/ThemeContaxt';

export default function Resources() {
    const { isDarkMode } = useContext(ThemeContext);
    const [resources, setResources] = useState([])


    useEffect(() => {
        fetch("https://www.examtice.com/backend/api/resources/list")
            .then(res => res.json())
            .then(data => setResources(data.data))
    }, [])

    return (
        <>
            <Header />
            <section className="free-testing-sec">
                <div className="container">
                    <div>
                        <span className="pagination text_color_light">
                            <Link to="/user/dashboard">
                                <i className="fas fa-chevron-left" />
                                Back
                            </Link>
                        </span>
                    </div>
                    <div>
                        <table className={`${isDarkMode ? 'table table-hover table-dark' : 'table table-white'}`}>
                            <thead>
                                <tr>
                                    <th scope="row">S.no</th>
                                    <th>Recources Date</th>
                                    <th>Link</th>
                                    <th>Download</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    resources.map((resource, index) => (
                                        <tr>
                                            <td>{index + 1 }</td>
                                            <td>{resource.name}</td>
                                            <td>{resource.link}</td>
                                            <td className="tex-center">
                                                <a href={resource.link} className='text-white' download="document.docx">
                                                    <i class="fas fa-solid fa-download"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
