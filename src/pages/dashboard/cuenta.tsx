import Head from 'next/head';
// MUI
import { Container } from '@mui/material';
// layout
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
//
import Cuenta from 'src/sections/@dashboard/account/Cuenta';

// ----------------------------------------------------------------------

CuentaPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function CuentaPage() {

  return (
    <Container>
      <Head>
        <title>Cuenta | Edifia AI</title>
      </Head>
      
      <Cuenta />
    </Container>
  )
}