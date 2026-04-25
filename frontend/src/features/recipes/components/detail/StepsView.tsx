import { Box, Flex, Text } from '@chakra-ui/react';

interface StepRow {
  id: number;
  description: string;
}

interface Props {
  steps?: StepRow[];
}

export function StepsView({ steps }: Props) {
  if (!steps || steps.length === 0) {
    return (
      <Box
        textAlign="center"
        p={6}
        bg="beige.50"
        border="1.5px dashed"
        borderColor="beige.200"
        rounded="16px"
      >
        <Text fontSize="13px" color="neutral.500">
          Nenhum passo ainda.
        </Text>
      </Box>
    );
  }

  return (
    <Box as="ol" listStyleType="none" p={0} m={0}>
      {steps.map((step, i) => (
        <Box key={step.id} as="li" display="flex" alignItems="flex-start" gap={3.5} mb={3.5}>
          <Flex
            w="32px"
            h="32px"
            rounded="full"
            bg="primary.500"
            color="white"
            align="center"
            justify="center"
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="14px"
            fontWeight="500"
            fontStyle="italic"
            flexShrink={0}
          >
            {i + 1}
          </Flex>
          <Text flex={1} fontSize="14px" color="neutral.800" lineHeight={1.55} pt={1}>
            {step.description}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
