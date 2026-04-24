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
    <Box mt={7}>
      <Flex justify="space-between" align="flex-end" mb={4}>
        <Box>
          <Text color="neutral.500" textTransform="lowercase" letterSpacing="0.04em" fontFamily="'Caveat', cursive">
            feitas recentemente
          </Text>
          <Heading size="md" color="neutral.800" fontWeight="600" letterSpacing="-0.01em">
            Últimas da cozinha
          </Heading>
        </Box>
        {!mobile && (
          <Button variant="ghost" size="sm" color="neutral.500" onClick={onViewAll}>
            <Flex align="center" gap={1}>
              Ver todas
              <LuChevronRight size={14} />
            </Flex>
          </Button>
        )}
      </Flex>
      <Grid templateColumns={mobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))'} gap={3.5}>
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </Grid>
    </Box>
  );
}
