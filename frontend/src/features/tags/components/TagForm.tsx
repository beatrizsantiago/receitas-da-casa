import { Box, Button, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';
import { PALETTE } from '../utils/constants';

interface Props {
  draft: { name: string; color: string };
  onChange: (draft: { name: string; color: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  mobile: boolean;
}

export function TagForm({ draft, onChange, onSave, onCancel, isPending, mobile }: Props) {
  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="primary.100"
      boxShadow="0 0 0 3px rgba(196,74,47,0.08)"
      p={mobile ? 4.5 : 5.5}
      mb={4}
    >
      <Text
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="18px"
        fontWeight="500"
        color="neutral.800"
        mb={3.5}
        letterSpacing="-0.01em"
      >
        Nova tag
      </Text>

      <Grid templateColumns={mobile ? '1fr' : '1fr auto'} gap={4} alignItems="flex-start">
        <Flex direction="column" gap={3}>
          <Box>
            <Text fontSize="13px" fontWeight="550" color="neutral.600" mb={1.5} letterSpacing="-0.005em">
              Nome
            </Text>
            <Input
              value={draft.name}
              onChange={(e) => onChange({ ...draft, name: e.target.value.replace(/^#/, '') })}
              placeholder="ex: domingo"
              h="48px"
              rounded="12px"
              borderColor="beige.200"
              bg="white"
              fontSize="15px"
              px={3.5}
              _focus={{ borderColor: 'primary.300', boxShadow: 'none' }}
            />
          </Box>

          <Box>
            <Text fontSize="13px" fontWeight="550" color="neutral.600" mb={2} letterSpacing="-0.005em">
              Cor
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onChange({ ...draft, color: c })}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border:
                      draft.color === c
                        ? '2px solid #2F2F2F'
                        : '1px solid rgba(47,47,47,0.10)',
                    background: c,
                    cursor: 'pointer',
                    padding: 0,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {draft.color === c && <LuCheck size={14} color="#fff" />}
                </button>
              ))}
              <label
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  border: '1px solid rgba(47,47,47,0.10)',
                  background: '#FAF3E8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8A8072',
                  overflow: 'hidden',
                  position: 'relative',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => onChange({ ...draft, color: e.target.value })}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%',
                  }}
                />
                +
              </label>
            </Flex>
          </Box>
        </Flex>

        <Flex direction="column" gap={2} alignItems={mobile ? 'flex-start' : 'flex-end'}>
          <Text
            fontSize="11px"
            color="neutral.500"
            fontWeight="600"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            Pré-visualização
          </Text>
          <Box
            as="span"
            display="inline-flex"
            px={3.5}
            py={1.5}
            rounded="full"
            fontSize="13px"
            fontWeight="600"
            style={{
              backgroundColor: draft.color + '22',
              color: draft.color,
              border: `1px solid ${draft.color}44`,
            }}
          >
            #{draft.name || 'nome'}
          </Box>
        </Flex>
      </Grid>

      <Flex gap={2} justifyContent="flex-end" mt={4} pt={3.5} borderTopWidth="1px" borderColor="beige.100">
        <Button variant="ghost" size="sm" fontSize="13px" fontWeight="550" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          bg="primary.500"
          color="white"
          size="sm"
          fontSize="13px"
          fontWeight="550"
          rounded="10px"
          px={4}
          onClick={onSave}
          loading={isPending}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          boxShadow="0 6px 14px rgba(196,74,47,0.25)"
        >
          <LuCheck size={14} />
          Criar tag
        </Button>
      </Flex>
    </Box>
  );
}
