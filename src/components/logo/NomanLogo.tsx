import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { Box, Link, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const NomanLogo = forwardRef<HTMLDivElement, LogoProps>(
    ({ disabledLink = false, sx, ...other }, ref) => {
  
      const logo = (
        <Box
          ref={ref}
          component="div"
          sx={{
            width: 'auto',
            height: 50,
            display: 'inline-flex',
            ...sx,
          }}
          {...other}
        >
          <img src='/logo/noman-lettering-flat.png'/>
        </Box>
      );
  
      if (disabledLink) {
        return logo;
      }
  
      return (
        <Link component={NextLink} href="/" sx={{ display: 'contents' }}>
          {logo}
        </Link>
      );
    }
  );
  
  export default NomanLogo;