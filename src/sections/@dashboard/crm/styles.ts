import { Typography, styled } from "@mui/material";

// ------------------------

export const StyledTypography = styled(Typography)(() => ({
  userSelect: 'none', // stops text selection which is pretty annoying in mobile
}));