import { Box, Text } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <Box
      textAlign="center"
      p={6}
      bg="beige.50"
      border="1.5px dashed"
      borderColor="beige.200"
      rounded="16px"
    >
      <Text fontSize="13px" color="neutral.500">
        {children}
      </Text>
    </Box>
  );
}
