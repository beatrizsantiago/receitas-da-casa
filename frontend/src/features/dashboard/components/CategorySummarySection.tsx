import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuChevronRight } from 'react-icons/lu';

interface CategoryCount {
  cat: string;
  count: number;
  meta?: { label: string; bg: string; fg: string };
}

interface Props {
  categories: CategoryCount[];
  onViewAll: () => void;
}

export function CategorySummarySection({ categories, onViewAll }: Props) {
  if (categories.length === 0) return null;

  return (
    <Box>
      <Flex justify="space-between" align="flex-end" mb={4}>
        <Box>
          <Text color="neutral.500" textTransform="lowercase" letterSpacing="0.04em" fontFamily="'Caveat', cursive">
            organizadas
          </Text>
          <Heading size="md" color="neutral.800" fontWeight="600" letterSpacing="-0.01em">
            Por categoria
          </Heading>
        </Box>
        <Button variant="ghost" size="sm" color="neutral.500" onClick={onViewAll}>
          <Flex align="center" gap={1}>
            Ver todas
            <LuChevronRight size={14} />
          </Flex>
        </Button>
      </Flex>
      <Flex direction="column" gap={2}>
        {categories.map((c) => (
          <Flex
            key={c.cat}
            align="center"
            justify="space-between"
            px={4}
            py={3.5}
            bg={c.meta?.bg ?? 'neutral.50'}
            rounded="xl"
            cursor="pointer"
            _hover={{ opacity: 0.9 }}
            onClick={onViewAll}
          >
            <Text fontWeight="500" fontSize="md" color={c.meta?.fg ?? 'neutral.800'} letterSpacing="-0.005em">
              {c.meta?.label ?? c.cat}
            </Text>
            <Text fontFamily="mono" fontSize="xs" color={c.meta?.fg ?? 'neutral.800'} opacity={0.7}>
              {String(c.count).padStart(2, '0')} receitas
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
