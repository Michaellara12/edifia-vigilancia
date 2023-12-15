import { Box } from '@mui/material';
import useResponsive from 'src/hooks/useResponsive';

// ----------------------------------------------------------------------

type Props = {
  signature: string | null;
};

export default function SignaturePreview({ signature }: Props) {
  const isMobile = useResponsive('down', 'sm');

  if (!signature) {
    return null;
  }

  const imgStyle = {
    height: isMobile ? 280 : 200,
    transform: isMobile ? 'rotate(90deg)' : 'none' // Rotate if isMobile is true
  };

  return (
    <Box sx={{ mt: -7 }}>
      <img src={signature} style={imgStyle} />
    </Box>
  );
}
