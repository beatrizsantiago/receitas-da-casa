import { Badge, Box, Card, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LuFlame } from 'react-icons/lu';
import type { Recipe } from '../types';

const CATEGORY_META: Record<string, { label: string; bg: string; fg: string }> = {
  SWEET: { label: 'Doce', bg: 'yellow.100', fg: 'yellow.900' },
  SAVORY: { label: 'Salgado', bg: 'secondary.100', fg: 'secondary.900' },
};

function gradientFromHues(hues?: [number, number]): string {
  if (!hues) return 'linear-gradient(135deg, #E8D8C3, #D6C6B3)';
  const c1 = `oklch(0.72 0.14 ${hues[0]})`;
  const c2 = `oklch(0.52 0.12 ${hues[1]})`;
  return `linear-gradient(135deg, ${c1}, ${c2})`;
}

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const cover = recipe.photos?.find((p) => p.type === 'COVER');
  const cat = CATEGORY_META[recipe.category];

  return (
    <Card.Root
      cursor="pointer"
      overflow="hidden"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      onClick={() => navigate(`/receitas/${recipe.id}`)}
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" h="160px">
        {cover ? (
          <Box
            w="full"
            h="full"
            backgroundImage={`url(${cover.url})`}
            backgroundSize="cover"
            backgroundPosition="center"
          />
        ) : (
          <Box w="full" h="full" style={{ background: gradientFromHues(recipe.hues) }}>
            <Flex h="full" align="center" justify="center" fontSize="4xl">
              🍲
            </Flex>
          </Box>
        )}

        <Badge
          position="absolute"
          top="12px"
          left="12px"
          bg={cat?.bg ?? 'neutral.100'}
          color={cat?.fg ?? 'neutral.800'}
          fontSize="xs"
          fontWeight="500"
          px={2}
          py={0.5}
          rounded="md"
        >
          {cat?.label ?? recipe.category}
        </Badge>
      </Box>

      <Card.Body p={4} display="flex" flexDirection="column" flex={1} gap={0}>
        <Text
          fontSize="lg"
          fontWeight="500"
          color="neutral.800"
          letterSpacing="-0.01em"
          lineHeight={1.2}
          lineClamp={2}
        >
          {recipe.title}
        </Text>

        {recipe.description && (
          <Text
            fontSize="xs"
            color="neutral.500"
            mt={1}
            lineClamp={2}
            lineHeight={1.45}
          >
            {recipe.description}
          </Text>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <Flex gap={1} flexWrap="wrap" mt={2.5}>
            {recipe.tags.slice(0, 3).map((t) => (
              <Badge
                key={t.tag.id}
                variant="subtle"
                colorPalette="neutral"
                fontSize="10px"
                px={1.5}
                py={0.5}
                rounded="md"
              >
                #{t.tag.name}
              </Badge>
            ))}
          </Flex>
        )}

        <Flex
          align="center"
          justify="space-between"
          mt="auto"
          pt={2.5}
          borderTopWidth="1px"
          borderColor="beige.200"
        >
          <Flex align="center" gap={1} fontSize="11px" color="neutral.400">
            <LuFlame size={13} color="var(--chakra-colors-yellow-500)" />
            <Text>{recipe.cooks ?? 0}x feita</Text>
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
