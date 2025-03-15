import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const TermsAndUse = props => {
  const [termsAndConditions, setTermsAndConditions] = useState([])

  const title = termsAndConditions?.data?.title
  const subTitle = termsAndConditions?.data?.sub_title
  const description = termsAndConditions?.data?.description

  // console.log(subTitle)

  useEffect(() => {
    fetch('https://examtice.com/backend/api/terms-of-use')
      .then(res => res.json())
      .then(data => setTermsAndConditions(data))
  }, [])

  //   console.log(termsAndConditions)

  return (
    <>
      <Header />
      <section className='terms-and-condition'>
        <div className='container'>
          <h2 className='page-heading'>{title}</h2>
          {subTitle && <p>{subTitle}</p>}
          {description && (
            <div className='termsAndCondition'>
              <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

export default TermsAndUse;
