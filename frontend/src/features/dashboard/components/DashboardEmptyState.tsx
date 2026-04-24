import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';

interface Props {
  onCreate: () => void;
}

export function DashboardEmptyState({ onCreate }: Props) {
  return (
    <Box mt={6}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        bg="white"
        p={10}
        rounded="2xl"
        borderWidth="1px"
        borderColor="beige.200"
        textAlign="center"
        gap={4}
      >
        <Text fontSize="4xl">📖</Text>
        <Heading size="md" color="neutral.700">
          Seu caderno está vazio
        </Heading>
        <Text color="neutral.500" maxW="400px">
          Comece adicionando sua primeira receita. Pode ser aquela da vovó, a que você improvisa no domingo, ou qualquer uma que queira guardar com carinho.
        </Text>
        <Button colorPalette="primary" onClick={onCreate}>
          <Flex align="center" gap={2}>
            <LuPlus size={16} />
            Criar primeira receita
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}
