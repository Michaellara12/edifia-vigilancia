import {
    Paper,
    InputBase,
    Divider,
    IconButton,
    Tooltip
  } from '@mui/material';
  import ContentCopyIcon from '@mui/icons-material/ContentCopy';
  // hooks
  import useCopyToClipboard from 'src/hooks/useCopyToClipboard';
  import { useSnackbar } from '../snackbar';
  
  type Props = {
    value: string
    type: 'text' | 'password'
  }
  
  // -------------------------------------
  
  export default function CopyBox({ value, type }: Props) {
    const { copy } = useCopyToClipboard()
    const { enqueueSnackbar } = useSnackbar();
  
    const handleCopy = () => {
      copy(value);
      enqueueSnackbar('Texto copiado al portapapeles');
    }
  
    return (
      <Paper
        component="form"
        sx={{ py: '2px', display: 'flex', alignItems: 'center', bgcolor:'action.selected' }}
      >
        <InputBase
          sx={{ ml: 1, width: '100%' }}
          value={value}
          type={type}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <Tooltip title="Copiar texto">
          <IconButton 
            color="primary" 
            sx={{ p: '10px' }} 
            aria-label="directions"
            onClick={handleCopy}
          >
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }