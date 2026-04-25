import { Box, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_META, COVER_GRADIENT } from '@/shared';
import type { PublicRecipeSummary } from '../types';

interface Props {
  recipe: PublicRecipeSummary;
}

export function PublicRecipeCard({ recipe }: Props) {
  const navigate = useNavigate();
  const cover = recipe.photos?.[0];
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
      onClick={() => navigate(`/detalhes-da-receita/${recipe.id}`)}
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
          <Box w="full" h="full" style={{ background: COVER_GRADIENT }} />
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
          bg={cat?.bg}
          color={cat?.fg}
        >
          {cat?.label ?? recipe.category}
        </Box>
      </Box>

      <Box p={3.5} flex={1}>
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
                style={{ backgroundColor: t.tag.color + '18', color: t.tag.color }}
              >
                #{t.tag.name}
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
}
