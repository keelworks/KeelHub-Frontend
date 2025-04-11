import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import PaginationItem from '@mui/material/PaginationItem';

export default function PaginationButtons({ page, setPage, totalPages }) {
    return (
      <Stack spacing={2}>
        <Pagination
          count={totalPages}         // total number of pages
          page={page}                // controlled current page
          onChange={(e, value) => setPage(value)}
          showFirstButton            // << button
          showLastButton             // >> button
          siblingCount={0}           // no numbers around current page
          boundaryCount={0}          // no edge numbers like 1 or last
          shape="rounded"            // gives rounded corners
          renderItem={(item) => (
            <PaginationItem
              {...item}
              sx={{
                borderRadius: '8px',
                border: '1px solid #ccc',
                minWidth: '36px',
                height: '36px',
              }}
            />
          )}
        />
      </Stack>
    );
  }
  
