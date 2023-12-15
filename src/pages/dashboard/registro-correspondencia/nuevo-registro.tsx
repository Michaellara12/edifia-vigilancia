// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import RegisterNewMail from 'src/sections/@dashboard/crm/packages/mail/register-new-mail';

// ----------------------------------------------------------------------

RegisterPackagePage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RegisterPackagePage() {

  return (
    <Container>
      <Head>
        <title>Registro correspondencia | Edifia</title>
      </Head>
    
      <RegisterNewMail />
    </Container>
  );
}
