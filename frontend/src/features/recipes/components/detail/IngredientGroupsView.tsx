import { Box, Flex, Text } from '@chakra-ui/react';
import { EmptyHint } from '@/shared/components/ui/EmptyHint';

interface IngredientRow {
  id: number;
  name: string;
  amount?: string | null;
}

interface GroupRow {
  id: number;
  title?: string | null;
  order: number;
  ingredients: IngredientRow[];
}

interface Props {
  ingredientGroups?: GroupRow[];
}

export function IngredientGroupsView({ ingredientGroups }: Props) {
  if (!ingredientGroups || ingredientGroups.length === 0) {
    return <EmptyHint>Nenhum ingrediente ainda.</EmptyHint>;
  }

  return (
    <Box>
      {ingredientGroups.map((group, groupIdx) => (
        <Box key={group.id} mb={groupIdx < ingredientGroups.length - 1 ? 6 : 0}>
          {group.title && (
            <Text
              fontSize="13px"
              fontWeight="700"
              color="neutral.600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={3}
            >
              {group.title}
            </Text>
          )}

          {group.ingredients.length === 0 ? (
            <Text fontSize="13px" color="neutral.400" fontStyle="italic">
              Nenhum ingrediente adicionado.
            </Text>
          ) : (
            <Flex direction="column" gap={2}>
              {group.ingredients.map((ing) => (
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
          )}

          {groupIdx < ingredientGroups.length - 1 && (
            <Box borderBottom="1px solid" borderColor="beige.200" mt={2} />
          )}
        </Box>
      ))}
    </Box>
  );
}
