// next
import Head from 'next/head';
// layouts
import DashboardLayout from '../../layouts/dashboard';
//
import { ChatbotConfig } from 'src/sections/@dashboard/chatbot-config';

// ----------------------------------------------------------------------

ChatbotSettingsPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function ChatbotSettingsPage() {

  return (
    <>
      <Head>
        <title>Configuración chatbot | Edifia</title>
      </Head>
      
      <ChatbotConfig />
    </>
  );
}
