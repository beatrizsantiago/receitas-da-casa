import { Flex, Spinner, Text } from '@chakra-ui/react';

interface Props {
  label?: string;
}

export function LoadingSpinner({ label }: Props) {
  return (
    <Flex direction="column" align="center" justify="center" gap={3} py={12}>
      <Spinner size="xl" color="primary.500" borderWidth="3px" />
      {label && <Text color="neutral.500">{label}</Text>}
    </Flex>
  );
}
