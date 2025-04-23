import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'

const DownloadApp = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768) // 768px এর নিচে হলে mobile ধরবে
    }

    checkDevice() // প্রথমবার চেক
    window.addEventListener('resize', checkDevice) // resize এও চেক করবে

    return () => window.removeEventListener('resize', checkDevice) // cleanup
  }, [])

  //   if (!isMobile) {
  //     return (
  //       <div style={{ padding: '50px', textAlign: 'center' }}>
  //         <div className='row mt-5'>
  //           <div className='col-6'>
  //             <button className='common-btn'>
  //               <i className='fas fa-solid fa-robot'></i> Download iSO
  //             </button>
  //           </div>
  //           <div className='col-6'>
  //             <button className='common-btn'>
  //               <i className='fas fa-solid fa-robot'></i> Download Android
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   }

  return (
    <>
      <Header />
      <section className='free-testing-sec'>
        <div className='container'>
          <div>
            <span className='pagination text_color_light'>
              <Link to='/user/dashboard'>
                <i className='fas fa-chevron-left' />
                Back
              </Link>
            </span>
          </div>
          <div>
            <h2>Download the app for iOS or Android</h2>
            {isMobile ? (
              <div className='row mt-5'>
                <div className='col-12'>
                  <button className='common-btn'>
                    <i className='fas fa-solid fa-robot'></i> Download Dasktop App
                  </button>
                </div>
              </div>
            ) : (
              <div className='row mt-5'>
                <div className='col-6'>
                  <button className='common-btn'>
                    <i className='fas fa-solid fa-robot'></i> Download iSO
                  </button>
                </div>
                <div className='col-6'>
                  <button className='common-btn'>
                    <i className='fas fa-solid fa-robot'></i> Download Android
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default DownloadApp
