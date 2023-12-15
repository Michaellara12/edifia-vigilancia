import Router from 'next/router';
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
import { doc, deleteDoc, collection, onSnapshot, limit, query as firestoreQuery } from 'firebase/firestore';
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
import { PATH_DASHBOARD } from 'src/routes/paths';
// sections
import VisitorsTableRow from './visitors-table-row';
import AddEditVisitorDialog from '../add-edit-visitor-dialog';
// @types
import { IVisitor } from 'src/@types/crm';
//
import { useBoolean } from 'src/hooks/useBoolean';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'unitId', label: 'Unidad' },
  { id: 'visitor', label: 'Visitante', minWidth: 180 },
  { id: 'waitingStatus', label: 'Estado', minWidth: 160 },
  { id: 'vehicle', label: 'Vehículo', minWidth: 300 },
  { id: 'motivo', label: 'Motivo visita', minWidth: 135 },
  // { id: '', minWidth: 20 },
];

// ----------------------------------------------------------------------

export default function VisitorsTable() {

  const [loading, setLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar()

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

  const openDialog = useBoolean()

  const [tableData, setTableData] = useState<IVisitor[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  const [itemSelected, setItemSelected] = useState<IVisitor | null>()

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, 'basic-crm', user?.uid, 'visitors');
    // Modify the query to include the limit function
    const limitedQuery = firestoreQuery(collectionRef, limit(150));
    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => doc.data());
        items.sort((a, b) => {
          // Check for existence of the dates before using them
          const aArrivalDate = a.arrivalDate && a.arrivalDate.toDate();
          const aExitDate = a.exitDate && a.exitDate.toDate();
          const bArrivalDate = b.arrivalDate && b.arrivalDate.toDate();
          const bExitDate = b.exitDate && b.exitDate.toDate();

          const aDate = aExitDate || aArrivalDate;
          const bDate = bExitDate || bArrivalDate;

          if (!aDate || !bDate) return 0;  // if one or both dates are missing, consider them equal

          // Compare dates
          return bDate.getTime() - aDate.getTime();
        });
        setTableData(items as IVisitor[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
  }, []);  

  const handleNewItem = () => {
    // Router.push(PATH_DASHBOARD.registroIngresoPersonas.newPerson)
    openDialog.onToggle()
  }

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

  const handleDeleteRow = async (id: string) => {
    try {
      const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'visitors', id);
  
      await deleteDoc(basicCrmRef); // Delete basic-crm item document
  
      enqueueSnackbar('Visitante eliminado', { variant: 'error' });
    } catch (error) {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
    }
  };
  

  const handleDeleteRows = async (selectedRows: string[]) => {
    try {
        // Delete documents one by one based on selectedRows
        for (const id of selectedRows) {
            const basicCrmRef = doc(DB, 'basic-crm', user?.uid, 'visitors', id);
            await deleteDoc(basicCrmRef); // delete basic-crm doc
        }
        
        enqueueSnackbar('Visitantes eliminados', { variant: 'error' });
    } catch (e) {
        enqueueSnackbar('No fue posible eliminar estos visitantes', { variant: 'error' });
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
        <Typography variant='h3' sx={{ mb: 2 }}>Autorización de visitantes</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Busca por nombre, apellido, identificación, torre, unidad, cédula, tipo de ingreso...'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '30%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="material-symbols:person-add-rounded" />}
                  onClick={handleNewItem}
                >
                  Agregar visita
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
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <VisitorsTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
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
            ¿En verdad deseas eliminar <strong> {selected.length} </strong> paquete(s)?
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

      <AddEditVisitorDialog open={openDialog.value} onClose={openDialog.onToggle} />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IVisitor[];
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
        item.type.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.notes?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unitId.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.accessType.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.vehicle?.vehicleType?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.vehicle?.vehicleLicensePlate?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}