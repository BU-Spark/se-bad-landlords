import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// Table component
const Table = ({ data }) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);

  // Calculate the number of rows to display per page
  const rowsPerPage = 25;

  // Update the rows state based on the current page
  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const visibleRows = data.slice(startIndex, endIndex);
    setRows(visibleRows);
  }, [data, page]);

  const handlePageChange = (params) => {
    setPage(params.page);
  };

  const columns = [
    { field: 'id', headerName: 'OwnerID', width: 100 },
    { field: 'owner', headerName: 'Landlord', width: 250 },
    { field: 'neighborhood', headerName: 'Neighborhood', width: 150 },
    { field: 'code', headerName: 'Code', width: 150 },
    {
      field: 'case_no',
      headerName: 'Case Number',
      type: 'number',
      width: 150,
    },
    { field: 'description', headerName: 'Violation Description', width: 450 },
  ];

  return (
    <div id="data-table" style={{ width: 'auto', height: '60vh' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}h
        rowsPerPageOptions={[5]}
        // Render the toolbar with grid options
        components={{
          toolbar: GridToolbar,
        }}
        // Handle page change event
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
