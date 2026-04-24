import { Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { Navbar } from '@/shared/components/layout/Navbar';

export default function PrivateLayout() {
  const mobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" bg="beige.100" pb={mobile ? 16 : 0}>
      <Navbar />
      <Outlet />
    </Box>
  );
}
