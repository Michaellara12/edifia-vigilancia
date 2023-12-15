import { Container, Card, CardContent, Box, Skeleton } from '@mui/material';

export const TableLoadingComponent = () => {
    return (
        <Container>
            <Card>
                <CardContent>
                    <Box
                        sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        pb: 1
                        }}
                    >
                        <Skeleton variant="rounded" width='100%' height={80} sx={{ mt: 2 }} />
                        <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 2 }} />
                        <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 1 }} />
                        <Skeleton variant="rounded" width='100%' height={60} sx={{ mt: 1 }} />
                        
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
  }