import { Badge, Box, Card, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types';

const CATEGORY_LABEL: Record<string, string> = {
  SWEET: 'Doce',
  SAVORY: 'Salgado',
};

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const cover = recipe.photos?.find((p) => p.type === 'COVER');

  return (
    <Card.Root
      cursor="pointer"
      overflow="hidden"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      onClick={() => navigate(`/receitas/${recipe.id}`)}
    >
      <Box
        h="160px"
        bg="beige.200"
        backgroundImage={cover ? `url(${cover.url})` : undefined}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        {!cover && (
          <Flex h="full" align="center" justify="center" fontSize="4xl">
            🍲
          </Flex>
        )}
      </Box>

      <Card.Body gap={2}>
        <Flex justify="space-between" align="flex-start">
          <Text fontWeight="semibold" fontSize="md" lineClamp={2} flex={1}>
            {recipe.title}
          </Text>
          <Badge
            colorPalette={recipe.category === 'SWEET' ? 'yellow' : 'secondary'}
            ml={2}
            flexShrink={0}
          >
            {CATEGORY_LABEL[recipe.category]}
          </Badge>
        </Flex>

        {recipe.description && (
          <Text color="neutral.500" fontSize="sm" lineClamp={2}>
            {recipe.description}
          </Text>
        )}

        {recipe.tags && recipe.tags.length > 0 && (
          <Flex gap={1} flexWrap="wrap">
            {recipe.tags.map((t) => (
              <Badge
                key={t.tag.id}
                px={1.5}
                py={0.5}
                rounded="md"
                fontSize="xs"
                style={{ backgroundColor: t.tag.color, color: '#fff' }}
              >
                {t.tag.name}
              </Badge>
            ))}
          </Flex>
        )}

        {recipe._count?.cookHistory ? (
          <Text color="neutral.400" fontSize="xs">
            ✅ Cozinhada {recipe._count.cookHistory}×
          </Text>
        ) : null}
      </Card.Body>
    </Card.Root>
  );
}
