// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import DeliveriesTable from 'src/sections/@dashboard/crm/deliveries/table/deliveries-table';

// ----------------------------------------------------------------------

Domicilios.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Domicilios() {

  return (
    <>
      <Head>
        <title>Domicilios | Edifia</title>
      </Head>
      
      <DeliveriesTable />
    </>
  );
}
