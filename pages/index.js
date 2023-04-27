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
                Apartment buildings that are three or more storeys and 10 or more units are required to register with the City’s RentSafeTO program 
                and undergo building evaluations. During evaluations, staff inspect common areas, mechanical and security systems, 
                parking and exterior grounds. Learn more about building evaluations and audits. Use this tool to look up the evaluation scores of a building.
              </p>
              </div>
            </div>
            <div className="header-two">
              <h2 className="header-title">Boston Neighborhood Building Evaluation Results</h2> 
              <hr></hr> 
              <p>The Office of City Councilor Breadon of District 9 is interested in Bad Landlords in Boston. This website is centered
                around identifying risky landlords along with correlating factors for the different types of
                housing violations that these landlords commit. Find out more on the datasets here</p>  
              
              {/* <nav className="header-links-container">
                  <a href="https://data.boston.gov/dataset/building-and-property-violations1" className="link">Building-violations dataset</a>
                  <a href="https://data.boston.gov/" className="link">| Boston Analyze</a>
                  <a href="https://data.boston.gov/dataset/property-assessment" className="link">| Property-assessment dataset</a>
              </nav>   */}
            </div>
        </div>
        <div className="grid">
            <div class="grid-container">
            <div class="grid-item"><span>100</span><br></br> Worst Scofflaw Landlords</div>
            <div class="grid-item">Interactive Map</div>
            <div class="grid-item">Total number of cases <br></br> <span>4,568</span> </div>
            <div class="grid-item">Total number of cases <br></br> <span>1,568</span> </div>
            <div class="grid-item">Total number of cases <br></br> <span>898</span> </div>
            <div class="grid-item">Total number of cases <br></br> <span>100</span> </div>
          </div>
        </div>
              
        <div className="landing-body">
            <div className="section-title">
                <h2 className="section-title-header">Bad Landlords Visualization</h2>
            </div>
            <p className="section-header">Buildling violations in Boston neighborhoods</p>
            <hr className="hr-index"></hr> 
            <div className="map-container">
                <Map />
            </div>
            <div id="popupContainer">
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
