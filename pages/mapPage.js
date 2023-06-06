
import React, { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Map from '@components/Map';

const MapPage = () => {
    
  return (
    <>
        <Navbar />
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
    </>
  );
};

export default MapPage;
