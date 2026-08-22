import { Box, Input, type InputProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface IconInputProps extends InputProps {
  icon: ReactNode;
  rightElement?: ReactNode;
}

export function IconInput({ icon, rightElement, ...inputProps }: IconInputProps) {
  return (
    <Box position="relative" w="full">
      <Box
        position="absolute"
        left="12px"
        top="50%"
        transform="translateY(-50%)"
        zIndex={1}
        color="neutral.400"
        pointerEvents="none"
        display="flex"
        alignItems="center"
      >
        {icon}
      </Box>
      <Input pl="38px" pr={rightElement ? '38px' : undefined} {...inputProps} />
      {rightElement}
    </Box>
  );
}
