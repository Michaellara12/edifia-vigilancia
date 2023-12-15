// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import RegisterNewPqrs from 'src/sections/@dashboard/crm/pqrs/register-new-pqrs';

// ----------------------------------------------------------------------

NewPQRSPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function NewPQRSPage() {

  return (
    <Container>
      <Head>
        <title>Registro PQRS | Edifia</title>
      </Head>
    
      <RegisterNewPqrs />
    </Container>
  );
}
