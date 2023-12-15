// MUI
import { Box, Container, Grid} from '@mui/material';
// Components
import { ChatbotFAQTable } from 'src/components/chatbot-settings';

export default function ChatbotConfig() {

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
            >
              <ChatbotFAQTable />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}