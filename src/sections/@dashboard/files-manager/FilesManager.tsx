import { useState, useEffect } from 'react';
// @mui
import { Stack, Button } from '@mui/material';
// utils
import { fTimestamp } from 'src/utils/formatTime';
// sections
import { 
    FileGridView,
    FileFilterType,
    FileFilterName,
    FileFilterButton,
    FileNewFolderDialog, 
} from 'src/sections/@dashboard/files-manager/file';
// components
import Iconify from '../../../components/iconify/Iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fileFormat } from '../../../components/file-thumbnail';
import { useTable, getComparator } from '../../../components/table';
import DateRangePicker, { useDateRangePicker } from '../../../components/date-range-picker';
import FilesManagerLoading from './FilesManagerLoading';
// @types
import { IFile } from '../../../@types/file'
import { IFileManager } from '../../../@types/file';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { onSnapshot, collection, DocumentData, QuerySnapshot, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';

// ----------------------------------------------------------------------

const FILE_TYPE_OPTIONS = [
    'folder',
    'txt',
    'zip',
    'audio',
    'image',
    'video',
    'word',
    'excel',
    'powerpoint',
    'pdf',
    'photoshop',
    'illustrator',
    'SEO'
  ];


export default function FilesManager() {

    const table = useTable({ defaultRowsPerPage: 10 });
    
    const {
        startDate,
        endDate,
        onChangeStartDate,
        onChangeEndDate,
        open: openPicker,
        onOpen: onOpenPicker,
        onClose: onClosePicker,
        onReset: onResetPicker,
        isSelected: isSelectedValuePicker,
        isError,
        shortLabel,
    } = useDateRangePicker(null, null);

    const [view, setView] = useState('list');

    const [filterName, setFilterName] = useState('');

    const [tableData, setTableData] = useState<IFileManager[]>([]);

    const [filterType, setFilterType] = useState<string[]>([]);

    const [openConfirm, setOpenConfirm] = useState(false);

    const [openUploadFile, setOpenUploadFile] = useState(false);

    const [loading, setLoading] = useState(true)

    // firebase project data fetching
    const [files, setFiles] = useState<IFileManager[]>([])

    const { user } = useAuthContext()

    if (user) {

      const collectionRef = collection(DB, "users", user.uid, "documents")
      const q = query(collectionRef, orderBy('dateModified', 'desc'))

      useEffect(() => {
        const unsubscribe = onSnapshot(q, (snapshot:QuerySnapshot<DocumentData>) => {
          const projects = snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
              dateModified: doc.data().dateModified?.toDate().getTime(), 
              dateCreated: doc.data().dateCreated?.toDate().getTime(),
            } as IFileManager;
          });
          setFiles(projects);
          setTableData(projects);
          setLoading(false)
        });
        return () => {
          unsubscribe();
        };
      }, []);

    } else {
      setFiles([])
    }

    const dataFiltered = applyFilter({
        inputData: files,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
        filterType,
        filterStartDate: startDate,
        filterEndDate: endDate,
        isError: !!isError,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterType) ||
        (!dataFiltered.length && !!endDate && !!startDate);

    const isFiltered = !!filterName || !!filterType.length || (!!startDate && !!endDate);

    const handleChangeView = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
          if (newView !== null) {
            setView(newView);
          }
    };
      
    const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
          table.setPage(0);
          setFilterName(event.target.value);
    };
      
    const handleChangeStartDate = (newValue: Date | null) => {
          table.setPage(0);
          onChangeStartDate(newValue);
    };
      
    const handleChangeEndDate = (newValue: Date | null) => {
          table.setPage(0);
          onChangeEndDate(newValue);
    };
      
    const handleFilterType = (type: string) => {
        const checked = filterType.includes(type)
            ? filterType.filter((value) => value !== type)
            : [...filterType, type];
      
          table.setPage(0);
          setFilterType(checked);
    };
      
    const handleDeleteItem = (id: string) => {
          const { page, setPage, setSelected } = table;
          const deleteRow = tableData.filter((row) => row.id !== id);
          setSelected([]);
          setTableData(deleteRow);
      
          if (page > 0) {
            if (dataInPage.length < 2) {
              setPage(page - 1);
            }
          }
    };

    const handleDeleteItems = (selected: string[]) => {
        const { page, rowsPerPage, setPage, setSelected } = table;
        const deleteRows = tableData.filter((row) => !selected.includes(row.id));
        setSelected([]);
        setTableData(deleteRows);
    
        if (page > 0) {
          if (selected.length === dataInPage.length) {
            setPage(page - 1);
          } else if (selected.length === dataFiltered.length) {
            setPage(0);
          } else if (selected.length > dataInPage.length) {
            const newPage = Math.ceil((tableData.length - selected.length) / rowsPerPage) - 1;
            setPage(newPage);
          }
        }
    };

    const handleDeleteItemsFirestore = (selected: string[]) => {
      const { setSelected } = table;
      selected.forEach(uid => {
        const docRef = doc(DB, 'users', user?.uid, 'documents', uid)
        deleteDoc(docRef)
        setSelected([]);
      })
    }
    
    const handleClearAll = () => {
        if (onResetPicker) {
          onResetPicker();
        }
        setFilterName('');
        setFilterType([]);
    };
    
    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };
    
    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };
    
    const handleOpenUploadFile = () => {
        setOpenUploadFile(true);
    };
    
    const handleCloseUploadFile = () => {
        setOpenUploadFile(false);
    };

    return (
      <>
        <Stack
          spacing={2.5}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >
          <Stack
            spacing={1}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'center' }}
            sx={{ width: 1 }}
          >
            <FileFilterName filterName={filterName} onFilterName={handleFilterName} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <>
                <FileFilterButton
                  isSelected={!!isSelectedValuePicker}
                  startIcon={<Iconify icon="eva:calendar-fill" />}
                  onClick={onOpenPicker}
                > 
                  {isSelectedValuePicker ? shortLabel : 'Seleccionar fecha'}
                </FileFilterButton>
                
                <DateRangePicker
                  variant="calendar"
                  startDate={startDate}
                  endDate={endDate}
                  onChangeStartDate={handleChangeStartDate}
                  onChangeEndDate={handleChangeEndDate}
                  open={openPicker}
                  onClose={onClosePicker}
                  isSelected={isSelectedValuePicker}
                  isError={isError}
                />
              </>

              {/* <FileFilterType
                filterType={filterType}
                onFilterType={handleFilterType}
                optionsType={FILE_TYPE_OPTIONS}
                onReset={() => setFilterType([])}
              /> */}

              {isFiltered && (
                <Button
                  variant="soft"
                  color="error"
                  onClick={handleClearAll}
                  startIcon={<Iconify icon="eva:trash-2-outline" />}
                >
                  Eliminar filtros
                </Button>
              )}
            </Stack>
          </Stack>
          
        </Stack>
       
        {loading
          ?
            <FilesManagerLoading />
          :
            <FileGridView
              table={table}
              data={tableData}
              dataFiltered={dataFiltered}
              onDeleteItem={handleDeleteItem}
              onOpenConfirm={handleOpenConfirm}
            />
        }

        <FileNewFolderDialog open={openUploadFile} onClose={handleCloseUploadFile} />

        <ConfirmDialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          title="Eliminar"
          content={
            <>
              ¿En verdad deseas eliminar <strong> {table.selected.length} </strong> item(s)?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteItemsFirestore(table.selected);
                handleCloseConfirm();
              }}
            >
              Eliminar
            </Button>
          }
        />

      </>
    )
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filterName,
    filterType,
    filterStartDate,
    filterEndDate,
    isError,
  }: {
    inputData: IFile[];
    comparator: (a: any, b: any) => number;
    filterName: string;
    filterType: string[];
    filterStartDate: Date | null;
    filterEndDate: Date | null;
    isError: boolean;
  }) {
    const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
  
    inputData = stabilizedThis.map((el) => el[0]);
  
    if (filterName) {
      inputData = inputData.filter(
        (file) => file.project_title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    }
  
    if (filterType.length) {
      inputData = inputData.filter((file) => filterType.includes(fileFormat(file.tipo)));
    }
  
    if (filterStartDate && filterEndDate && !isError) {
      inputData = inputData.filter(
        (file) =>
          fTimestamp(file.dateCreated) >= fTimestamp(filterStartDate) &&
          fTimestamp(file.dateCreated) <= fTimestamp(filterEndDate)
      );
    }
  
    return inputData;
  }


