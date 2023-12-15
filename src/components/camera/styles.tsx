import { styled, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const StyledPictureContainer = styled('div')(({ theme }) => ({
    width: 180,
    height: 180,
    margin: 'auto',
    display: 'flex',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: '10%',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  }));
  
export const StyledPlaceholder = styled('div')(({ theme }) => ({
    zIndex: 7,
    display: 'flex',
    borderRadius: '10%',
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: `calc(100% - 16px)`,
    height: `calc(100% - 16px)`,
    color: theme.palette.text.disabled,
    backgroundColor: theme.palette.background.neutral,
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter,
    }),
  }));

// ----------------------------------------------------------------------

export const Wrapper = styled('div')({
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 1
});
  
export const Control = styled('div')({
    marginBottom: 20,
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    width: '100%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center'
});