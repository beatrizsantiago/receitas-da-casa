import { Box, Text, Button } from '@chakra-ui/react';

interface Props {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <Box textAlign="center" py={12} px={6}>
      <Text fontSize="4xl" mb={3}>🍽️</Text>
      <Text fontSize="lg" fontWeight="semibold" color="neutral.700" mb={1}>
        {title}
      </Text>
      {description && (
        <Text color="neutral.500" mb={4}>{description}</Text>
      )}
      {action && (
        <Button colorPalette="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
