import { useState } from 'react';
import { Box, Button, Flex, Heading, Text, Textarea } from '@chakra-ui/react';
import { LuCheck, LuFlame, LuPlus } from 'react-icons/lu';
import type { CookHistory } from '../../types';

interface RecipeHistorySectionProps {
  history: CookHistory[] | undefined;
  onAddHistory: (notes?: string) => Promise<void>;
}

export function RecipeHistorySection({
  history,
  onAddHistory,
}: RecipeHistorySectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    try {
      await onAddHistory(noteText.trim() || undefined);
      setNoteText('');
      setIsAdding(false);
    } finally {
      setSaving(false);
    }
  }

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

      {isAdding ? (
        <Box
          borderWidth="1px"
          borderColor="beige.200"
          rounded="12px"
          p={3}
          mb={2}
        >
          <Text fontSize="12px" fontWeight="550" color="neutral.400" mb={1.5}>
            Anotação <Text as="span" fontWeight="400">(opcional)</Text>
          </Text>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Como foi dessa vez?"
            rows={2}
            bg="beige.50"
            fontSize="14px"
            color="neutral.800"
            px={3}
            py={2.5}
            resize="none"
            lineHeight={1.5}
            mb={2.5}
          />
          <Flex gap={2} justify="flex-end">
            <Button
              variant="ghost"
              size="sm"
              fontSize="13px"
              fontWeight="550"
              onClick={() => {
                setIsAdding(false);
                setNoteText('');
              }}
            >
              Cancelar
            </Button>
            <Button
              bg="primary.500"
              color="white"
              size="sm"
              fontSize="13px"
              fontWeight="550"
              rounded="10px"
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              boxShadow="0 6px 14px rgba(196,74,47,0.25)"
              loading={saving}
              onClick={handleConfirm}
            >
              <LuCheck size={14} />
              Registrar
            </Button>
          </Flex>
        </Box>
      ) : (
        <Button
          w="full"
          variant="outline"
          justifyContent="flex-start"
          gap={2.5}
          color="neutral.500"
          borderStyle="dashed"
          borderColor="beige.200"
          bg="transparent"
          py={3}
          px={3.5}
          fontSize="13px"
          fontWeight="500"
          mb={2}
          _hover={{ bg: 'beige.50' }}
          onClick={() => setIsAdding(true)}
        >
          <Box color="primary.500" display="flex">
            <LuPlus size={16} />
          </Box>
          Registrar que fiz essa receita hoje
        </Button>
      )}

      <Box mt={2}>
        {history && history.length > 0 ? (
          <Flex direction="column" gap={0}>
            {history.map((h) => (
              <Flex key={h.id} gap={3} align="center" py={2.5}>
                <Box
                  w="36px"
                  h="36px"
                  flexShrink={0}
                  rounded="full"
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
                    {' · '}
                    {new Date(h.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
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
