// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import VehiclesTable from 'src/sections/@dashboard/crm/vehicles/table/vehicles-table';

// ----------------------------------------------------------------------

ControleVehicular.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ControleVehicular() {

  return (
    <>
      <Head>
        <title>Control vehicular | Edifia</title>
      </Head>
      
      <VehiclesTable />
    </>
  );
}
