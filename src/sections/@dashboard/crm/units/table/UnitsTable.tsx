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
import { doc, deleteDoc, collection, onSnapshot, query, getDocs, where } from 'firebase/firestore';
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
//
import { useSnackbar } from "src/components/snackbar";
// sections
import UnitsTableRow from './UnitsTableRow';
import AddEditUnitDialog from '../AddEditUnitDialog';
// @types
import { IUnit } from 'src/@types/crm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'type', label: 'Tipo', minWidth: 60 },
  { id: 'tower', label: 'Torre', minWidth: 50 },
  { id: 'unit', label: 'Unidad', minWidth: 50 },
  { id: 'deposit', label: 'Depósito', minWidth: 50 },
  { id: 'parkingLot', label: 'Parqueadero', minWidth: 80 },
  { id: 'vehicle', label: 'Vehículo', minWidth: 60 },
  { id: 'licensePlate', label: 'Placa', minWidth: 80 },
  { id: 'mascot', label: 'Mascota', minWidth: 70 },
  { id: 'mascotName', label: 'Nombre mascota', minWidth: 120 },
  { id: '', minWidth: 20 },
];

// ----------------------------------------------------------------------

export default function UnitsTable() {

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

  const { enqueueSnackbar } = useSnackbar()

  const { user } = useAuthContext()

  const [loading, setLoading] = useState(true)

  const [tableData, setTableData] = useState<IUnit[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  // Add item dialog state
  const [openAddEditItemDialog, setOpenAddEditItemDialog] = useState(false);

  const [itemSelected, setItemSelected] = useState<IUnit | null>()

  // Get units data
  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(DB, 'crm', user?.uid, 'units');
    const unsubscribe = onSnapshot(collectionRef, async (querySnapshot) => {
      try {
        if (querySnapshot.empty) {
          setTableData([]);
          setLoading(false);
        } else {
          const items = querySnapshot.docs.map((doc) => doc.data());
          setTableData(items as IUnit[]);
          setLoading(false);
        }
      } catch (error) {
        enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);  

  // close dialog
  const onCloseAddEditItem = () => {
    setItemSelected(null)
    setOpenAddEditItemDialog(false)
  }
  // open dialog
  const handleOpenAddEditItemDialog = () => {
    setItemSelected(null)
    setOpenAddEditItemDialog(true)
  }
  // Get specific unit data to pass to edit dialog
  const handleOpenEditRowDialog = (id: string) => {
    const rowInfo = tableData.find(item => item.id === id )
    if (rowInfo) {
      setItemSelected(rowInfo)
    }
    setOpenAddEditItemDialog(true)
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

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  // open delete unit dialog
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  // close delete unit dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const unitDocRef = doc(DB, 'crm', user?.uid, 'units', id);
      const unitBasicCrmRef = doc(DB, 'basic-crm', user?.uid, 'units', id);
      const residentsCollectionRef = collection(DB, 'crm', user?.uid, 'residents');
      const residentsBasicCrmCollectionRef = collection(DB, 'basic-crm', user?.uid, 'residents');
      const packagesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'packages');
      const vehiclesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'vehicles');
      const visitorsCollectionRef = collection(DB, 'basic-crm', user?.uid, 'visitors');
      const deliveriesCollectionRef = collection(DB, 'basic-crm', user?.uid, 'deliveries');
  
      await deleteDoc(unitDocRef);
      await deleteDoc(unitBasicCrmRef);
  
      const collections = [
        residentsCollectionRef,
        residentsBasicCrmCollectionRef,
        packagesCollectionRef,
        vehiclesCollectionRef,
        visitorsCollectionRef,
        deliveriesCollectionRef,
      ];
  
      for (const collectionRef of collections) {
        // Query the collection where 'unitId' field is equal to 'id'
        const querySnapshot = await getDocs(query(collectionRef, where('unitId', '==', id)));
        
        // Delete each document
        for (const doc of querySnapshot.docs) {
          await deleteDoc(doc.ref);
        }
      }
    } catch (e) {
      console.error(e);  // Log the error for debugging purposes
      enqueueSnackbar('No fue posible eliminar esta unidad', { variant: 'error' });
    }
  };

  const handleDeleteRow = async (id: string) => {
    setSelected([]);
    enqueueSnackbar('Eliminando unidad...esto puede tardar algunos segundos', { variant: 'warning' });
    try {
      await handleDelete(id)
      enqueueSnackbar('Unidad eliminada', { variant: 'error' });
    } catch (e) {
      enqueueSnackbar('No fue posible eliminar esta unidad', { variant: 'error' });
    }
  };

  const handleDeleteRows = async (selectedRows: string[]) => {
    setSelected([]);
    enqueueSnackbar('Eliminando unidades...esto puede tardar algunos segundos', { variant: 'warning' });
    try {
      // Delete documents one by one based on selectedRows
      for (const id of selectedRows) {
        await handleDelete(id)
      }
      enqueueSnackbar('Unidades eliminadas', { variant: 'error' });
    } catch (e) {
       enqueueSnackbar('No fue posible eliminar estas unidades', { variant: 'error' });
    }
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
        <Typography variant='h3' sx={{ mb: 2 }}>Unidades</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Busca por torre, unidad, parqueadero o depósito'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '30%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="ci:building-01" />}
                  onClick={handleOpenAddEditItemDialog}
                >
                  Agregar unidad
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
                      <UnitsTableRow
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
            ¿En verdad deseas eliminar <strong> {selected.length} </strong> unidade(s)? 
            Todos los registros de residentes, paquetes, visitas y vehículos relacionados con estas unidades 
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

      {/* Add or edit item dialog */}
      <AddEditUnitDialog 
        open={openAddEditItemDialog}
        onClose={onCloseAddEditItem}
        item={itemSelected}
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
  inputData: IUnit[];
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
        item.tower?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unit.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.parkingLot?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.deposit?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.id.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}