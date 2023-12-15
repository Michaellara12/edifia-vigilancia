import { useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Divider,
  MenuItem,
  Checkbox,
  CardProps,
  IconButton,
  Typography,
} from '@mui/material';
// utils
import { fDateTime } from '../../../../../utils/formatTime';
// @types
import { IFileManager } from '../../../../../@types/file';
// components
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import FileThumbnail from '../../../../../components/file-thumbnail';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import FileUpdateFolderDialog from './FileUpdateFolderDialog';
import AddFileToFolder from '../portal/AddFileToFolder';
//
import Router from 'next/router';
import { useRef } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import { PATH_DASHBOARD } from 'src/routes/paths';
// firebase
import { useAuthContext } from 'src/auth/useAuthContext';
import { doc, deleteDoc, query, collection, getDocs, where } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  file: IFileManager;
  selected?: boolean;
  onSelect?: VoidFunction;
}

export default function FileCard({ file, selected, onSelect, sx, ...other }: Props) {

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [fileName, setFileName] = useState(file.project_title)

  const [folderList, setFolderList] = useState<[string, string][]>([])

  const [loading, setLoading] = useState(true)

  const [openEditFile, setOpenEditFile] = useState(false)

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
      if (file.tipo === 'transcription') {
        Router.push(PATH_DASHBOARD.documentos.transcriptionView(file.id))
      } else if (file.tipo === "sin-plantilla") {
        Router.push(PATH_DASHBOARD.documentos.transcriptionView(file.id))
      } else {
        Router.push(PATH_DASHBOARD.documentos.view(file.tipo, file.id))
      }
    }
  }

  const handleCloseEditFile = () => {
    setOpenEditFile(false);
  };

  async function handleOpenAddFileToFolder() {
    loadFolders()
    setOpenAddFileToFolder(true)
  }

  const handleCloseAddFileToFolder = () => {
    setOpenAddFileToFolder(false)
  }

  async function handleDeleteItem (e:React.MouseEvent<HTMLElement>) {
    if (user) {
      const docRef = doc(DB, "users", user.uid, "documents", file.id)
      await deleteDoc(docRef)
    }
  };


  async function loadFolders() {
    const collectionRef = collection(DB, 'users', user?.uid, 'documents')
    const q = query(collectionRef, where("tipo", "==", "folder"))
    const querySnapshot = await getDocs(q);
    let folders: [string, string][] = [];
    await querySnapshot.forEach((doc) => {
      folders.push([doc.id, doc.data().project_title]);
    });
    setFolderList(folders);
    setLoading(false)
  }

  return (
    <>
      <Card
        onMouseEnter={handleShowCheckbox}
        onMouseLeave={handleHideCheckbox}
        onClick={handleClick}
        sx={{
          p: 2.5,
          width: 1,
          maxWidth: 222,
          boxShadow: 0,
          bgcolor: 'background.default',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          ...((showCheckbox || selected) && {
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            boxShadow: (theme) => theme.customShadows.z20,
          }),
          '&:hover': { cursor: 'pointer' },
          ...sx,
        }}
        {...other}
      >
        <FileThumbnail file={file.tipo} sx={{ width: 40, height: 40 }} />

        <Typography variant="subtitle1" sx={{pt: 1}}>
          {file.project_title}
        </Typography>
        <Typography variant="caption" sx={{color: 'text.disabled'}}>
          {fDateTime(file.dateModified)} 
        </Typography>

        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          
          {!isMobile
            ?
              (showCheckbox || selected) && onSelect ? (
                <Checkbox
                  checked={selected}
                  onClick={onSelect}
                  ref={inputRef}
                />
              ) : (
                null
              )
            :
              <Checkbox
                checked={selected}
                onClick={onSelect}
                ref={inputRef}
              />
            }
    
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Card>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 200 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenAddFileToFolder();
            handleClosePopover();
          }}
        >
          <Iconify icon="material-symbols:create-new-folder" />
          Mover a carpeta
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenEditFile(true)
            handleClosePopover();
          }}
        >
          <Iconify icon="material-symbols:edit" />
          Cambiar nombre
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

      <FileUpdateFolderDialog
          open={openEditFile}
          onClose={handleCloseEditFile}
          title="Editar proyecto"
          folderName={fileName}
          folderId={file.id}
          onChangeFolderName={(event) => setFileName(event.target.value)}
      />

      <AddFileToFolder 
        title='Escoge una carpeta'
        open={openAddFileToFolder}
        onClose={handleCloseAddFileToFolder}
        folders={folderList}
        fileId={file.id}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
