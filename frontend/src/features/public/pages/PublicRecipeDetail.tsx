import { useNavigate, useParams } from 'react-router-dom';
import { Box, Heading, Image } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuChevronLeft } from 'react-icons/lu';
import { usePublicRecipeQuery } from '../hooks/usePublicRecipes';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ViewBlock } from '@/shared/components/ui/ViewBlock';
import { IngredientsView } from '@/features/recipes/components/detail/IngredientsView';
import { StepsView } from '@/features/recipes/components/detail/StepsView';
import { COVER_GRADIENT } from '@/shared/utils/constants';

export default function PublicRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = Number(id);
  const { data: recipe, isLoading, error } = usePublicRecipeQuery(recipeId);
  const mobile = useBreakpointValue({ base: true, md: false });

  if (isLoading) {
    return (
      <Box minH="100vh" bg="beige.100">
        <LoadingSpinner />
      </Box>
    );
  }

  if (error || !recipe) {
    return (
      <Box minH="100vh" bg="beige.100">
        <EmptyState title="Receita não encontrada" />
      </Box>
    );
  }

  const coverPhoto = recipe.photos?.[0];

  return (
    <Box minH="100vh" bg="beige.100" pb={mobile ? 20 : 16}>
      <Box position="relative">
        {coverPhoto ? (
          <Box w="full" h={mobile ? '220px' : '320px'} overflow="hidden">
            <Image
              src={coverPhoto.url}
              alt={recipe.title}
              w="full"
              h="full"
              objectFit="cover"
              objectPosition={`center ${coverPhoto.positionY ?? 50}%`}
            />
          </Box>
        ) : (
          <Box w="full" h={mobile ? '220px' : '320px'} style={{ background: COVER_GRADIENT }} />
        )}

        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)"
          pointerEvents="none"
        />

        <Box position="absolute" top={4} left={mobile ? 4 : 6}>
          <Box
            as="button"
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255,251,243,0.95)"
            color="neutral.800"
            rounded="md"
            boxShadow="0 2px 8px rgba(0,0,0,0.15)"
            onClick={() => navigate('/lista-de-receitas')}
          >
            <LuChevronLeft size={18} />
          </Box>
        </Box>

        <Box
          position="absolute"
          bottom={5}
          left={mobile ? 5 : 10}
          right={mobile ? 5 : 10}
        >
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '30px' : '42px'}
            fontWeight="500"
            letterSpacing="-0.02em"
            color="white"
            lineHeight={1.05}
            textShadow="0 2px 4px rgba(0,0,0,0.25)"
          >
            {recipe.title}
          </Heading>
        </Box>
      </Box>

      <Box
        maxW="900px"
        mx="auto"
        px={mobile ? 5 : 10}
        py={mobile ? 5 : 7}
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <ViewBlock eyebrow="você vai precisar de" title="Ingredientes">
          <IngredientsView ingredients={recipe.ingredients} />
        </ViewBlock>

        <ViewBlock eyebrow="modo de preparo" title="Passo a passo">
          <StepsView steps={recipe.steps} />
        </ViewBlock>
      </Box>
    </Box>
  );
}
