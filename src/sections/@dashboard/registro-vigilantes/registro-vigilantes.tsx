// @mui
import { Container, Button } from "@mui/material"
//
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/CustomBreadcrumbs"
import Iconify from "src/components/iconify/Iconify"
import Vigilantes from "./vigilantes"
// components
import AddGuard from './add-guard-dialog';
import { useBoolean } from "src/hooks/useBoolean";

// ----------------------------------

export default function RegistroVigilantes() {
  const openDialog = useBoolean(false)

    return (
      <Container maxWidth='xl'>
        <AddGuard open={openDialog.value} onClose={openDialog.onToggle} />
        <CustomBreadcrumbs
          heading="Registro y control de vigilantes"
          links={[]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={openDialog.onToggle}
            >
              Agregar guarda
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Vigilantes />
      </Container>
      
    )
}
