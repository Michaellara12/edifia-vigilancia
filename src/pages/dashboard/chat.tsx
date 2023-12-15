// next
import Head from 'next/head';
// @mui
import { Container, Card  } from '@mui/material';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import { Chat } from 'src/sections/@dashboard/chat';

// ----------------------------------------------------------------------

ChatPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ChatPage() {

  return (
    <>
      <Head>
        <title> Chat | Noman AI</title>
      </Head>

      <Container maxWidth='xl'>
        <Card sx={{ height: {xs: '80vh', md: '84vh', lg: '82vh'}, display: 'flex' }}>
          <Chat />
        </Card>
      </Container>
    </>
  );
}
