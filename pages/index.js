import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Navbar from '@components/Navbar'
import Map from '@components/Map'
import { Grid } from '@mui/material';


export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>bad landlords</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="header-container">
            <div className="header-body">
              <div className="header-body-h">
                   <h1>Scofflaw <br></br>Owners<br></br> Boston</h1>
              </div>
              <div className="header-body-p">
                   <p >
                  Discover the Truth About Boston's Bad Landlords<br></br> Our Website Exposes Property 
                  Violations and Brings Transparency to  <br></br>Code Enforcement, Empowering Tenants
                  and Advocating for a Fair Housing System
              </p>
              </div>
            </div>
            <div className="header-two">
              <h2 className="header-title">Boston Neighborhood Building Evaluation Results</h2> 
              <hr></hr>
              <p>We are dedicated to shedding light on scofflaw code violators in Boston, 
                empowering residents to make informed decisions about their housing options.
                We gather data from various sources, including the Boston Property Assessment and Boston
                Building Violations datasets, to identify properties with multiple violations.
                </p>
            </div>
        </div>
        <div className="grid">
            <div className="grid-container">
            <div className="grid-item"><span>100</span><br></br> Worst Scofflaw Landlords</div>
            <div className="grid-item">Interactive Map</div>
            <div className="grid-item">Total number of cases <br></br> <span>4,568</span> </div>
            <div className="grid-item">Total number of cases <br></br> <span>1,568</span> </div>
            <div className="grid-item">Total number of cases <br></br> <span>898</span> </div>
            <div className="grid-item">Total number of cases <br></br> <span>100</span> </div>
          </div>
        </div>
        <div className="more-info">
            <h2>Find out more about us</h2>
            <hr></hr>
            <p>
              Our ultimate goal is to create a trackable system for property violations 
              and develop a matrix to determine if a landlord is a bad landlord. 
              With this information, we aim to advocate for stricter enforcement 
              and more transparent regulations to protect tenants from unsafe and 
              unhealthy living conditions.
            </p>
            <div className="more-info-bottom">
                <div className="more-info-img">
                    <div className="image">
                      
                    </div>
                </div>
                <p className="more-info-text">
                    Councilor Breadon's mission to increase accessibility and transparency
                    in the Boston planning and development process aligns with our goals 
                    of promoting accountability and responsibility among property owners 
                    and landlords.
                    Through our website, you can access up-to-date information on property
                    violations, learn about your rights as a tenant, and join us in advocating
                    for a fair and just housing system in Boston.
                    Join our community today and help us make Boston a better place
                    to live for all residents.
                </p>

            </div>
        </div>
        
      </main>
      <Footer />
    </div>
  )
}
