import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function PrivacyPolicy () {
  return (
    <div>
      <Header />
      <section className='mb-5'>
        <div className='container'>
          <h2 className='page-heading'>Privacy Policy</h2>
          <p>
            At Examitce.com, we are committed to protecting the privacy and
            confidentiality of our users. This Privacy Policy explains how we
            collect, use, and protect your personal information when you access
            and use our website, mobile apps (Windows, Android, iOS), and
            services. By using our platform, you consent to the collection and
            use of information in accordance with this policy
          </p>
          <h6>1. Information We Collect</h6>
          <p>
            We collect both personal and non-personal information to provide and
            improve our services. The types of information we collect include:
          </p>
          <ul>
            <li className='mb-2'>
              <b>Personal Information:</b> When you register, subscribe to our
              services, or contact us, we may collect personal details such as
              your name, email address, phone number, and other relevant
              information.
            </li>
            <li className='mb-2'>
              <strong>Log Data: </strong> As with many websites, we collect
              information that your browser sends whenever you visit our site.
              This data may include your IP address, browser type, operating
              system, referring/exit pages, date and time of your visit, and
              other usage statistics. This data helps us analyze trends,
              administer the site, and improve user experience.
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> We use
              cookies, web beacons, and similar technologies to enhance your
              experience, analyze site traffic, and personalize content. Cookies
              are small data files stored on your device that help us remember
              your preferences and actions during your visit.
            </li>
          </ul>
          <h6>2. Use of Information</h6>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li className='mb-2'>
              To provide, maintain, and improve our services, including user
              support and site functionality.
            </li>
            <li className='mb-2'>
              To customize content, ads, and promotions based on your
              preferences and usage patterns.
            </li>
            <li className='mb-2'>
              To communicate with you regarding account updates, new services,
              promotional offers, and other relevant information.
            </li>
            <li>
              To monitor and analyze usage data to improve site performance,
              identify issues, and enhance user experience.
            </li>
          </ul>

          <h6>3. Third-Party Services</h6>
          <p>
            We may use third-party services to display ads or provide additional
            functionality on our site. These third-party providers may collect
            information, including your IP address, browser type, and browsing
            activity, through cookies and other tracking technologies
          </p>
          <ul>
            <li className='mb-2'>
              Google DART Cookie: Google, as a third-party vendor, uses the DART
              cookie to serve ads based on your visits to Examitce.com and other
              sites on the internet. You can optout of the DART cookie by
              visiting the Google Ad and Content Network Privacy Policy.
            </li>
            <li>
              Third-Party Advertisers: We work with ad networks such as Google
              Adsense to display ads on our site. These third-party ad networks
              use cookies, JavaScript, and web beacons 2 to collect data about
              your visits to our website and other websites to personalize the
              ads you see.
            </li>
          </ul>
          <p>
            Please note that we have no access to or control over the cookies
            used by third-party advertisers, and their privacy practices are
            governed by their own policies.
          </p>
          <h6>4. Data Security</h6>
          <p>
            We take reasonable steps to protect the personal data you share with
            us from unauthorized access, alteration, or disclosure. However,
            please be aware that no method of data transmission over the
            internet is completely secure, and we cannot guarantee absolute
            security.
          </p>

          <h6>5. Managing Cookies</h6>
          <p>
            You can control how cookies are handled through your browser
            settings. Most browsers allow you to accept or reject cookies, clear
            cookies, or set up alerts when cookies are being sent. Please note
            that disabling cookies may limit certain features of the site and
            affect your user experience.
          </p>
          <p>
            For more information on managing cookies with your specific browser,
            visit your browser’s help section.
          </p>

          <h6>6. Links to External Sites</h6>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the content or privacy practices of these external
            sites. We encourage you to review the privacy policies of any
            website you visit.
          </p>

          <h6>7. Changes to This Privacy Policy</h6>
          <p>
            Examitce.com reserves the right to update or modify this Privacy
            Policy at any time. Any changes will be posted on this page with an
            updated date. We encourage you to review this policy periodically
            for any updates.
          </p>

          <h6>8. Your Rights and Choices</h6>
          <p>
            {' '}
            You have the right to access, correct, or delete your personal
            information that we hold. If you wish to update your information or
            have any concerns about your data, please contact us through the
            contact details provided below.
          </p>

          <h6>9. Contact Us</h6>
          <p>
            If you have any questions or concerns about our Privacy Policy or
            the way we handle your personal data, please contact us at: <br />
            <span>
              <strong>Email : </strong> support@examtice.com
            </span>
            <br />
            <span>
              <strong>Phone:</strong> +234 8127 – 0000-20, +234 8155-5523-77
            </span>
            <br />
            <span>
              <strong>Address:</strong> Plot B33, Valencia Garden Estate, Dakwo
              District, Abuja
            </span>
          </p>
          
        </div>
      </section>
      <Footer />
    </div>
  )
}
