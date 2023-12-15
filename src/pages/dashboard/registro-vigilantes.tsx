// next
import Head from 'next/head';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
//
import RegistroVigilantes from 'src/sections/@dashboard/registro-vigilantes/registro-vigilantes';


// ----------------------------------------------------------------------

RegistroVigilantesPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------

export default function RegistroVigilantesPage() {
    return (
      <>
        <Head>
          <title>Registro de vigilantes | Edifia AI</title>
        </Head>

        <RegistroVigilantes />
      </>
      
    )
}
