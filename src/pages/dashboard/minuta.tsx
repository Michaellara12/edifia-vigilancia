// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import MinutaTable from 'src/sections/@dashboard/crm/minuta/table/minuta-table';

// ----------------------------------------------------------------------

MinutaPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function MinutaPage() {

  return (
    <>
      <Head>
        <title>Minuta de vigilancia | Edifia</title>
      </Head>
      
      <MinutaTable />
    </>
  );
}
