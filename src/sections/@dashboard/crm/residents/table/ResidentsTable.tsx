// react
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Card,
  Table,
  Stack,
  Button,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  Typography,
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { doc, getDocs, query, where, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ConfirmDialog from 'src/components/confirm-dialog';
import { TableLoadingComponent } from 'src/components/loading-components/TableLoadingComponent';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableToolbar
} from 'src/components/table';
// hooks
import { useSnackbar } from "src/components/snackbar";
import { useBoolean } from 'src/hooks/useBoolean';
// sections
import ResidentsTableRow from './ResidentsTableRow';
import AddEditResidentDialog from '../AddEditResidentDialog';
// @types
import { IResident } from 'src/@types/crm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nombres', minWidth: 120 },
  { id: 'lastName', label: 'Apellidos', minWidth: 140 },
  { id: 'whatsapp', label: 'WhatsApp', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 120 },
  { id: 'tower', label: 'Torre', minWidth: 50 },
  { id: 'unit', label: 'Unidad', minWidth: 50 },
  { id: 'cedula', label: 'No. Identificación', minWidth: 100 },
  { id: '', minWidth: 20 },
];

// ----------------------------------------------------------------------

export default function ResidentsTable() {

  const [loading, setLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar()

  const openAddItemDialog = useBoolean(false);

  // table
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const { user } = useAuthContext()

  const [tableData, setTableData] = useState<IResident[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  // Add item dialog state
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [itemSelected, setItemSelected] = useState<IResident | null>()

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, 'crm', user?.uid, 'residents');
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => doc.data());
        setTableData(items as IResident[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
  }, []);  

  const onCloseEditItem = () => {
    setItemSelected(null)
    setOpenEditDialog(false)
  }

  const handleOpenEditRowDialog = (id: string) => {
    const rowInfo = tableData.find(item => item.id === id )
    if (rowInfo) {
      setItemSelected(rowInfo)
    }
    setOpenEditDialog(true)
  };

  // Table
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isFiltered =
    filterStatus !== 'all' ||
    filterName !== '' ||
    filterService !== 'all' ||
    (!!filterStartDate && !!filterEndDate);

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDelete = async (id: string) => {
    try {
      const docRef = doc(DB, 'crm', user?.uid, 'residents', id);
      const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'residents', id);
      const packagesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'packages');
      const visitorsCollectionRef = collection(DB, 'basic-crm', user?.uid, 'visitors');
      const deliveriesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'deliveries');

      const collections = [
        packagesCollectionRef,
        visitorsCollectionRef,
        deliveriesCollectionRef,
      ];

      for (const collectionRef of collections) {
        // Query the collection where 'unitId' field is equal to 'id'
        const querySnapshot = await getDocs(query(collectionRef, where('residentId', '==', id)));
        
        // Delete each document
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }
  
      await deleteDoc(docRef); // Delete resident document

      await deleteDoc(basicCrmRef); // Delete basic-crm resident document
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  };

  const handleDeleteRow = async (id: string) => {
    setSelected([]);
    enqueueSnackbar('Eliminando residente...esto puede tardar algunos segundos', { variant: 'warning' });
    try {
      await handleDelete(id)
      enqueueSnackbar('Residente eliminado', { variant: 'error' });
    } catch (e) {
      enqueueSnackbar('No fue posible eliminar esta unidad', { variant: 'error' });
    }
  };
  

  const handleDeleteRows = async (selectedRows: string[]) => {
    enqueueSnackbar('Eliminando residentes...esto puede tardar algunos segundos', { variant: 'warning' });
    try {
        for (const id of selectedRows) {
            await handleDelete(id);
        }
        enqueueSnackbar('Residentes eliminados', { variant: 'info' });
    } catch (e) {
        enqueueSnackbar('No fue posible eliminar estos residentes', { variant: 'error' });
    }
    setSelected([]);
};

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  if (loading) return <TableLoadingComponent />

  return (
    <Container>
      <>
        <Typography variant='h3' sx={{ mb: 2 }}>Residentes</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Busca por nombre, apellido, identificación, torre, unidad...'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '30%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="bi:person-fill-add" />}
                  onClick={openAddItemDialog.onToggle}
                >
                  Agregar residente
                </Button>
            }
          />

          <TableContainer>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Eliminar">
                    <IconButton color="primary" onClick={handleOpenConfirm}>
                      <Iconify icon="eva:trash-2-outline" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ResidentsTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onEditRow={() => handleOpenEditRowDialog(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            ¿En verdad deseas eliminar <strong> {selected.length} </strong> residente(s)? 
            Todos los registros de paquetes, visitas y vehículos relacionados con estos residentes 
            serán eliminados.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Eliminar
          </Button>
        }
      />

      {/* Edit item dialog */}
      <AddEditResidentDialog 
        open={openEditDialog}
        onClose={onCloseEditItem}
        item={itemSelected}
        isNewItem={false}
      />

      {/* Add item dialog */}
      <AddEditResidentDialog 
        open={openAddItemDialog.value}
        onClose={openAddItemDialog.onToggle}
        item={null}
        isNewItem={true}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IResident[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterService: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
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
      (item) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.lastName.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.tower?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.cedula?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unit.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unitId.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}