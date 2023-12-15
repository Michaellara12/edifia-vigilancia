import { useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Divider,
  MenuItem,
  Skeleton,
  CardProps,
  IconButton,
  Typography,
} from '@mui/material';
// @types
import { IFileManager } from '../../../../../@types/file';
// components
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import FileThumbnail from '../../../../../components/file-thumbnail';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import FileUpdateFolderDialog from './FileUpdateFolderDialog';
//
import Router from 'next/router';
import { useRef } from 'react';
import useResponsive from 'src/hooks/useResponsive';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  file: IFileManager;
  selected?: boolean;
  folderId: string;
}

export default function FileCard({ file, folderId, selected, sx, ...other }: Props) {

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [openAddFileToFolder, setOpenAddFileToFolder] = useState(false)

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const { user } = useAuthContext()

  const isMobile = useResponsive('down', 'md')

  const inputRef = useRef(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleShowCheckbox = () => {
    setShowCheckbox(true);
  };

  const handleHideCheckbox = () => {
    setShowCheckbox(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const { nodeName } = e.target as HTMLButtonElement;
    if (nodeName !== 'INPUT' && nodeName !== 'circle' && nodeName !== 'svg') {
      Router.push(`/dashboard/documentos?document=${file.id}`)
    }
  }


  async function handleDeleteItem (e:React.MouseEvent<HTMLElement>) {
    setLoading(true);
    // remove file from folder
    const folderRef = doc(DB, "users", user?.uid, "documents", folderId)
    const folder = await getDoc(folderRef)
    const filesArray = folder.data()?.files
    const filteredArray = filesArray.filter((item:string) => item !== file.id)
    // update folder doc
    await updateDoc(folderRef, {
      files: filteredArray
    })

    // delete file
    const fileRef = doc(DB, "users", user?.uid, "documents", file.id)
    await deleteDoc(fileRef)
    
    setLoading(false);
    handleCloseConfirm()
  };

  async function handleRemoveFromFolder () {
    setLoading(true)
    // doc refs
    const folderRef = doc(DB, "users", user?.uid, "documents", folderId)
    const fileRef = doc(DB, "users", user?.uid, "documents", file.id)

    // remove file from folder
    const folder = await getDoc(folderRef)
    const filesArray = folder.data()?.files
    const filteredArray = filesArray.filter((item:string) => item !== file.id)
    // update folder doc
    await updateDoc(folderRef, {
      files: filteredArray
    })
    // update fileDoc
    await updateDoc(fileRef, {
      inFolder: false
    })
    setLoading(false);
  }

  return (
    <>
      {!loading
        ?
        <>
        <Card
          onMouseEnter={handleShowCheckbox}
          onMouseLeave={handleHideCheckbox}
          onClick={handleClick}
          sx={{
            p: 2.5,
            my: 3,
            width: 1,
            boxShadow: 0,
            bgcolor: 'background.default',
            border: (theme) => `solid 1px ${theme.palette.divider}`,
            ...((showCheckbox || selected) && {
              borderColor: 'transparent',
              bgcolor: 'background.paper',
              boxShadow: (theme) => theme.customShadows.z20,
            }),
            ...sx,
          }}
          {...other}
        >
          <FileThumbnail file={file.tipo} sx={{ width: 40, height: 40 }} />

          <Typography variant="subtitle1" sx={{pt: 1}}>
            {file.project_title}
          </Typography>

          <Stack
            spacing={0.75}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', mt: 2 }}
          >
            <Typography variant="body2" noWrap>
              {file.form_input}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </Card>

        <MenuPopover
          open={openPopover}
          onClose={handleClosePopover}
          arrow="right-top"
          sx={{ width: 250 }}
        >
          <MenuItem
            onClick={() => {
              handleRemoveFromFolder();
              handleClosePopover();
            }}
          >
            <Iconify icon="material-symbols:folder-delete" />
            Remover de esta carpeta
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Eliminar
          </MenuItem>
        </MenuPopover>

        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Eliminar proyecto"
          content="¿En verdad deseas eliminar este proyecto?"
          action={
            <Button variant="contained" color="error" onClick={handleDeleteItem}>
              Eliminar
            </Button>
          }
        />
     
        </>
        :    
          <Skeleton variant="rectangular" width='100%' height={100} />
      }
      
    </>
  );
}