import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Disclaimer () {
    const [disclaimer, setDisclaimer] = useState([]);

    const title = disclaimer?.data?.title
    const subTitle = disclaimer?.data?.sub_title
    const description = disclaimer?.data?.description

  useEffect(() => {
    fetch('https://examtice.com/backend/api/disclaimer')
      .then(res => res.json())
      .then(data => setDisclaimer(data))
  }, [])

  return (
    <div>
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

      {/* <section className='mb-5'>
        <div className='container'>
          <h2 className='page-heading'>Disclaimer</h2>
          <p>
            Examitce.com provides educational materials and exam preparation
            resources to enhance user convenience and access to information
            based on available data. While we strive for accuracy, Examitce.com
            does not take responsibility for unintended errors or alternative
            interpretations of the information provided on this platform. We
            encourage users to verify details directly from official sources,
            including the official websites of relevant schools, organizations,
            or government bodies, to obtain the most accurate and complete
            information.
          </p>
          <h6>No Government Affiliation or Authorization</h6>
          <p>
            Examitce.com is a private educational platform and is not affiliated
            with, endorsed by, or authorized by any government entity to provide
            official government services. Our resources, including past
            questions and preparatory materials, are for personal educational
            use only and should not be interpreted as government-issued
            materials or services. Users seeking official information should
            consult recognized government portals and authorized sources.
          </p>

          <h6>Intellectual Property and Trademark Notice</h6>
          <p>
            All names, acronyms, and trademarks displayed on Examitce.com and
            our related apps are the property of their respective owners. These
            names and trademarks are used solely for informational purposes and
            do not imply any association, sponsorship, or endorsement by their
            respective owners.
          </p>
          <p>
            By using Examitce.com and our mobile apps, you acknowledge and agree
            to this disclaimer.
          </p>
        </div>
      </section> */}
      <Footer />
    </div>
  )
}
