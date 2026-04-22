import { Box, Heading, Text, VStack } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack gap={4}>
        <Heading size="2xl">Receitas da Casa</Heading>
        <Text fontSize="lg" color="gray.500">
          Bem-vindo ao app de receitas!
        </Text>
      </VStack>
    </Box>
  );
}
