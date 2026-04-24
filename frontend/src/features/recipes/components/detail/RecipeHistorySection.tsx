import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuFlame, LuPlus } from 'react-icons/lu';
import type { CookHistory } from '../../types';

interface RecipeHistorySectionProps {
  history: CookHistory[] | undefined;
  onAddHistory: () => void;
}

export function RecipeHistorySection({
  history,
  onAddHistory,
}: RecipeHistorySectionProps) {
  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="beige.100"
      p={5}
    >
      <Box mb={4}>
        <Text
          fontFamily="'Caveat', cursive"
          fontSize="18px"
          color="primary.500"
          lineHeight={1}
          mb={2}
        >
          histórico
        </Text>
        <Heading
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="22px"
          fontWeight="500"
          color="neutral.800"
          letterSpacing="-0.015em"
          lineHeight={1.15}
        >
          Das vezes que fiz
        </Heading>
      </Box>

      <Button
        w="full"
        justifyContent="flex-start"
        gap={2.5}
        color="neutral.500"
        borderStyle="dashed"
        borderWidth="1.5px"
        borderColor="beige.200"
        bg="transparent"
        rounded="12px"
        py={3}
        px={3.5}
        h="auto"
        fontSize="13px"
        fontWeight="500"
        mb={2}
        onClick={onAddHistory}
      >
        <Box color="primary.500" display="flex">
          <LuPlus size={16} />
        </Box>
        Registrar que fiz essa receita hoje
      </Button>

      <Box mt={2}>
        {history && history.length > 0 ? (
          <Flex direction="column" gap={0}>
            {history.map((h) => (
              <Flex key={h.id} gap={3} align="flex-start" py={2.5}>
                <Box
                  w="36px"
                  h="36px"
                  flexShrink={0}
                  rounded="10px"
                  bg="secondary.50"
                  color="secondary.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <LuFlame size={16} />
                </Box>
                <Box flex={1}>
                  <Text fontSize="13px" fontWeight="550" color="neutral.800">
                    {new Date(h.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  {h.notes && (
                    <Text fontSize="12px" color="neutral.500" mt={0.5}>
                      {h.notes}
                    </Text>
                  )}
                </Box>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Box
            textAlign="center"
            p={6}
            bg="beige.50"
            border="1.5px dashed"
            borderColor="beige.200"
            rounded="16px"
          >
            <Text fontSize="13px" color="neutral.500">
              Ainda não registrou nenhum preparo.
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
