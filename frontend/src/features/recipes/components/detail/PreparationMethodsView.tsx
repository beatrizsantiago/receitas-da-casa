import { Box, Flex, Text } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface StepRow {
  id: number;
  description: string;
  order: number;
}

interface MethodRow {
  id: number;
  title?: string | null;
  order: number;
  steps: StepRow[];
}

interface Props {
  preparationMethods?: MethodRow[];
}

export function PreparationMethodsView({ preparationMethods }: Props) {
  if (!preparationMethods || preparationMethods.length === 0) {
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
          Nenhum modo de preparo adicionado.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {preparationMethods.map((method, methodIdx) => (
        <Box key={method.id} mb={methodIdx < preparationMethods.length - 1 ? 6 : 0}>
          {method.title && (
            <Text
              fontSize="13px"
              fontWeight="700"
              color="neutral.600"
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={3}
            >
              {method.title}
            </Text>
          )}

          {method.steps.length === 0 ? (
            <Text fontSize="13px" color="neutral.400" fontStyle="italic">
              Nenhum passo adicionado.
            </Text>
          ) : (
            <Box as="ol" listStyleType="none" p={0} m={0}>
              {method.steps.map((step, stepIdx) => (
                <Box
                  key={step.id}
                  as="li"
                  display="flex"
                  alignItems="flex-start"
                  gap={3.5}
                  mb={3.5}
                >
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
                    {stepIdx + 1}
                  </Flex>
                  <Box flex={1} fontSize="14px" color="neutral.800" lineHeight={1.55} pt={1}>
                    <ReactMarkdown
                      remarkPlugins={[remarkBreaks]}
                      components={{
                        p: ({ children }) => <Text as="p" mb={1.5} _last={{ mb: 0 }}>{children}</Text>,
                        strong: ({ children }) => <Text as="strong" fontWeight="600">{children}</Text>,
                        em: ({ children }) => <Text as="em" fontStyle="italic">{children}</Text>,
                        ul: ({ children }) => <Box as="ul" pl={4} mb={1.5}>{children}</Box>,
                        ol: ({ children }) => <Box as="ol" pl={4} mb={1.5}>{children}</Box>,
                        li: ({ children }) => <Box as="li" mb={0.5}>{children}</Box>,
                      }}
                    >
                      {step.description}
                    </ReactMarkdown>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {methodIdx < preparationMethods.length - 1 && (
            <Box borderBottom="1px solid" borderColor="beige.200" mt={2} />
          )}
        </Box>
      ))}
    </Box>
  );
}
