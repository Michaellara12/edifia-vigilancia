// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import PackagesTable from 'src/sections/@dashboard/crm/packages/table/packages-table';

// ----------------------------------------------------------------------

Correspondencia.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Correspondencia() {

  return (
    <>
      <Head>
        <title>Gestión correspondencia | Edifia</title>
      </Head>
      
      <PackagesTable />
    </>
  );
}
