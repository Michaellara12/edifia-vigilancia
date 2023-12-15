// @mui
import { 
  Stack, 
  InputAdornment, 
  TextField, 
  Button
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type TableToolbarProps = {
  filterName: string;
  isFiltered: boolean;
  onResetFilter: VoidFunction;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchBoxPlaceholderText: string;
  addNewItemButton?: React.ReactNode;
};

export default function TableToolbar({
  filterName,
  isFiltered,
  onFilterName,
  onResetFilter,
  searchBoxPlaceholderText,
  addNewItemButton
}: TableToolbarProps) {

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{ px: 2.5, py: 3 }}
      >
        {addNewItemButton}

        <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder={searchBoxPlaceholderText}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        {isFiltered && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilter}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
          >
            Borrar
          </Button>
        )}
      </Stack>
    </>
  );
}