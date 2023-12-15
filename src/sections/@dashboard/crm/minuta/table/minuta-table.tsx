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
import { collection, onSnapshot, limit, query as firestoreQuery, orderBy as firestoreOrderBy } from 'firebase/firestore';
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
import AddMinutaDialog from '../add-minuta-dialog';
// hooks
import { useSnackbar } from "src/components/snackbar";
import { useBoolean } from 'src/hooks/useBoolean';
// sections
import MinutaTableRow from './minuta-table-row';
// @types
import { IMinuta } from 'src/@types/crm';

// ----------------------------------

const TABLE_HEAD = [
  { id: 'timestamp', label: 'Fecha', minWidth: 120 },
  { id: 'guard', label: 'Guarda que registra', minWidth: 150 },
  { id: 'notes', label: 'Notas / observaciones', minWidth: 400 }
];

// ----------------------------------------------------------------------

export default function MinutaTable() {

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

  const [tableData, setTableData] = useState<IMinuta[] | []>([]);

  const [filterName, setFilterName] = useState('');

  const [filterStatus, setFilterStatus] = useState('all');

  const [filterService, setFilterService] = useState('all');

  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    const collectionRef = collection(DB, 'basic-crm', user?.uid, 'minuta');
    const limitedQuery = firestoreQuery(collectionRef, limit(150), firestoreOrderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(limitedQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        setTableData([]);
        setLoading(false);
      } else {
        const items = querySnapshot.docs.map((doc) => doc.data());
        setTableData(items as IMinuta[]);
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
    <Container maxWidth='lg'>
      <>
        <Typography variant='h3' sx={{ mb: 2 }}>Minuta de vigilancia</Typography>
        <Card>
          {/* Searcbox + Add Item button */}
          <TableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            searchBoxPlaceholderText='Buscar información'
            addNewItemButton={
                <Button
                  sx={{ width: {lg: '45%', xs: '100%'}, py: 2 }}
                  variant='contained'
                  startIcon={<Iconify icon="bx:edit" />}
                  onClick={openDialog.onToggle}
                >
                  Registrar entrega de puesto
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
                      <MinutaTableRow
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

      <AddMinutaDialog open={openDialog.value} onClose={openDialog.onToggle}/>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: IMinuta[];
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
        item.notes.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 
    );
  }

  return inputData;
}