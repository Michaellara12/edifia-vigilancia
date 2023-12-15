// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// components
import { CustomAvatar } from 'src/components/custom-avatar';

// ----------------------------------------------------------------------

export default function ChatNavAccount() {
  const { user } = useAuthContext();

  return (
    <>
      <CustomAvatar
        src='/assets/illustrations/avatar-gradient.png'
        alt={user?.displayName}
        name={user?.displayName}
        sx={{ cursor: 'pointer', width: 48, height: 48 }}
      />
    </>
  );
}