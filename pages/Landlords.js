import React, { useState, useEffect } from 'react';

const Landlords = () => {
  const [owners, setOwners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/df_grouped_json.json`);
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(owners.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate the indexes for items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = owners.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <h1>Owners and Violations</h1>
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Case No</th>
            <th>Code</th>
            <th>Violation</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((owner) => (
            <tr key={owner.owner1_name}>
              <td>{owner.owner1_name}</td>
              <td>
                {owner.case_no.split(',').map((case_no, index) => (
                  <div key={index} className="case_no-item">
                    {case_no}
                  </div>
                ))}
              </td>
              <td>
                {owner.code.split(',').map((code, index) => (
                  <div key={index} className="code-item">
                    {code}
                  </div>
                ))}
              </td>
              <td>
                {owner.violation.split(',').map((violation, index) => (
                  <div key={index} className="violation-item">
                    {violation}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(owners.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Landlords;
