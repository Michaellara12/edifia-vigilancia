// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import ResidentMailDelivery from 'src/sections/@dashboard/crm/packages/mail/resident-mail-delivery';

// ----------------------------------------------------------------------

DeliverPackagePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function DeliverPackagePage() {

  return (
    <Container>
      <Head>
        <title>Entregar correspondencia | Edifia</title>
      </Head>
    
      <ResidentMailDelivery />
    </Container>
  );
}
