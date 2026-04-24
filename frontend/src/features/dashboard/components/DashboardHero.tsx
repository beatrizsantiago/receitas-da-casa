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
    <Box
      position="relative"
      overflow="hidden"
      borderRadius="20px"
      px={mobile ? 5 : 7}
      py={mobile ? 5 : 6}
      bg="linear-gradient(120deg, #C44A2F 0%, #A43A24 100%)"
      color="white"
    >
      <Box
        position="absolute"
        top="-50px"
        right="-20px"
        w="200px"
        h="200px"
        borderRadius="full"
        bg="rgba(255,255,255,0.07)"
      />
      <Box
        position="absolute"
        bottom="-70px"
        right="80px"
        w="160px"
        h="160px"
        borderRadius="full"
        bg="rgba(255,255,255,0.05)"
      />

      <Flex
        position="relative"
        direction={mobile ? 'column' : 'row'}
        align={mobile ? 'flex-start' : 'center'}
        justify="space-between"
        gap={4}
      >
        <Box>
          <Text
            fontFamily="'Caveat', cursive"
            fontSize={mobile ? '18px' : '20px'}
            color="rgba(255,235,220,0.85)"
            lineHeight={1}
          >
            {greeting},
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '28px' : '34px'}
            fontWeight="500"
            letterSpacing="-0.02em"
            lineHeight={1.05}
            mt={0.5}
          >
            {userName ?? 'Chef'} ✿
          </Heading>
          <Text fontSize="14px" color="rgba(255,235,220,0.8)" mt={1.5} maxW="420px" lineHeight={1.5}>
            {recipeCount === 0
              ? 'Seu caderno está pronto para começar.'
              : `Você tem ${recipeCount} receitas guardadas. O que vai ser hoje?`}
          </Text>
        </Box>
        <Button
          bg="rgba(255,251,243,0.95)"
          color="primary.700"
          fontWeight="600"
          fontSize="13px"
          rounded="10px"
          px={4}
          size="sm"
          flexShrink={0}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          boxShadow="0 4px 12px rgba(0,0,0,0.15)"
          _hover={{ bg: 'white' }}
          onClick={onNewRecipe}
        >
          <LuPlus size={15} />
          Nova Receita
        </Button>
      </Flex>
    </Box>
  );
}
