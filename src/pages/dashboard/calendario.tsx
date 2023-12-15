// next
import Head from 'next/head';
// layouts
import DashboardLayout from '../../layouts/dashboard';
//
import { Calendar } from 'src/sections/@dashboard/calendar';

// ----------------------------------------------------------------------

CalendarPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function CalendarPage() {

  return (
    <>
      <Head>
        <title>Calendario chatbot | Edifia AI</title>
      </Head>
      
      <Calendar />
    </>
  );
}
