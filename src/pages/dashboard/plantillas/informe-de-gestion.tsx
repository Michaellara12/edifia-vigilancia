import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AddEditInformeGestion from 'src/sections/@dashboard/templates/add-edit-informe-de-gestion';

// ----------------------------------------------------------------------

InformeGestionTemplate.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function InformeGestionTemplate() {

  return (
    <>
      <AddEditInformeGestion />
    </>
  )
}

  