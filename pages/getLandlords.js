import React, { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Landlords from '@components/Landlords';

const LandlordsPage = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    async function fetchOwners() {
      const response = await fetch('./df_grouped_json.json');
      const data = await response.json();
      console.log(data);
      setOwners(data);
    }

    fetchOwners();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="owners">Owners and Violations</h1>
      <hr></hr>
      <p className="owners-text">The Top 100 bad landlords in Boston</p>
      <Landlords ownersData={owners} />
    </>
  );
};

export default LandlordsPage;
