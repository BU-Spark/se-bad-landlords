
import React, { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Map from '@components/Map';
import NewMap from '@components/NewMap/NewMap';
const MapPage = () => {
    
  return (
    <>
        <Navbar />
        <div className="landing-body bottom-10">
            <div className="section-title">
                <h2 className="section-title-header">Bad Landlords Visualization</h2>
            </div>
            <hr className="hr-index"></hr> 
            <NewMap />
            <div id="popupContainer">
            </div>
        </div>
    </>
  );
};

export default MapPage;
