import { Paper, PaperProps, Typography } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends PaperProps {
  query?: string;
}

export default function SearchNotFound({ query, sx, ...other }: Props) {
  return query ? (
    <Paper
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" paragraph>
        No hay coincidencias🔎
      </Typography>

      <Typography variant="body2">
        No hay resultados disponibles para la consulta &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Revisa posibles errores de ortografía. 
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Please enter keywords
    </Typography>
  );
}
