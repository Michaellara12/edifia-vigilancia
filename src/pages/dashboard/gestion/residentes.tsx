// next
import Head from 'next/head';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
//
import ResidentsTable from 'src/sections/@dashboard/crm/residents/table/ResidentsTable';
// ----------------------------------------------------------------------

Residentes.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Residentes() {

  return (
    <>
      <Head>
        <title>Gestión residentes | Edifia</title>
      </Head>
      
      <ResidentsTable />
    </>
  );
}
