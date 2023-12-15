import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import {
  Stack,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Tooltip
} from '@mui/material';
// @types
import { ILeadProfile } from '../../../../@types/chat';
// components
import { CustomAvatar } from '../../../../components/custom-avatar';
//
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
// icons
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LockClockIcon from '@mui/icons-material/LockClock';

// ----------------------------------------------------------------------

type Props = {
  lead: ILeadProfile;
  openNav: boolean;
  // isSelected: boolean;
};

export default function ChatNavItemDisabled({ lead, openNav }: Props) {

  const lastActivity = lead.lastActivity;

  const isUnread = lead.unreadCount > 0;

  const { push, query: { conversationKey }} = useRouter();

  const isSelected = conversationKey === lead.id;

  function handleClick(conversationId: string) {
    push(PATH_DASHBOARD.chat.viewChat(conversationId))
  }

  return (
    <ListItemButton
      disableGutters
      onClick={() => handleClick(lead.id)}
      sx={{
        py: 1.5,
        px: 2.5,
        bgcolor: 'action.selected',
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
            <CustomAvatar
              sx={{ width: 48, height: 48 }}
            >
              <LockClockIcon />
            </CustomAvatar>
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
              primary={lead.name}
              primaryTypographyProps={{ noWrap: true, variant: 'subtitle2' }}
              secondary={lead.lastMessage}
              secondaryTypographyProps={{
                noWrap: true,
                variant: isUnread ? 'subtitle2' : 'body2',
                color: isUnread ? 'text.primary' : 'text.secondary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
          >
              {formatDistanceToNowStrict(new Date(lastActivity.toDate().getTime()), {
                addSuffix: false,
              })}
            </Typography>
            
            <Tooltip title="Han pasado 24 horas desde la última vez que le escribiste a este usuario, para iniciar una conversación debes enviar una plantilla autorizada por Meta.">
                <ErrorOutlineIcon sx={{ width: 16, height: 16 }} />
            </Tooltip>
          </Stack>
        </>
      )}
      
    </ListItemButton>
  );
}
