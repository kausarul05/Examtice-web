import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AffiliateTermsAndCondition = (props) => {
    const [affiliateTermsAndConditions, setAffiliateTermsAndCondition] = useState([])

    const title = affiliateTermsAndConditions?.data?.title
    const subTitle = affiliateTermsAndConditions?.data?.sub_title
    const description = affiliateTermsAndConditions?.data?.description

    useEffect(() => {
        fetch("https://examtice.com/backend/api/affiliate-terms-condition")
            .then(res => res.json())
            .then(data => setAffiliateTermsAndCondition(data))
    }, [])

    // console.log(affiliateTermsAndConditions)

    return (
        <>
            <Header />
            <section className="terms-and-condition">
                <div className="container">
                    <h2 className="page-heading">{title}</h2>
                    {/* <h2 className="page-heading">General Terms & Conditions</h2> */}
                    {subTitle && <p>{subTitle}</p>}
                    {description && (
                        <div className="termsAndCondition">
                            <div dangerouslySetInnerHTML={{ __html: description }}></div>
                        </div>
                    )}
                </div>

            </section>

            <Footer />
        </>
    );
};

export default AffiliateTermsAndCondition;
