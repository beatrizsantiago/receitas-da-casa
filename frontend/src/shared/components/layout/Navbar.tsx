import {
  Box,
  Button,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuHouse, LuBookOpen, LuBookmark, LuLogOut } from 'react-icons/lu';
import { useAuth } from '@/features/auth/hooks/useAuth';
import smallLogo from '@/assets/logo.png';

const NAV_ITEMS = [
  { id: '/dashboard', label: 'Início', icon: LuHouse },
  { id: '/receitas', label: 'Receitas', icon: LuBookOpen },
  { id: '/tags', label: 'Tags', icon: LuBookmark },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const mobile = useBreakpointValue({ base: true, md: false });

  const activePath = location.pathname;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (mobile) {
    return (
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={50}
        bg="rgba(255,251,243,0.95)"
        backdropFilter="blur(20px) saturate(180%)"
        borderTopWidth="1px"
        borderColor="beige.200"
        px={4}
        pb={4}
        pt={2}
      >
        <Flex justify="space-around">
          {NAV_ITEMS.map((it) => {
            const Icon = it.icon;
            const active = activePath === it.id || (it.id !== '/dashboard' && activePath.startsWith(it.id));
            return (
              <Button
                key={it.id}
                variant="ghost"
                onClick={() => navigate(it.id)}
                color={active ? 'primary.600' : 'neutral.500'}
                display="flex"
                flexDirection="column"
                gap={1}
                py={2}
                px={3}
                height="auto"
                fontSize="xs"
                fontWeight={600}
              >
                <Icon size={20} />
                {it.label}
              </Button>
            );
          })}
        </Flex>
      </Box>
    );
  }

  return (
    <Flex
      as="nav"
      bg="beige.100"
      borderBottomWidth="1px"
      borderColor="beige.200"
      px={10}
      py={4}
      justify="space-between"
      align="center"
      position="sticky"
      top={0}
      zIndex={20}
    >
      <Image src={smallLogo} alt="Logo" h="32px" cursor="pointer" onClick={() => navigate('/dashboard')} />

      <Flex gap={2}>
        {NAV_ITEMS.map((it) => {
          const active = activePath === it.id || (it.id !== '/dashboard' && activePath.startsWith(it.id));
          return (
            <Button
              key={it.id}
              variant="ghost"
              onClick={() => navigate(it.id)}
              bg={active ? 'white' : 'transparent'}
              borderWidth="1px"
              borderColor={active ? 'beige.200' : 'transparent'}
              color={active ? 'neutral.800' : 'neutral.500'}
              fontWeight={active ? 600 : 500}
              rounded="lg"
              size="sm"
              gap={2}
            >
              <it.icon size={16} />
              {it.label}
            </Button>
          );
        })}
      </Flex>

      <Flex align="center" gap={3}>
        <Flex
          w="36px"
          h="36px"
          rounded="full"
          bg="secondary.500"
          color="white"
          align="center"
          justify="center"
          fontFamily="'Caveat', cursive"
          fontSize="md"
          fontStyle="italic"
        >
          {user?.name?.charAt(0).toUpperCase() ?? '?'}
        </Flex>
        <Button variant="ghost" size="sm" color="neutral.500" onClick={handleLogout} gap={1}>
          <LuLogOut size={14} />
          Sair
        </Button>
      </Flex>
    </Flex>
  );
}
