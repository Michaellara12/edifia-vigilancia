import NextLink from 'next/link';
// @mui
import { Stack, Button, Typography, StackProps, IconButton } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  title: string;
  subTitle?: string;
  link?: string;
  onOpen?: VoidFunction;
  collapse?: boolean;
  onCollapse?: VoidFunction;
  projectsPanel?: boolean;
}

export default function FilePanel({
  title,
  subTitle,
  link,
  onOpen,
  collapse,
  onCollapse,
  projectsPanel,
  sx,
  ...other
}: Props) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 3, ...sx }} {...other}>
      <Stack flexGrow={1}>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <Typography variant="h6"> {title} </Typography>
          {onOpen
            ?
              <IconButton
                size="small"
                color="primary"
                onClick={onOpen}
                sx={{
                  p: 0,
                  width: 24,
                  height: 24,
                  color: 'common.white',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'secondary.main',
                  },
                }}
              >
                <Iconify icon="eva:plus-fill" />
              </IconButton>
            :
              null
          }
            
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.disabled', mt: 0.5 }}>
          {subTitle}
        </Typography>
      </Stack>

      {link && (
        <Button
          component={NextLink}
          href={link}
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:chevron-right-fill" />}
        >
          Ver todos
        </Button>
      )}

      {onCollapse && (
        <IconButton onClick={onCollapse}>
          <Iconify icon={collapse ? 'eva:chevron-down-fill' : 'eva:chevron-up-fill'} />
        </IconButton>
      )}
    </Stack>
  );
}
