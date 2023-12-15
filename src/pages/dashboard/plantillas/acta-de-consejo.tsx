import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import AddEditActaDeConsejo from 'src/sections/@dashboard/templates/add-edit-acta-de-consejo';

// ----------------------------------------------------------------------

ActaConsejoTemplate.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ActaConsejoTemplate() {

  return (
    <>
      <AddEditActaDeConsejo />
    </>
  )
}

  