// next
import Head from 'next/head';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
//
import UnitsTable from 'src/sections/@dashboard/crm/units/table/UnitsTable';

// ----------------------------------------------------------------------

UnidadesPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function UnidadesPage() {

  return (
    <>
      <Head>
        <title>Gestión Unidades | Edifia</title>
      </Head>
      
      <UnitsTable />
    </>
  );
}
