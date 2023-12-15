import { useState } from 'react';
// @mui
import { 
  Box, 
  Link, 
  Typography, 
  Stack,
  styled, 
  alpha, 
  useTheme,
} from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  return (
    <Link underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src={user?.photoUrl} alt={user?.displayName} name={user?.displayName} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2">
            {user?.displayName}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
