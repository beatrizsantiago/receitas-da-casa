import { Box, Flex, Heading, Text } from '@chakra-ui/react';

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
      <Box mb={4}>
        <Text
          fontFamily="'Caveat', cursive"
          fontSize="18px"
          color="primary.500"
          lineHeight={1}
        >
          organizadas
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
          Por categoria
        </Heading>
      </Box>

      <Flex direction="column" gap={2}>
        {categories.map((c) => (
          <Flex
            key={c.cat}
            align="center"
            justify="space-between"
            px={4}
            py={3.5}
            bg={c.meta?.bg ?? 'neutral.50'}
            rounded="14px"
            cursor="pointer"
            _hover={{ opacity: 0.85 }}
            transition="opacity 120ms"
            onClick={onViewAll}
          >
            <Text
              fontFamily="'Fraunces', Georgia, serif"
              fontWeight="500"
              fontSize="16px"
              color={c.meta?.fg ?? 'neutral.800'}
              letterSpacing="-0.01em"
            >
              {c.meta?.label ?? c.cat}
            </Text>
            <Text
              fontFamily="'Courier New', monospace"
              fontSize="12px"
              color={c.meta?.fg ?? 'neutral.800'}
              opacity={0.7}
              letterSpacing="0.03em"
            >
              {String(c.count).padStart(2, '0')} receitas
            </Text>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
}
