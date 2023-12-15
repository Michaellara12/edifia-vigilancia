import { 
  Grid, 
  Skeleton
} from '@mui/material';

// ----------------------------------------------------------------------

export function ResidentMailDeliveryLoading() {

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton height={300}/>
        </Grid>

        <Grid item xs={12} md={8}>
          <Skeleton height={300} />
        </Grid>
      </Grid>
    </>
  );
}
