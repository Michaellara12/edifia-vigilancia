import { m, AnimatePresence } from 'framer-motion';
// @mui
import { alpha } from '@mui/material/styles';
import { IconButton, Stack, Typography, CircularProgress } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
//
import { UploadProps } from '../types';
// context
import { useFileUploaderContext } from 'src/contexts/FileUploaderContext';

// ----------------------------------------------------------------------

export default function MultiFilePreview({ thumbnail, files, onRemove, sx }: UploadProps) {
  
  if (!files?.length) {
    return null;
  }

  const { 
    progress,
    isPaused,
    handlePause,
    handleResume,
    handleRemoveUploadingFile
  } = useFileUploaderContext()

  return (
    <AnimatePresence initial={false}>
      {files.map((file, index) => {
        const { name = '', size = 0 } = fileData(file.blob);

        const isNotFormatFile = typeof file.blob === 'string';

        if (thumbnail) {
          return (
            <Stack
              key={index}
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                border: (theme) => `solid 1px ${theme.palette.divider}`,
                ...sx,
              }}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file.blob}
                sx={{ position: 'absolute' }}
                imgSx={{ position: 'absolute' }}
              />

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file.blob)}
                  sx={{
                    top: 4,
                    right: 4,
                    p: '1px',
                    position: 'absolute',
                    color: (theme) => alpha(theme.palette.common.white, 0.72),
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="eva:close-fill" width={16} />
                </IconButton>
              )}
            </Stack>
          );
        }

        return (
          <Stack
            key={index}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              px: 1,
              py: 0.75,
              borderRadius: 0.75,
              border: (theme) => `solid 1px ${theme.palette.divider}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file.blob} />

            <Stack flexGrow={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {name}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isNotFormatFile ? '' : fData(size)}
              </Typography>
            </Stack>

            <Stack direction='row' alignItems='center'>

              {/* For some reason I can't abstract this to a component */}
              {/* Not uploading yet state */}
              {(file.state === 'queue') 
                && 
                <>
                  {onRemove && (
                    <IconButton edge="end" size="small" onClick={() => onRemove(file.blob)}>
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  )}
                </>
              }

              {/* Awaiting for it's turn to upload */}
              {(file.state === 'pending') 
                && 
                <>
                  <Iconify icon="gg:sand-clock" />
                </>
              }

              {/* Uploading data to bucket */}
              {(file.state === 'uploading') 
                && 
                <>
                  <Stack 
                    direction='row' 
                    spacing={1} 
                    alignItems='center' 
                    justifyContent='center'
                  >
                    <Typography>{progress}%</Typography>
                    {!isPaused &&  <CircularProgress size={20} thickness={8} value={progress}/>}
                  </Stack>
                  

                  <IconButton edge="end" size="small" onClick={isPaused ? handleResume : handlePause}>
                      {isPaused
                        ?
                          <Stack direction='row' spacing={1}>
                            <Iconify icon="ph:play-fill" />
                          </Stack>
                        :
                          <Iconify icon="material-symbols:pause" />
                      }
                  </IconButton>

                  {onRemove && !isPaused && (
                    <IconButton edge="end" size="small" onClick={() => handleRemoveUploadingFile(file)}>
                      <Iconify icon="eva:close-fill" />
                    </IconButton>
                  )}
                </>
              }

              {/* Cancelled */}
              {(file.state === 'cancelled') 
                && 
                <>
                  <Iconify icon="line-md:cancel-twotone" />
                </>
              }

              {/* Finished */}
              {(file.state === 'finished') 
                && 
                <>
                  <Iconify icon="ic:baseline-file-download-done" />
                </>
              }
            </Stack>
          </Stack>
        );
      })}
    </AnimatePresence>
  );
}