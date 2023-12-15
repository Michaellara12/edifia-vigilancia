import { styled, alpha, Box, Stack, Typography, Fab } from '@mui/material';
import Iconify from '../iconify/Iconify';

// ----------------------------------------------------------------------

export const StyledPictureContainer = styled('div')(({ theme }) => ({
    width: '100%',
    height: 160,
    margin: 'auto',
    display: 'flex',
    cursor: 'pointer',
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  }));
  
export const StyledPlaceholder = styled('div')(({ theme }) => ({
    zIndex: 7,
    display: 'flex',
    borderRadius: 10,
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
  zIndex: 1,
  backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 2px, transparent 2px), radial-gradient(circle, rgba(0, 0, 0, 0.1) 2px, transparent 2px)',
  backgroundSize: '32px 32px',
  backgroundPosition: '0 0, 16px 16px'
});

// ----------------------------------------------------------------------

export const DeskTopSignatureDecor = () => {
  return (
    <Box 
    sx={{ 
      zIndex: 3, 
      position: 'fixed',
      bottom: 40,
      width: '100%',
      px: 8
    }}
  >
    <Stack>
      <Box sx={{ height: 2, bgcolor: 'text.disabled' }} />
        
      <Stack direction='row' sx={{ mt: 1 }}>
        <Iconify 
          icon='ph:signature' 
          color='text.disabled'
          sx={{ width: 24, height: 24, mr: 1 }}
        />
          
        <Typography color='text.disabled'>Agregar firma</Typography>
        </Stack>
    </Stack>
  </Box>
  )
}

export const MobileSignatureDecor = () => {
  return (
    <Box 
      sx={{ 
        zIndex: 3, 
        position: 'fixed',
        right: 28,
        height: '100%',
        py: 3
      }}
    >
      <Stack direction='row' sx={{ height: '100%' }}>
        <Box sx={{ width: 2, bgcolor: 'text.disabled' }} />
      </Stack>
    </Box>
  )
}

// ----------------------------------------------------------------------

type ActionButtonStackProps = {
  handleClose: () => void
  handleReset: () => void
  handleSave: () => void
}

export const ActionButtonStack = ({ 
  handleClose, 
  handleReset, 
  handleSave 
}: ActionButtonStackProps) => {
  return (
    <Box 
      sx={{ 
        zIndex: 3, 
        position: 'fixed',
        top: 10,
        ml: 2
      }}
    >
      <Stack direction='row' gap={2}>
        <Fab 
          onClick={handleClose} 
          size='small'
        >
          <Iconify icon='mingcute:close-fill'/>
        </Fab>

        <Fab 
          onClick={handleSave} 
          size='small'
          color='success'
        >
          <Iconify icon='akar-icons:save'/>
        </Fab>

        <Fab 
          onClick={handleReset} 
          size='small'
          color='info'
        >
          <Iconify icon='iconamoon:restart-bold'/>
        </Fab>
      </Stack>
    </Box>
  )
}
