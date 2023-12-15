// @mui
import { List } from '@mui/material';
// @types
import { ILeadProfile } from '../../../../@types/chat';
//
import ChatNavItem from './ChatNavItem';
import { SkeletonConversationItem } from 'src/components/skeleton';

// ----------------------------------------------------------------------

type Props = {
  leads: ILeadProfile[] | [];
  openNav: boolean;
  onCloseNav: VoidFunction;
  loading: boolean;
};

export default function ChatNavList({ leads, openNav, loading }: Props) {


  return (
    <List disablePadding>
      {loading
        ?
          Array(12).fill(0).map((_, index) => <SkeletonConversationItem key={index} />)
        :
          leads.map((lead) => <ChatNavItem lead={lead} key={lead.id} openNav={openNav} />)
      }
    </List>
  );
}
