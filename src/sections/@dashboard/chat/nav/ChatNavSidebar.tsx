import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Stack, Drawer, IconButton, IconButtonProps } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// @types
import { ILeadProfile } from 'src/@types/chat';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
//
import ChatNavList from './ChatNavList';
import ChatNavAccount from './ChatNavAccount';
import ChatNavTurnOffNoman from './ChatNavTurnOffNoman';
// firebase 
import { DB } from 'src/auth/FirebaseContext';
import { collection, query, orderBy, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

const StyledToggleButton = styled((props) => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  left: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  top: theme.spacing(13),
  borderRadius: `0 12px 12px 0`,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.customShadows.primary,
  '&:hover': {
    backgroundColor: theme.palette.primary.darker,
  },
}));

// ----------------------------------------------------------------------

const NAV_WIDTH = 320;

const NAV_COLLAPSE_WIDTH = 96;

export default function ChatNavSidebar() {

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const [openNav, setOpenNav] = useState(true);

  const [loading, setLoading] = useState(true);

  const [leads, setLeads] = useState<ILeadProfile[]>([])

  const isCollapse = isDesktop && !openNav;

  const { query: { chatroomId, conversationKey } } = useRouter();

  const { user } = useAuthContext()

  useEffect(() => {
    if (!isDesktop) {
      handleCloseNav();
    } else {
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationKey]);

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, "users", user?.uid, "chatrooms")
    const q = query(collectionRef, orderBy("lastActivity", "desc"));
    const unsubscribe = onSnapshot(q, ((snapshot:QuerySnapshot<DocumentData>) => {
    const leads = snapshot.docs.map((doc) => {
      return { ...doc.data() } as ILeadProfile
    });
    setLeads(leads)
    setLoading(false)
    }));
    return () => {
      unsubscribe();
    };
    
  }, [chatroomId])

  const handleToggleNav = () => {
    setOpenNav(!openNav);
  };

  const handleOpenNav = () => {
    setOpenNav(true);
  };

  const handleCloseNav = () => {
    setOpenNav(false);
  };

  const renderContent = (
    <>
      {/* {!isCollapse && <ChatNavTurnOffNoman isLoading={loading} />} */}

      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {!isCollapse && (
            <>
              <ChatNavAccount />
            </>
          )}

          <IconButton onClick={handleToggleNav}>
            <Iconify icon={openNav ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'} />
          </IconButton>
        </Stack>

      </Box>

      <Scrollbar>
        <ChatNavList 
            openNav={openNav}
            onCloseNav={handleCloseNav}
            leads={leads}
            loading={loading}
        />
      </Scrollbar>
    </>
  );

  return (
    <>
      {!isDesktop && (
        <StyledToggleButton onClick={handleToggleNav}>
          <Iconify width={16} icon="eva:people-fill" />
        </StyledToggleButton>
      )}

      {isDesktop ? (
        <Drawer
          open={openNav}
          variant="persistent"
          PaperProps={{
            sx: {
              pb: 1,
              width: 1,
              position: 'static',
              ...(isCollapse && {
                transform: 'none !important',
                visibility: 'visible !important',
              }),
            },
          }}
          sx={{
            width: NAV_WIDTH,
            transition: theme.transitions.create('width'),
            ...(isCollapse && {
              width: NAV_COLLAPSE_WIDTH,
            }),
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={handleCloseNav}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              pb: 1,
              width: NAV_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}