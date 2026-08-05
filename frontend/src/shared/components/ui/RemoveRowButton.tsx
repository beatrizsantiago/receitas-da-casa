import { Box, type BoxProps } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';

export function RemoveRowButton({ mt, ...rest }: BoxProps) {
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="28px"
      h="28px"
      mt={mt}
      flexShrink={0}
      rounded="6px"
      color="neutral.300"
      cursor="pointer"
      border="none"
      bg="transparent"
      _hover={{ color: 'red.400', bg: 'red.50' }}
      {...rest}
    >
      <LuX size={14} />
    </Box>
  );
}
