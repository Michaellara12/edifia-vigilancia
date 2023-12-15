import Router from "next/router";
//
import { useState, useRef } from 'react';
// @mui
import { Collapse, Box, Divider, Button } from '@mui/material';
// @types
import { IFile } from 'src/@types/file';
// components
import Iconify from 'src/components/iconify';
import { TableProps } from 'src/components/table';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from "src/components/snackbar"; 
//
import FilePanel from '../FilePanel';
import FileCard from '../item/FileCard';
import FileFolderCard from '../item/FileFolderCard';
import FileActionSelected from '../portal/FileActionSelected';
import FileNewFolderDialog from '../portal/FileNewFolderDialog';
// firebase
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { DB } from "src/auth/FirebaseContext";
import { useAuthContext } from "src/auth/useAuthContext";

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  data: IFile[];
  dataFiltered: IFile[];
  onOpenConfirm: VoidFunction;
  onDeleteItem: (id: string) => void;
};

export default function FileGridView({
  table,
  data,
  dataFiltered,
  onOpenConfirm,
}: Props) {
  
  const { selected, onSelectRow: onSelectItem, onSelectAllRows: onSelectAllItems } = table;

  const { user } = useAuthContext()

  const { enqueueSnackbar } = useSnackbar()

  const containerRef = useRef(null);

  const [folderName, setFolderName] = useState('');

  const [collapseFiles, setCollapseFiles] = useState(false);

  const [openNewFolder, setOpenNewFolder] = useState(false);

  const [collapseFolders, setCollapseFolders] = useState(false);

  async function handleNewDocument(e:React.MouseEvent<HTMLElement>) {
    e.preventDefault
    try {
      const newDocId = uuidv4()

      const payload = {
        id: newDocId,
        form_input: '',
        project_title: 'Sin título',
        tipo: 'sin-plantilla',
        inFolder: false,
        dateCreated: serverTimestamp(),
        dateModified: serverTimestamp()
      }

      if (user) {
        const docRef = doc(DB, "users", user.uid, "documents", newDocId)
        await setDoc(docRef, payload)
        Router.push(`/dashboard/documentos?document=${newDocId}`)
      }
    } catch (e) {
      enqueueSnackbar(`Oops error: ${e}`, { variant: 'error' });
    }
  }

  const handleOpenNewFolder = () => {
    setOpenNewFolder(true);
  };

  const handleCloseNewFolder = () => {
    setOpenNewFolder(false);
  };

  return (
    <>
      <Box ref={containerRef}>
        <FilePanel
          title="Carpetas"
          subTitle={`${data.filter((item) => item.tipo === 'folder').length} carpeta(s)`}
          onOpen={handleOpenNewFolder}
          collapse={collapseFolders}
          onCollapse={() => setCollapseFolders(!collapseFolders)}
        />

        <Collapse in={!collapseFolders} unmountOnExit>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {dataFiltered
              .filter((i) => i.tipo === 'folder')
              .map((folder) => (
                <FileFolderCard
                  key={folder.id}
                  folder={folder}
                  selected={selected.includes(folder.id)}
                  onSelect={() => onSelectItem(folder.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>

        <Divider sx={{ my: 5, borderStyle: 'dashed' }} />

        <FilePanel
          title="Documentos"
          subTitle={`${data.filter((item) => item.tipo !== 'folder' && item.inFolder === false).length} proyecto(s)`}
          collapse={collapseFiles}
          onCollapse={() => setCollapseFiles(!collapseFiles)}
          projectsPanel={true}
        />

        <Collapse in={!collapseFiles} unmountOnExit>
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
            gap={3}
          >
            {dataFiltered
              .filter((i) => i.tipo !== 'folder' && !i.inFolder)
              .map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  selected={selected.includes(file.id)}
                  onSelect={() => onSelectItem(file.id)}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>

        {!!selected?.length && (
          <FileActionSelected
            numSelected={selected.length}
            rowCount={data.length}
            selected={selected}
            onSelectAllItems={(checked) =>
              onSelectAllItems(
                checked,
                data.map((row) => row.id)
              )
            }
            action={
              <>
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                  onClick={onOpenConfirm}
                  sx={{ mr: 1}}
                >
                  Eliminar
                </Button>
              </>
            }
          />
        )}
      </Box>

      {/* Create or edit folder */}
      <FileNewFolderDialog
        open={openNewFolder}
        onClose={handleCloseNewFolder}
        title="Crear nueva carpeta"
        setFolderName={setFolderName}
        onCreate={() => {
          handleCloseNewFolder();
          setFolderName('');
        }}
        folderName={folderName}
        onChangeFolderName={(event) => setFolderName(event.target.value)}
      />
    </>
  );
}
