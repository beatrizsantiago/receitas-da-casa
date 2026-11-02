import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LuFlame, LuShare2 } from 'react-icons/lu';
import type { Recipe } from '../types';
import { CATEGORY_META, COVER_GRADIENT, shareRecipe } from '@/shared';

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const cover = recipe.photos?.find((p) => p.type === 'COVER');
  const cat = CATEGORY_META[recipe.category];

  return (
    <Box
      cursor="pointer"
      overflow="hidden"
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="beige.100"
      boxShadow="0 1px 3px rgba(47,30,10,0.06)"
      _hover={{ boxShadow: '0 8px 24px rgba(47,30,10,0.12)', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      onClick={() => navigate(`/receitas/${recipe.id}`)}
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" h="160px" overflow="hidden">
        {cover ? (
          <Box
            w="full"
            h="full"
            backgroundImage={`url(${cover.url})`}
            backgroundSize="cover"
            backgroundPosition={`center ${cover.positionY ?? 50}%`}
          />
        ) : (
          <Box
            w="full"
            h="full"
            style={{ background: COVER_GRADIENT }}
          />
        )}

        <Box
          position="absolute"
          top={2.5}
          left={2.5}
          px={2}
          py={0.5}
          rounded="md"
          fontSize="11px"
          fontWeight="500"
          boxShadow="0 1px 3px rgba(0,0,0,0.12)"
          bg={cat?.bg}
          color={cat?.fg}
        >
          {cat?.label ?? recipe.category}
        </Box>

        <Box
          position="absolute"
          top={2.5}
          right={2.5}
          px={2}
          py={0.5}
          rounded="md"
          fontSize="11px"
          fontWeight="500"
          boxShadow="0 1px 3px rgba(0,0,0,0.12)"
          bg={recipe.isPublic ? 'red.100' : 'neutral.100'}
          color={recipe.isPublic ? 'red.700' : 'neutral.500'}
        >
          {recipe.isPublic ? 'Pública' : 'Privada'}
        </Box>
      </Box>

      <Box p={3.5} display="flex" flexDirection="column" flex={1} gap={0} justifyContent="space-between">
        <Box>

          <Text
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="15px"
            fontWeight="500"
            color="neutral.800"
            letterSpacing="-0.01em"
            lineHeight={1.25}
            lineClamp={2}
          >
            {recipe.title || 'Sem título'}
          </Text>

          {recipe.description && (
            <Text
              fontSize="12px"
              color="neutral.500"
              mt={1}
              lineClamp={2}
              lineHeight={1.5}
            >
              {recipe.description}
            </Text>
          )}

          {recipe.tags && recipe.tags.length > 0 && (
            <Flex gap={1} flexWrap="wrap" mt={2}>
              {recipe.tags.map((t) => (
                <Box
                  key={t.tag.id}
                  as="span"
                  display="inline-flex"
                  px={2}
                  py={0.5}
                  rounded="full"
                  fontSize="10px"
                  fontWeight="600"
                  style={{
                    backgroundColor: t.tag.color + '18',
                    color: t.tag.color,
                  }}
                >
                  #{t.tag.name}
                </Box>
              ))}
            </Flex>
          )}
        </Box>

        <Box mt={3}>
          <hr />
          <Flex align="center" justify="space-between" mt="auto" pt={2.5} fontSize="11px" color="neutral.400">
            <Flex align="center" gap={1}>
              <LuFlame size={13} color="var(--chakra-colors-secondary-500)" />
              <Text>{recipe.cooks ?? 0}x feita</Text>
            </Flex>
            {recipe.isPublic && (
              <Box
                as="button"
                aria-label="Compartilhar receita"
                title="Compartilhar receita"
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="26px"
                h="26px"
                rounded="6px"
                color="neutral.400"
                cursor="pointer"
                _hover={{ color: 'primary.500', bg: 'beige.50' }}
                onClick={(e) => {
                  e.stopPropagation();
                  shareRecipe(recipe.id, recipe.title);
                }}
              >
                <LuShare2 size={14} />
              </Box>
            )}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
