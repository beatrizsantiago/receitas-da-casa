import { chakra, type InputProps } from '@chakra-ui/react';
import { useState } from 'react';
import { LuEye, LuEyeOff, LuLock } from 'react-icons/lu';
import { IconInput } from './IconInput';

export function PasswordInput(props: Omit<InputProps, 'type'>) {
  const [show, setShow] = useState(false);

  return (
    <IconInput
      icon={<LuLock size={16} />}
      type={show ? 'text' : 'password'}
      rightElement={
        <chakra.button
          type="button"
          position="absolute"
          right="12px"
          top="50%"
          transform="translateY(-50%)"
          color="neutral.400"
          display="flex"
          alignItems="center"
          bg="transparent"
          border="none"
          cursor="pointer"
          p={0}
          _hover={{ color: 'neutral.600' }}
          onClick={() => setShow((prev) => !prev)}
          aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {show ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </chakra.button>
      }
      {...props}
    />
  );
}
