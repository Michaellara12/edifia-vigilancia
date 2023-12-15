import { useState, useEffect } from 'react';
// @mui
import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  MenuItem,
  Checkbox,
  CardProps,
  IconButton,
  Typography
} from '@mui/material';
// hooks
import { useAuthContext } from 'src/auth/useAuthContext';
import useResponsive from 'src/hooks/useResponsive';
// @types
import { IFolderManager, IFileManager } from '../../../../../@types/file';
// components
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import ConfirmDialog from '../../../../../components/confirm-dialog';
import FolderDialog from './FolderDialog';
import FileCardInsideFolder from './FileCardInsideFolder';
import LoadingFiles from './LoadingFiles';
import FileUpdateFolderDialog from './FileUpdateFolderDialog';
// firebase
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { DB } from 'src/auth/FirebaseContext';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  folder: IFolderManager;
  selected?: boolean;
  onSelect?: VoidFunction;
}

export default function FileFolderCard({
  folder,
  selected,
  onSelect,
  sx,
  ...other
}: Props) {

  const isMobile = useResponsive('down', 'md')

  const { user } = useAuthContext()

  const [showCheckbox, setShowCheckbox] = useState(false);

  const [openFolder, setOpenFolder] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [noFilesFound, setNoFilesFound] = useState(false);

  const [files, setFiles] = useState<IFileManager[]>([]);

  const [loading, setLoading] = useState(true);

  const [folderName, setFolderName] = useState(folder.project_title);

  const [openEditFolder, setOpenEditFolder] = useState(false);

  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

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

  const handleOpenEditFolder = () => {
    setOpenEditFolder(true);
  };

  const handleCloseEditFolder = () => {
    setOpenEditFolder(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  async function handleDeleteItem () {
    if (folder.files) {
      if (folder.files.length === 0) {
        const docRef = doc(DB, "users", user?.uid, "documents", folder.id)
        await deleteDoc(docRef)
      } else {
        await removeFilesFromFolder(folder.files)
        const docRef = doc(DB, "users", user?.uid, "documents", folder.id)
        await deleteDoc(docRef)
      }
    }
    if (user) {
      const docRef = doc(DB, "users", user.uid, "documents", folder.id)
      await deleteDoc(docRef)
    }
  };

  async function handleClick(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    setLoading(true)
    const { nodeName } = e.target as HTMLButtonElement;
    if (nodeName !== 'INPUT' && nodeName !== 'circle' && nodeName !== 'svg') {
      setOpenFolder(true)
      setNoFilesFound(false)
      if (folder.files) {
        if (folder.files.length === 0) {
          setNoFilesFound(true)
          setLoading(false)
        } else {
          await fetchDocumentsByUids(folder.files)
          setLoading(false)
        }
      } else {
        setNoFilesFound(true)
        setLoading(false)
      }
    }
  }

  const handleCloseFolder = () => {
    setOpenFolder(false)
  }

  async function fetchDocumentsByUids(uids: string[]) {
    const docRefs = uids.map(uid => doc(DB, "users", user?.uid, "documents", uid));
    const docSnapshots = await Promise.all(docRefs.map(docRef => getDoc(docRef)));
    const docs: IFileManager[] = docSnapshots.map((snapshot) => {
      return {
        ...snapshot.data(),
        id: snapshot.ref.id,
        project_title: snapshot.data()?.project_title,
        tipo: snapshot.data()?.tipo,
        dateCreated: snapshot.data()?.dateCreated,
        dateModified: snapshot.data()?.dateModified
      }
    });
    setFiles(docs)
  }

  async function removeFilesFromFolder(uids: string[]) {
    const docRefs = uids.map(uid => doc(DB, "users", user?.uid, "documents", uid));
    docRefs.map(docRef => updateDoc(docRef, {
      inFolder: false
    }))
  }

  async function loadFolderFiles() {
    if (folder.files) {
      if (folder.files.length === 0) {
        setNoFilesFound(true)
      } else {
        await fetchDocumentsByUids(folder.files)
      }
    } else {
      setNoFilesFound(true)
    }
  }

  useEffect(() => {
    loadFolderFiles()
  }, [folder.files])

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
          ...sx,
        }}
        {...other}
      >
      
        <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
          {/* {!isMobile
            ?
              (showCheckbox || selected) && onSelect ? (
                <Checkbox
                  checked={selected}
                  onClick={onSelect}
                />
              ) : (
                null
              )
            :
            <Checkbox
              checked={selected}
              onClick={onSelect}
            />
          } */}
          
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

          <Box
            component="img"
            src="/assets/icons/files/ic_folder.svg"
            sx={{ width: 40, height: 40 }}
          />

        <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
          {folder.project_title}
        </Typography>
      </Card>
      

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >

        <MenuItem
          onClick={() => {
            handleClosePopover();
            handleOpenEditFolder();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Editar
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

      <FileUpdateFolderDialog
        open={openEditFolder}
        onClose={handleCloseEditFolder}
        title="Editar carpeta"
        folderName={folderName}
        folderId={folder.id}
        onChangeFolderName={(event) => setFolderName(event.target.value)}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Eliminar carpeta"
        content="¿En verdad deseas eliminar esta carpeta?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteItem}>
            Eliminar
          </Button>
        }
      />

      <FolderDialog
        open={openFolder}
        onClose={handleCloseFolder}
        title={folderName}
        action={null}
        content={
          <>
            {loading
              ?
                <LoadingFiles />
              :
                noFilesFound
                ?
                  <Typography variant='body1'>No se encontraron proyectos en esta carpeta</Typography>
                :
                files
                  ?
                    files.map(file => <FileCardInsideFolder key={file.id} file={file} folderId={folder.id}/>)
                  :
                    <Typography variant='body1'>No se encontraron proyectos en esta carpeta</Typography>
            }
          </>
        }
      />
    </>
  );
}
