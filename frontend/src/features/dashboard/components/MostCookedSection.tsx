import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { COVER_GRADIENT } from '@/shared/utils/constants';
import type { Recipe } from '@/features/recipes/types';

interface Props {
  recipes: Recipe[];
  onRecipeClick: (id: number) => void;
}

const CATEGORY_META: Record<string, { label: string }> = {
  SWEET: { label: 'Doce' },
  SAVORY: { label: 'Salgado' },
};

export function MostCookedSection({ recipes, onRecipeClick }: Props) {
  if (recipes.length === 0) return null;

  return (
    <Box>
      <Box mb={4}>
        <Text
          fontFamily="'Caveat', cursive"
          fontSize="18px"
          color="primary.500"
          lineHeight={1}
        >
          o que você mais faz
        </Text>
        <Heading
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="28px"
          fontWeight="500"
          color="neutral.800"
          letterSpacing="-0.02em"
          lineHeight={1.1}
          mt={0.5}
        >
          Clássicas da casa
        </Heading>
      </Box>

      <Flex direction="column" gap={2}>
        {recipes.map((r, i) => {
          const cover = r.photos?.find((p) => p.type === 'COVER');
          return (
            <Flex
              key={r.id}
              align="center"
              gap={3}
              px={4}
              py={3}
              bg="white"
              rounded="14px"
              borderWidth="1px"
              borderColor="beige.200"
              cursor="pointer"
              _hover={{ bg: 'beige.50' }}
              transition="background 120ms"
              onClick={() => onRecipeClick(r.id)}
            >
              <Text
                w="26px"
                flexShrink={0}
                fontFamily="'Fraunces', Georgia, serif"
                fontStyle="italic"
                fontSize="17px"
                fontWeight="400"
                color="neutral.300"
                lineHeight={1}
              >
                {String(i + 1).padStart(2, '0')}
              </Text>

              <Box
                w="44px"
                h="44px"
                flexShrink={0}
                rounded="12px"
                overflow="hidden"
              >
                {cover ? (
                  <Image
                    src={cover.url}
                    alt={r.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="full"
                    h="full"
                    style={{ background: COVER_GRADIENT }}
                  />
                )}
              </Box>

              <Box flex={1} minW={0}>
                <Text
                  fontFamily="'Fraunces', Georgia, serif"
                  fontWeight="500"
                  fontSize="14px"
                  color="neutral.800"
                  letterSpacing="-0.01em"
                  truncate
                >
                  {r.title}
                </Text>
                <Text fontSize="12px" color="neutral.400" mt={0.5}>
                  {CATEGORY_META[r.category]?.label ?? r.category}
                </Text>
              </Box>

              <Flex direction="column" align="flex-end" gap={0} flexShrink={0}>
                <Text
                  fontFamily="'Caveat', cursive"
                  fontSize="26px"
                  fontStyle="italic"
                  fontWeight="500"
                  color="primary.500"
                  lineHeight={1}
                >
                  {r.cooks ?? 0}
                </Text>
                <Text
                  fontSize="9px"
                  color="neutral.400"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                >
                  vezes
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
