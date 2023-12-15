// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import RegisterNewVisitorCedula from 'src/sections/@dashboard/crm/visitors/register-new-visitor-cedula';

// ----------------------------------------------------------------------

RegisterVisitorCedulaPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RegisterVisitorCedulaPage() {

  return (
    <Container>
      <Head>
        <title>Registro visita | Edifia</title>
      </Head>
    
      <RegisterNewVisitorCedula />
    </Container>
  );
}
