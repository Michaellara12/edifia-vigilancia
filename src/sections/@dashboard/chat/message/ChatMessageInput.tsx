import { useRef, useState, useEffect } from 'react';
// @mui
import { 
  Button,
  InputBase, 
  InputBaseProps, 
  IconButton, 
  InputAdornment, 
  Popover, 
  Box, 
  useTheme, 
  alpha, 
  Tooltip 
} from '@mui/material';
// @types
import { IChatTextMessage } from '../../../../@types/chat';
// utils
import { bgBlur } from 'src/utils/cssStyles';
import { IconButtonAnimate } from 'src/components/animate';
// components
import Iconify from '../../../../components/iconify';
import Picker from "emoji-picker-react";
import FileNewFolderDialog from '../file/FileNewFolderDialog';
import { WhatsAppTemplateDialog } from 'src/components/confirm-dialog';
import { useSnackbar } from "src/components/snackbar"
import { useAuthContext } from 'src/auth/useAuthContext';
// context
import { useFileUploaderContext } from 'src/contexts/FileUploaderContext';
// icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
// import axios from 'axios';

// ----------------------------------------------------------------------

interface Props extends InputBaseProps {
  conversationId: string;
  chatroomId: string;
  onSend: (value: IChatTextMessage) => Promise<void>;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export default function ChatMessageInput({
  disabled,
  conversationId,
  chatroomId,
  onSend,
  scrollRef,
  sx,
  ...other
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState('');

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [openWhatsAppTemplate, setOpenWhatsAppTemplate] = useState(false);

  const [whatsAppTemplate, setWhatsAppTemplate] = useState("");

  const [isScrollAtBottom, setIsScrollAtBottom] = useState(true);

  const [openRecordAudio, setOpenRecordAudio] = useState(false);

  const [recordAudioAnchorEl, setRecordAudioAnchorEl] = useState<HTMLButtonElement | null>(null);

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { 
    openUploadFile,
    handleOpenUploadFile, 
    handleCloseUploadFile 
  } = useFileUploaderContext()

  const handleSend = (event: React.KeyboardEvent<HTMLInputElement>) => {

    if (event.key === 'Enter') {
      if (onSend && message && conversationId) {
        onSend({
          leadPhoneNumber: conversationId,
          userId: user?.uid,
          message,
          read: false,
          sender: 'team',
          teamMemberName: user?.displayName,
          timestamp: new Date(),
          type: 'text'
        });
      }
      setMessage('');
    }
  };

  const handleSendWhatsAppTemplate = async () => {

    if (onSend && conversationId) {
      onSend({
        leadPhoneNumber: conversationId,
        userId: user?.uid,
        message: '¡Hola! 👋 ¿Cómo has estado? Te escribo porque deseo retomar nuestra conversación',
        read: false,
        sender: 'team',
        teamMemberName: user?.displayName,
        timestamp: new Date(),
        type: 'text'
      });
    }

    try {
      // const url = 'https://hook.us1.make.com/6sgo2vy7kdsjcd7qdngerpem568yfj5c'

      // const payload = {
      //   leadPhoneNumber: conversationId,
      //   userId: user?.uid,
      //   message: whatsAppTemplate,
      //   read: false,
      //   sender: 'team',
      //   timestamp: new Date(),
      //   type: 'template'
      // }


  
      // await axios.post(url, payload);
  
      enqueueSnackbar("Plantilla enviada");
  
      handleCloseWhatsAppTemplate();
  
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      handleCloseWhatsAppTemplate();
    }
  }

  // Emoji Picker Popover
  const open = Boolean(anchorEl);
  
  const id = open ? 'simple-popover' : undefined;

  const handleEmojiClick = (emojiObj: { emoji: string }) => {
    setMessage(message + emojiObj.emoji);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // WhatsApp template handlers
  const handleOpenWhatsAppTemplate = () => {
    setOpenWhatsAppTemplate(true);
  }; 

  const handleCloseWhatsAppTemplate = () => {
    setWhatsAppTemplate('');
    setOpenWhatsAppTemplate(false);
  }; 

  function StyledWhatsAppTemplateButton() {
    return (
        <Box
            sx={{
              p: 0.5,
              ml: 2,
              bottom: 68,
              position: 'absolute',
              borderRadius: '50%',
              boxShadow: `-12px 12px 32px -4px ${alpha(
                theme.palette.mode === 'light' ? theme.palette.grey[600] : theme.palette.common.black,
                0.36
              )}`,
              ...bgBlur({ color: theme.palette.background.default }),
            }}
          > 

          <Tooltip title="Plantilla de WhatsApp" placement="right">
            <IconButtonAnimate sx={{ p: 1.25 }} onClick={handleOpenWhatsAppTemplate} >
                <WhatsAppIcon />
            </IconButtonAnimate>
          </Tooltip>
        </Box>
      )
    }

    // scroll to bottom
    const scrollMessagesToBottom = () => {
      console.log('scrolling!')
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };

    useEffect(() => {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

          // Check if the scroll is at the bottom (with a threshold of 10 pixels)
          const isAtBottom = scrollTop + clientHeight + 10 >= scrollHeight;
          setIsScrollAtBottom(isAtBottom);
        }
      };

      if (scrollRef.current) {
        scrollRef.current.addEventListener('scroll', handleScroll);
      }

      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }, [scrollRef]);

    function StyledScrollButton() {
      if (!isScrollAtBottom) return (
        <Box
            sx={{
              p: 0.5,
              ml: 2,
              bottom: 68,
              right: 14,
              position: 'absolute',
              bgcolor: theme.palette.primary.main,
              borderRadius: '50%',
              boxShadow: theme.customShadows.primary,
              ...bgBlur({ color: theme.palette.primary.main })
            }}
          > 

          <IconButtonAnimate onClick={scrollMessagesToBottom} >
            <KeyboardDoubleArrowDownIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />
          </IconButtonAnimate>
        </Box>
    )

    return null
    }

    const handleOpenRecordAudio = (event: React.MouseEvent<HTMLButtonElement>) => {
      setRecordAudioAnchorEl(event.currentTarget)
      setOpenRecordAudio(true);
    }

    const handleCloseRecordAudio = () => {
      setRecordAudioAnchorEl(null)
      setOpenRecordAudio(false);
    }

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ width: '90%' }}
      >
        <Picker 
          onEmojiClick={handleEmojiClick}
          width="100%"
        />
      </Popover>

      {/* Scroll to bottom of conversation */}
      <StyledScrollButton />
        
      {/* Send WhatsApp template button */}
      <StyledWhatsAppTemplateButton />

      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Escribe un mensaje"
        startAdornment={
          <InputAdornment position="start">
            <IconButton size="small" aria-describedby={id} onClick={handleClick}>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>

            {/* file handler */}
            <IconButton size="small" aria-describedby={id} onClick={handleOpenUploadFile}>
              <Iconify icon="eva:attach-outline" />
            </IconButton>
          </InputAdornment>

        }
        // endAdornment={
        //   <InputAdornment position="start">
        //     <IconButton 
        //       size="large" 
        //       onClick={handleOpenRecordAudio}
        //     >
        //       <Iconify icon="ph:microphone-bold" />
        //     </IconButton>
        //   </InputAdornment>
        // }
        sx={{
          pl: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          ...sx,
        }}
        {...other}
      />

      <input type="file" ref={fileInputRef} style={{ display: 'none' }} />

      <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} />

      <WhatsAppTemplateDialog 
        title='Plantillas de WhatsApp'
        open={openWhatsAppTemplate}
        onClose={handleCloseWhatsAppTemplate}
        action={
          <Button
            onClick={handleSendWhatsAppTemplate}
            disabled={whatsAppTemplate === ''}
          >
            Enviar
          </Button>
        }
        setWhatsAppTemplate={setWhatsAppTemplate}
      />

    </>
  );
}