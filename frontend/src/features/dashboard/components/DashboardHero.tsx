import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { useGreeting } from '../hooks/useGreeting';

interface Props {
  userName?: string;
  recipeCount: number;
  mobile: boolean;
  onNewRecipe: () => void;
}

export function DashboardHero({ userName, recipeCount, mobile, onNewRecipe }: Props) {
  const greeting = useGreeting();

  return (
    <Box position="relative" overflow="hidden" borderRadius="2xl" p={mobile ? 6 : 7} bg="linear-gradient(120deg, #C44A2F 0%, #A43A24 100%)" color="white">
      <Box position="absolute" top="-40px" right="-30px" w="180px" h="180px" borderRadius="full" bg="rgba(242,201,76,0.2)" />
      <Box position="absolute" bottom="-60px" right="60px" w="140px" h="140px" borderRadius="full" bg="rgba(242,201,76,0.12)" />

      <Flex position="relative" direction={mobile ? 'column' : 'row'} align={mobile ? 'flex-start' : 'center'} justify="space-between" gap={4}>
        <Box>
          <Text fontFamily="'Caveat', cursive" fontSize="2xl" color="yellow.200" lineHeight={1}>
            {greeting},
          </Text>
          <Heading size={mobile ? 'lg' : 'xl'} fontWeight="500" letterSpacing="-0.02em" lineHeight={1.1} mt={1}>
            {userName ?? 'Chef'} ✿
          </Heading>
          <Text fontSize="sm" opacity={0.85} mt={2} maxW="420px" lineHeight={1.5}>
            {recipeCount === 0
              ? 'Seu caderno está pronto para começar.'
              : `Você tem ${recipeCount} receitas guardadas. O que vai ser hoje?`}
          </Text>
        </Box>
        <Button bg="white" color="primary.600" fontWeight="600" onClick={onNewRecipe} shadow="lg" _hover={{ bg: 'beige.50' }} flexShrink={0}>
          <Flex align="center" gap={2}>
            <LuPlus size={16} />
            Nova Receita
          </Flex>
        </Button>
      </Flex>
    </Box>
  );
}
