// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import RegisterNewVisitor from 'src/sections/@dashboard/crm/visitors/register-new-visitor';

// ----------------------------------------------------------------------

RegisterVisitorPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RegisterVisitorPage() {

  return (
    <Container>
      <Head>
        <title>Registro visita | Edifia</title>
      </Head>
    
      <RegisterNewVisitor />
    </Container>
  );
}
