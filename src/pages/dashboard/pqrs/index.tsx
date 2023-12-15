// sections
import PqrsTable from 'src/sections/@dashboard/crm/pqrs/table/pqrs-table';
// layouts
import DashboardLayout from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

PQRSPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function PQRSPage() {
  return <PqrsTable />;
}