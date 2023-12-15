import { useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Divider, Drawer, Stack, Typography, Tooltip, IconButton } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// config
import { NAV } from '../../../config-global';
//
import Iconify from '../../iconify';
import Scrollbar from '../../scrollbar';
//
import { defaultSettings } from '../config-setting';
import { useSettingsContext } from '../SettingsContext';
import Block from './Block';
import BadgeDot from './BadgeDot';
import ToggleButton from './ToggleButton';
import ModeOptions from './ModeOptions';
import ColorPresetsOptions from './ColorPresetsOptions';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  handleClose: () => void;
}

const SPACING = 2.5;

export default function SettingsDrawer({ open, handleClose }: Props) {
  const {
    themeMode,
    themeLayout,
    themeStretch,
    themeContrast,
    themeDirection,
    themeColorPresets,
    onResetSetting,
  } = useSettingsContext();

  const theme = useTheme();

  const notDefault =
    themeMode !== defaultSettings.themeMode ||
    themeLayout !== defaultSettings.themeLayout ||
    themeStretch !== defaultSettings.themeStretch ||
    themeContrast !== defaultSettings.themeContrast ||
    themeDirection !== defaultSettings.themeDirection ||
    themeColorPresets !== defaultSettings.themeColorPresets;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        BackdropProps={{ invisible: true }}
        PaperProps={{
          sx: {
            ...bgBlur({ color: theme.palette.background.default, opacity: 0.9 }),
            width: NAV.W_BASE,
            boxShadow: `-24px 12px 40px 0 ${alpha(
              theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.common.black,
              0.16
            )}`,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: SPACING }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Configuración
          </Typography>

          <Tooltip title="Reset">
            <Box sx={{ position: 'relative' }}>
              {notDefault && <BadgeDot />}
              <IconButton onClick={onResetSetting}>
                <Iconify icon="ic:round-refresh" />
              </IconButton>
            </Box>
          </Tooltip>

          <IconButton onClick={handleClose}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ p: SPACING, pb: 0 }}>
          <Block title="Modo">
            <ModeOptions />
          </Block>

          <Block title="Colores">
            <ColorPresetsOptions />
          </Block>
        </Scrollbar>

        <Box sx={{ position: 'absolute', bottom: 10, left: SPACING, px: 4 }}>
          <img src="/assets/illustrations/residential-complex.png" alt="Your Image" width="100%" />
        </Box>
      </Drawer>
    </>
  );
}
