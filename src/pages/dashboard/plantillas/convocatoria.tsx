import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AddEditConvocatoria from 'src/sections/@dashboard/templates/add-edit-convocatoria';

// ----------------------------------------------------------------------

ConvocatoriaTemplate.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ConvocatoriaTemplate() {

  return (
    <>
      <AddEditConvocatoria />
    </>
  )
}

  