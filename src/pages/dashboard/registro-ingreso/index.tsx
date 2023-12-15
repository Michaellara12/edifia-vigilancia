// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import VisitorsTable from 'src/sections/@dashboard/crm/visitors/table/visitors-table';

// ----------------------------------------------------------------------

Visitantes.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Visitantes() {

  return (
    <>
      <Head>
        <title>Ingreso personas | Edifia</title>
      </Head>
      
      <VisitorsTable />
    </>
  );
}
