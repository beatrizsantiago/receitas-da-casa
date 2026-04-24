import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';
import { RecipeCard } from '@/features/recipes/components/RecipeCard';
import type { Recipe } from '@/features/recipes/types';

interface Props {
  recipes: Recipe[];
  mobile: boolean;
  onViewAll: () => void;
}

export function RecentRecipesSection({ recipes, mobile, onViewAll }: Props) {
  if (recipes.length === 0) return null;

  return (
    <Box mt={8}>
      <Flex justify="space-between" align="flex-end" mb={4}>
        <Box>
          <Text
            fontFamily="'Caveat', cursive"
            fontSize="18px"
            color="primary.500"
            lineHeight={1}
          >
            feitas recentemente
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '22px' : '28px'}
            fontWeight="500"
            color="neutral.800"
            letterSpacing="-0.02em"
            lineHeight={1.1}
            mt={0.5}
          >
            Últimas da cozinha
          </Heading>
        </Box>
        {!mobile && (
          <Button
            size="sm"
            variant="outline"
            borderColor="beige.200"
            color="neutral.500"
            rounded="full"
            fontSize="13px"
            fontWeight="500"
            display="inline-flex"
            alignItems="center"
            gap={1}
            px={3.5}
            _hover={{ bg: 'beige.50', borderColor: 'beige.300' }}
            onClick={onViewAll}
          >
            Ver todas
            <LuChevronRight size={13} />
          </Button>
        )}
      </Flex>
      <Grid templateColumns={mobile ? '1fr' : 'repeat(4, 1fr)'} gap={3.5}>
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </Grid>
    </Box>
  );
}
