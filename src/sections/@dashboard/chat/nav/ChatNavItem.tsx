import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import {
  Stack,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Badge
} from '@mui/material';
// @types
import { ILeadProfile } from 'src/@types/chat';
// components
import { CustomAvatar } from 'src/components/custom-avatar';
import BadgeStatus from 'src/components/badge-status';
import ChatNavItemDisabled from './ChatNavItemDisabled';
//
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
// icons
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

type Props = {
  lead: ILeadProfile;
  openNav: boolean;
};

export default function ChatNavItem({ lead, openNav }: Props) {

  const lastActivity = lead.lastActivity;

  const isUnread = lead.unreadCount > 0;

  const { push, query: { conversationKey }} = useRouter();

  const isSelected = conversationKey === lead.id;

  function handleClick(conversationId: string) {
    push(PATH_DASHBOARD.chat.viewChat(conversationId))
  }

  if (!lead.isWhatsappActive) return <ChatNavItemDisabled lead={lead} openNav={openNav} />

  return (
    <ListItemButton
      disableGutters
      onClick={() => handleClick(lead.id)}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(isSelected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Iconify  icon={lead.isNomanActive ? 'twemoji:robot' : ''} width={20} />
            }
          >
            <CustomAvatar
                key={lead.id}
                alt={lead.name}
                src={lead.profilePic}
                sx={{ width: 48, height: 48 }}
            />
          </Badge>
      </ListItemAvatar>

      {openNav && (
        <>
          <ListItemText
              primary={
                <Stack>
                <Typography 
                  variant='caption'
                  sx={{
                    color: isUnread ? 'text.primary' :'text.disabled',
                    fontWeight: isUnread ? 600 : 400
                  }}
                >
                  +{lead.phone}
                </Typography>
                <Typography variant='subtitle2' noWrap>
                  {lead.name}
                </Typography>
                </Stack>
              }
              secondary={lead.lastMessage}
              secondaryTypographyProps={{
                noWrap: true,
                variant: isUnread ? 'subtitle2' : 'body2',
                color: isUnread ? 'text.primary' : 'text.secondary',
              }}
          />
          
          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Stack 
              direction='row' 
            >
              <LeadStatusIcon 
                leadStatus={lead.leadStatus ? lead.leadStatus : 'abierto'}
              />
            
              <Typography
                noWrap
                variant="body2"
                component="span"
                sx={{
                  mb: 1.5,
                  ml: 0.5,
                  fontSize: 12,
                  color: isUnread ? 'text.primary' :'text.disabled',
                  fontWeight: isUnread ? 600 : 400
                }}
              >
                {formatDistanceToNowStrict(new Date(lastActivity.toDate().getTime()), {
                  addSuffix: false,
                })}
              </Typography>
            </Stack>

            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Stack>

        </>
      )}
      
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

type LeadStatusIconProps = {
  leadStatus: string;
}

const LeadStatusIcon = ({ leadStatus }: LeadStatusIconProps) => {
  
  if (leadStatus === 'pendiente') return (
    <Iconify 
      icon='gg:sand-clock' 
      width={14} 
      color='warning.main'
    />
  )

  if (leadStatus === 'resuelto') return (
    <Iconify 
      icon='fluent-mdl2:skype-check' 
      width={14} 
      color='success.main'
    />
  )

  if (leadStatus === 'descartado') return (
    <Iconify 
      icon='ic:outline-remove-circle' 
      width={14} 
      color='error.main'
    />
  )

  return (
    <Iconify 
      icon='bxs:chat' 
      width={14} 
      color='info.main'
    />
  )

}
