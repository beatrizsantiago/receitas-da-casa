import { Box, Flex, Text } from '@chakra-ui/react';
import { EmptyHint } from '@/shared/components/ui/EmptyHint';

interface IngredientRow {
  id: number;
  name: string;
  amount?: string | null;
}

interface Props {
  ingredients?: IngredientRow[];
}

export function IngredientsView({ ingredients }: Props) {
  if (!ingredients || ingredients.length === 0) {
    return <EmptyHint>Nenhum ingrediente ainda.</EmptyHint>;
  }

  return (
    <Flex direction="column" gap={2}>
      {ingredients.map((ing) => (
        <Box
          key={ing.id}
          display="flex"
          alignItems="center"
          bg="beige.50"
          rounded="10px"
          gap={3}
        >
          <Text
            as="span"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="12px"
            color="primary.500"
            fontWeight="600"
            px={3.5}
            py={2.5}
            minW="100px"
            maxWidth="100px"
            flexShrink={0}
          >
            {ing.amount}
          </Text>
          <Text as="span" flex={1} fontSize="14px" color="neutral.800">
            {ing.name}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}
