// @mui
import { 
    Avatar,
    ListItem,
    ListItemText,
    Box,
    Typography
} from '@mui/material';
// 
import { IGuard } from 'src/@types/crm';

// ---------------------------------------------------------------

type GuardThatAuthorizedProps = {
  guard: IGuard
}

// ---------------------------------------------------------------

export function GuardThatAuthorized({ guard }: GuardThatAuthorizedProps) {

  return (
    <>
      <Box>
        <Typography variant='subtitle2' >Guarda que autorizó:</Typography>
        
          <ListItem
            sx={{
              px: 0,
            }}
          >
            <Avatar alt={guard.name} src={guard.avatarUrl} sx={{ mr: 2 }} />

            <ListItemText
              primary={guard.name}
              secondary={
                <span>{guard.id}</span>
              }
              primaryTypographyProps={{ noWrap: true, typography: 'subtitle2' }}
              secondaryTypographyProps={{ noWrap: true, component: 'span' }}
              sx={{ flexGrow: 1, pr: 1 }}
            />
          </ListItem>
      </Box>
    </>
  )
}