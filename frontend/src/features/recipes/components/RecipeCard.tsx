import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { LuFlame } from 'react-icons/lu';
import type { Recipe } from '../types';
import { gradientFromHues } from '@/shared/utils/colors';

const CATEGORY_META: Record<string, { label: string; tone: string }> = {
  SWEET: { label: 'Doce', tone: 'primary' },
  SAVORY: { label: 'Salgado', tone: 'secondary' },
};

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
            backgroundPosition="center"
          />
        ) : (
          <Box
            w="full"
            h="full"
            style={{ background: gradientFromHues(recipe.hues) }}
          />
        )}

        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(to bottom, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)"
        />

        <Box
          position="absolute"
          top={2.5}
          left={2.5}
          px={2}
          py={0.5}
          rounded="md"
          fontSize="11px"
          fontWeight="500"
          bg={cat?.tone === 'primary' ? 'primary.50' : 'secondary.50'}
          color={cat?.tone === 'primary' ? 'primary.800' : 'secondary.800'}
        >
          {cat?.label ?? recipe.category}
        </Box>

        <Text
          position="absolute"
          bottom={2.5}
          left={3}
          right={3}
          fontFamily="'Caveat', cursive"
          fontSize="22px"
          color="white"
          lineHeight={1.15}
          lineClamp={2}
          textShadow="0 1px 3px rgba(0,0,0,0.3)"
        >
          {recipe.title || 'Sem título'}
        </Text>
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
              {recipe.tags.slice(0, 3).map((t) => (
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
          <Flex align="center" gap={1} mt="auto" pt={2.5} fontSize="11px" color="neutral.400">
            <LuFlame size={13} color="var(--chakra-colors-secondary-500)" />
            <Text>{recipe.cooks ?? 0}x feita</Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
