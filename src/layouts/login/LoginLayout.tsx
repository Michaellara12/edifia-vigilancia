// @mui
import { Stack, Box } from '@mui/material';
// components
import { m } from 'framer-motion';
import { MotionContainer, varBounce } from 'src/components/animate';
import Image from '../../components/image';
import NomanLogo from 'src/components/logo/NomanLogo';
// styles
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
  subtitle?: string;
};

export default function LoginLayout({ children, illustration, title, subtitle }: Props) {
  return (
    <StyledRoot>
      <Box
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      >
        <NomanLogo />
      </Box>

      <StyledSection>
        <MotionContainer>
          <m.div variants={varBounce().in}>
            <Image
              disabledEffect
              visibleByDefault
              alt="auth"
              src={illustration || '/assets/illustrations/residential-complex2.png'}
              sx={{ maxWidth: 720 }}
            />
          </m.div>
        </MotionContainer>

        <StyledSectionBg />
      </StyledSection>

      <StyledContent>
        <Stack> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
