import { Link } from "react-router-dom";
import Footer from "../../components/Footer"
import Header from "../../components/Header"

const DownloadApp = () => {
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
                        <h2>Download the app for iOS or Android</h2>
                        <div className="row mt-5">
                            <div className="col-6">
                                <button className="common-btn"> <i class="fas fa-solid fa-robot"></i> Download iSO</button>
                            </div>
                            <div className="col-6">
                                <button className="common-btn"> <i class="fas fa-solid fa-robot"></i> Download Android</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default DownloadApp