import { Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";

import { FormSelectorStringType } from "./types";

export default function TemplateSelector({val, handleSelectFormChange}:FormSelectorStringType) {

    const template = !!val ? val : 'documento'

    return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tipo de documento</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={template}
              label="Tipo de documento"
              onChange={handleSelectFormChange}
            >
              <MenuItem value="documento">Documento</MenuItem>
              <MenuItem value="correo electronico">Correo electrónico</MenuItem>
              <MenuItem value="derecho de peticion">Derecho de petición</MenuItem>
              <MenuItem value="carta de cobro">Carta de cobro</MenuItem>
              <MenuItem value="reglamento interno">Reglamento interno</MenuItem>
              <MenuItem value="comunicado">Comunicado</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
  }