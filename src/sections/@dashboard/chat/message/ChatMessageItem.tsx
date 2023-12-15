import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Typography, Stack, Box, Link } from '@mui/material';
// @types
import { IChatTextMessage } from '../../../../@types/chat';
// icons
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorIcon from '@mui/icons-material/Error';

// ----------------------------------------------------------------------

type Props = {
    message: IChatTextMessage;
}

export default function ChatMessageItem({ 
  message, 
}: Props) {

  const isImage = message.type === 'image';

  const currentUser = message.sender === 'team';

  const renderMessageType = () => {
    switch(message.type) {
      case "text":
        return (
          <>
            <Typography 
              sx={{mx: 1}} 
              variant='body2'
            >
              {message.message}
            </Typography>
          </>
        )
      case "image":
        return (
          <>
            <Link href={message.message} target="_blank">
              <Box
                sx={{ maxWidth: 220 }}
              >
                <img src={message.message}/>
              </Box>
            </Link>
          </>
        )
      case "sticker":
        return <Box sx={{display: 'flex', flexDirection: 'column', m: 2, alignItems: 'center'}}><Link href={message.message} target="_blank"><ImageIcon fontSize="large" /></Link><Typography sx={{mx: 2}} variant='caption'>{message.caption}</Typography></Box>
      case "gif":
        return <Box sx={{display: 'flex', flexDirection: 'column', m: 2, alignItems: 'center'}}><Link href={message.message} target="_blank"><ImageIcon fontSize="large" /></Link><Typography sx={{mx: 2}} variant='caption'>{message.caption}</Typography></Box>
      case "video":
        return <Box sx={{display: 'flex', flexDirection: 'column', m: 2, alignItems: 'center'}}><Link href={message.message} target="_blank"><VideocamIcon fontSize="large" /></Link> <Typography sx={{mx: 2}} variant='caption'>{message.caption}</Typography></Box>
      case "audio":
        return <Box sx={{display: 'flex', flexDirection: 'column', m: 2, alignItems: 'center'}}><Link href={message.message} target="_blank"><VolumeUpIcon fontSize="large" /></Link> {message.caption}</Box>
      case "document":
        return <Box sx={{display: 'flex', flexDirection: 'column', m: 2, alignItems: 'center'}}><Link href={message.message} target="_blank"><DescriptionIcon fontSize="large" /></Link> <Typography sx={{mx: 2}} variant='caption'>{message.caption}</Typography></Box>
      case "error":
        return (
          <Box 
            sx={{
              display: 'flex', 
              m: 2, 
              alignItems: 'center'
            }}>
              <ErrorIcon fontSize='large' sx={{mr: 2}} />
              {message.message}
          </Box>
        )
    }
  }

  return (
    <>

      <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>

        <Stack spacing={1} alignItems={currentUser ? 'flex-end' : 'flex-start'}>

          <Stack
            sx={{
              p: 1.5,
              minWidth: 48,
              maxWidth: {xs: 260, md: 360, lg: 400},
              borderRadius: 1,
              overflow: 'hidden',
              typography: 'body2',
              bgcolor: 'background.neutral',
              ...(currentUser && {
                color: 'grey.800',
                bgcolor: 'primary.lighter',
              }),
              ...(isImage && {
                p: 0,
              }),
            }}
          >
            {/* Sender name */}
            {currentUser 
              && 
                (message.type === 'text')
              && 
                <Typography variant='subtitle2' sx={{ mx: 1, mb: 1 }}>
                  {message.teamMemberName ? message.teamMemberName : 'Noman'}
                </Typography>
            }
            {/* Message */}
            {renderMessageType()}
          </Stack>

          <Typography
            noWrap
            variant="caption"
            sx={{
              color: 'text.disabled',
              ...(!currentUser && {
                mr: 'auto',
              }),
            }}
          >
            {!currentUser} &nbsp;
            {formatDistanceToNowStrict(
              message.timestamp instanceof Date ? message.timestamp.getTime() : message.timestamp.toDate().getTime(),
              {
                addSuffix: true,
              }
            )}
          </Typography>

        </Stack>
      </Stack>
    </>
  );
}
