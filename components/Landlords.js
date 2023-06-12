import React, { useState, useEffect } from 'react';
import ContactsIcon from '@mui/icons-material/Contacts';
import Modal from '@mui/material/Modal';

// Landlords component
const Landlords = ({ ownersData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  // const [landlordsPerPage] = useState(10);

  // Count the number of violations per landlord.
  function countViolationsPerLandlord(data) {
    const violationsByOwner = {};

    data.forEach((item) => {
      const ownerName = item.owner1_name;
      if (ownerName === undefined) {
        return;
      }

      if (!violationsByOwner.hasOwnProperty(ownerName)) {
        violationsByOwner[ownerName] = 0;
      }

      violationsByOwner[ownerName] += countItemsInLocId(item.loc_id);
    });

    return violationsByOwner;
  }

  // Get the top landlords with the highest number of violations.
  function getTopOwners(data) {
    const violationsByOwner = countViolationsPerLandlord(data);
    const topOwners = Object.entries(violationsByOwner)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return topOwners;
  }
 
  // Count the number of items in the loc_id string
  function countItemsInLocId(locId) {
    const regex = /F[^,]*/g;
    const matches = locId.match(regex);
    return matches ? matches.length : 0;
  }

  const topOwners = ownersData ? getTopOwners(ownersData) : [];
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenModal = (owner) => {
    setSelectedOwner(owner);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOwner(null);
    setOpen(false);
  };

  const PAGE_SIZE = 10;
  const lastPageIndex = Math.ceil(topOwners.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, topOwners.length);
 
  return (
    <div className="landlords-list">
      {/* Display top owners */}
      {topOwners.slice(startIndex, endIndex).map(({ name, count }) => (
        <div className="landlord" key={name}>
          <div className="landlord-title-container">
            {/* Owner icon */}
            <p className="contacts-icon">
              <ContactsIcon fontSize="large" />
            </p>
            <h2 className="landlord-title">{name}</h2>
            <button className="violations-button" onClick={() => handleOpenModal({ name, count })}>
              View violations
            </button>
          </div>
          <hr className="landlords-hr"></hr>
          {/* Display violations per owner */}
          {ownersData
            .filter((item) => item.owner1_name === name)
            .slice(0, 10)
            .map((item) => (
              <div className="violations-text" key={item.loc_id}>
                <h3 className="violations-text-h3">
                  Number of Violations : {countItemsInLocId(item.loc_id)}
                </h3>
              </div> 
          ))}
        </div>
      ))}
      
      <div className="pagination-buttons">
        {/* Pagination */}
        {Array.from({ length: 10 }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <br></br>
      {/* Modal for displaying violations */}
      {selectedOwner && (
        <Modal className="modal-content" open={Boolean(selectedOwner)} handleClose={handleCloseModal}>
          <>
          <button onClick={handleCloseModal}>Close</button>
          {/* Display violations per selected owner */}
          {ownersData
            .filter((item) => item.owner1_name === name)
            .slice(0, 10)
            .map((item) => (
              <div className="violation-item" key={item.loc_id}>
                <table>
                <thead>
                  <tr>
                    <th>Violation Code</th>
                    <th>Violation Descriptions</th>
                    <th>Number of Violations</th>
                  </tr>
                </thead>
                <tbody>
                  {ownersData
                    .filter((item) => item.owner1_name === selectedOwner.name)
                    .slice(0,5)
                    .map((item) => (
                      <tr key={item.loc_id}>
                        <td>{countItemsInLocId(item.loc_id)}</td>
                        <td style={{width: '700px', lineHeight: '1.3'}}>{item.violation.split(';').slice(0,5).map((violation, index) => (
                          <div key={index} className="violations-item">
                            {violation}
                          </div>
                        ))}
                        </td>
                        <td style={{width: '700px', lineHeight: '1.3'}}>{item.code.split(',').slice(0,5).map((code, index) => (
                          <div key={index} className="code-item">
                            {code}
                          </div>
                        ))}</td> 
                      </tr>
                    ))}
                  </tbody>
                  </table>
              </div>
              
            ))}
            
          </>
          </Modal>
        )}
      </div>
);
};

export default Landlords;
