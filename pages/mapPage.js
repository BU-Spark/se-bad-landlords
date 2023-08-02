
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
            <p className="section-header">Buildling violations in Boston neighborhoods</p>
            <hr className="hr-index"></hr> 
            <div className="w-full mx-0 my-auto">
                <Map />
            </div>
            <p className='mt-8 mb-5 text-2xl'>New map</p>
            <NewMap />
            <div id="popupContainer">
            </div>
        </div>
    </>
  );
};

export default MapPage;
