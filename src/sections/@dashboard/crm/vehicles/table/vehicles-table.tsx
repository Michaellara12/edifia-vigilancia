// react
import { useState, useEffect } from 'react';
// @mui
import {
  Container,
  Card,
  Table,
  Button,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
// firebase
import { DB } from 'src/auth/FirebaseContext';
import { collection, onSnapshot, query, orderBy as firestoreOrderBy } from 'firebase/firestore';
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableLoadingComponent } from 'src/components/loading-components/TableLoadingComponent';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
  TableToolbar
} from 'src/components/table';
import AddVehicleDialog from '../add-edit-vehicle-dialog';
// hooks
import { useSnackbar } from "src/components/snackbar";
import { useBoolean } from 'src/hooks/useBoolean';
// sections
import VehiclesTableRow from './vehicles-table-row';
// @types
import { IUnitVehicle } from 'src/@types/crm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'vehicle', label: 'Vehículo', minWidth: 120 },
  { id: 'color', label: 'Color' },
  { id: 'brand', label: 'Marca' },
  { id: 'unitId', label: 'Unidad' },
  { id: 'lastActivity.timestamp', label: 'Última actividad', minWidth: 120 },
];

// ----------------------------------------------------------------------

export default function VehiclesTable() {

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
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const { user } = useAuthContext()

  const [tableData, setTableData] = useState<IUnitVehicle[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true)
    const collectionRef = collection(DB, 'basic-crm', user?.uid, 'vehicles');
    
    // Order by 'lastActivity.timestamp' in descending order (most recent to oldest)
    const orderedCollectionRef = query(collectionRef, firestoreOrderBy('lastActivity.timestamp', 'desc'));

    const unsubscribe = onSnapshot(orderedCollectionRef, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => doc.data());
        setTableData(items as IUnitVehicle[]);
        setLoading(false);
      }
    }, (error) => {
      enqueueSnackbar(`Oops error: ${error}`, { variant: 'error' });
      setLoading(false);
    });
  
    return () => unsubscribe();
  
}, []);


  const openDialog = useBoolean(false);

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

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus('all');
    setFilterService('all');
    setFilterEndDate(null);
    setFilterStartDate(null);
  };

  if (loading) return <TableLoadingComponent />

  return (
    <Container maxWidth='md'>
      <>
        <Typography variant='h3' sx={{ mb: 2 }}>Vehículos</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Busca por tipo de vehículo, color, marca, torre, unidad...'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '30%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="fa6-solid:car-side" />}
                  onClick={openDialog.onToggle}
                >
                  Agregar vehículo
                </Button>
            }
          />

          <TableContainer>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <VehiclesTableRow
                        key={row.id}
                        row={row}
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

      <AddVehicleDialog open={openDialog.value} onClose={openDialog.onToggle}/>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IUnitVehicle[];
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
        item.brand.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.color.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.licensePlate?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.type.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.token?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.unitId.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}