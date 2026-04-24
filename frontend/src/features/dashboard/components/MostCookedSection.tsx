import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import type { Recipe } from '@/features/recipes/types';

interface Props {
  recipes: Recipe[];
  onRecipeClick: (id: number) => void;
}

export function MostCookedSection({ recipes, onRecipeClick }: Props) {
  if (recipes.length === 0) return null;

  const CATEGORY_META: Record<string, { label: string }> = {
    SWEET: { label: 'Doce' },
    SAVORY: { label: 'Salgado' },
  };

  return (
    <Box>
      <Box mb={4}>
        <Text color="neutral.500" textTransform="lowercase" letterSpacing="0.04em" fontFamily="'Caveat', cursive">
          o que você mais faz
        </Text>
        <Heading size="md" color="neutral.800" fontWeight="600" letterSpacing="-0.01em">
          Clássicas da casa
        </Heading>
      </Box>
      <Flex direction="column" gap={2.5}>
        {recipes.map((r, i) => (
          <Flex
            key={r.id}
            align="center"
            gap={3.5}
            p={3}
            bg="white"
            rounded="xl"
            borderWidth="1px"
            borderColor="beige.200"
            cursor="pointer"
            _hover={{ bg: 'beige.50' }}
            transition="background 120ms"
            onClick={() => onRecipeClick(r.id)}
          >
            <Text
              w="36px"
              h="36px"
              flexShrink={0}
              fontFamily="'Caveat', cursive"
              fontStyle="italic"
              fontSize="xl"
              fontWeight="500"
              color="neutral.400"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {String(i + 1).padStart(2, '0')}
            </Text>

            <Box w="48px" h="48px" flexShrink={0} rounded="lg" bg="beige.200" display="flex" alignItems="center" justifyContent="center" fontSize="2xl">
              {r.photos?.find((p) => p.type === 'COVER') ? (
                <Image
                  src={r.photos.find((p) => p.type === 'COVER')!.url}
                  alt={r.title}
                  w="full"
                  h="full"
                  objectFit="cover"
                  rounded="lg"
                />
              ) : (
                '🍲'
              )}
            </Box>

            <Box flex={1} minW={0}>
              <Text fontWeight="500" fontSize="md" color="neutral.800" letterSpacing="-0.01em" truncate>
                {r.title}
              </Text>
              <Text fontSize="xs" color="neutral.500">
                {CATEGORY_META[r.category]?.label ?? r.category}
              </Text>
            </Box>

            <Flex direction="column" align="flex-end" gap={0.5}>
              <Text fontFamily="'Caveat', cursive" fontSize="2xl" fontStyle="italic" fontWeight="500" color="primary.500" lineHeight={1}>
                {r.cooks ?? 0}
              </Text>
              <Text fontSize="10px" color="neutral.400" fontWeight="500" letterSpacing="0.04em">
                VEZES
              </Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
