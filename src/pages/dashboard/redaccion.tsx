// next
import Head from 'next/head';
import { Container, Typography, Divider } from '@mui/material';
// layouts
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
// components
import FilesManager from 'src/sections/@dashboard/files-manager/FilesManager';
import FilesTemplateGrid from 'src/sections/@dashboard/files-manager/FilesTemplateGrid';
import LoadingScreen from 'src/components/loading-components/LoadingScreen';
//
import { useDashboardLoadingContext } from 'src/layouts/DashboardLoadingContext';
import { useEffect } from 'react';

// ----------------------------------------------------------------------

RedaccionPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RedaccionPage() {

  const { loading, setLoading } = useDashboardLoadingContext()

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <Head>
        <title>Redacción | Edifia</title>
      </Head>
      {loading
        ?
          <LoadingScreen />
        :
          <Container maxWidth='xl'>
            <Typography variant="h3" component="h1" paragraph>
              Redactar un documento
            </Typography>
            
            <FilesTemplateGrid />

            <Divider sx={{my: 4}}/>

            <Typography variant="h3" component="h1" paragraph>
              Mis documentos
            </Typography>

            <FilesManager />
          </Container>
      }
    </>
  );
}
