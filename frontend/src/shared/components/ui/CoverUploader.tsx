import { Box, Text } from '@chakra-ui/react';
import { LuCamera } from 'react-icons/lu';

interface Props {
  hasPhoto: boolean;
  onAdd: () => void;
}

export function CoverUploader({ hasPhoto, onAdd }: Props) {
  if (hasPhoto) return null;

  return (
    <Box
      h="200px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2.5}
      bg="beige.50"
      rounded="16px"
      border="1.5px dashed"
      borderColor="beige.200"
      cursor="pointer"
      onClick={onAdd}
    >
      <Box display="inline-flex" p={3.5} rounded="full" bg="white" color="primary.500">
        <LuCamera size={24} />
      </Box>
      <Text
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="18px"
        fontWeight="500"
        color="neutral.800"
        letterSpacing="-0.01em"
      >
        Adicionar foto de capa
      </Text>
      <Text fontSize="12px" color="neutral.500">
        Clique para selecionar do seu dispositivo
      </Text>
    </Box>
  );
}
