import { Box, FormControl, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";

import { FormSelectorStringType } from "./types";

export default function ToneFormSelector({val, handleSelectFormChange}:FormSelectorStringType) {
    return (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Tono</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={val}
              label="Tono"
              onChange={handleSelectFormChange}
            >
              <MenuItem value={"Neutro"}>📝 Neutro</MenuItem>
              <MenuItem value={"Persuasivo"}>🧐 Persuasivo</MenuItem>
              <MenuItem value={"Reflexivo"}>🧠 Reflexivo</MenuItem>
              <MenuItem value={"Racional"}>🤖 Racional</MenuItem>
              <MenuItem value={"Serio"}>😐 Serio</MenuItem>
              <MenuItem value={"Conservador"}>⛪ Conservador</MenuItem>
              <MenuItem value={"Moderado"}>⚖️ Moderado</MenuItem>
              <MenuItem value={"Coloquial"}>🤴🏻 Coloquial</MenuItem>
              <MenuItem value={"Informativo"}>📰 Informativo</MenuItem>
              <MenuItem value={"Objetivo"}>👁️ Objetivo</MenuItem>
              <MenuItem value={"Pedagógico"}>👩🏻‍🏫 Pedagógico</MenuItem>
              <MenuItem value={"Corporativo"}>🏢 Corporativo</MenuItem>
              <MenuItem value={"Informal"}>🗣️ Informal</MenuItem>
              <MenuItem value={"Cercano"}>🧑‍🤝‍🧑 Cercano</MenuItem>
            </Select>
          </FormControl>
        </Box>
      );
  }