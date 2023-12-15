// @mui
import { Grid } from "@mui/material"
// components
import NewTranscriptionContainer from "./NewTranscriptionContainer";
import ChooseTemplateContainer from "./ChooseTemplateContainer";

// ----------------------------------------------------------------------

function FilesTemplateGrid() {

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={8}>
          <ChooseTemplateContainer />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <NewTranscriptionContainer/>
        </Grid>
      </Grid>
    </>
  )
}

export default FilesTemplateGrid