import { useRef } from 'react';
import { Box, Button, Field, Flex, Input, Text } from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';
import type { ApiErrorResponse } from '@/shared/utils/parseError';
import type { AxiosError } from 'axios';

interface Props {
  draft: { name: string; color: string };
  onChange: (draft: { name: string; color: string }) => void;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  mobile: boolean;
  mutationError?: AxiosError<ApiErrorResponse> | null;
}

export function TagForm({ draft, onChange, onSave, onCancel, isPending, mobile, mutationError }: Props) {
  const colorRef = useRef<HTMLInputElement>(null);
  const validationErrors = mutationError?.response?.data?.validation_errors;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="primary.100"
      boxShadow="0 0 0 3px rgba(196,74,47,0.08)"
      p={mobile ? 4 : 5}
      mb={5}
    >
      <Text
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="18px"
        fontWeight="500"
        color="neutral.800"
        mb={4}
        letterSpacing="-0.01em"
      >
        Nova tag
      </Text>

      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={3.5}>
          <Flex
            direction="row"
            alignItems="flex-end"
            gap={3.5}
          >
            <Field.Root required invalid={!!validationErrors?.name} flex="1">
              <Field.Label fontSize="13px" fontWeight="550" color="neutral.600" mb={1.5} letterSpacing="-0.005em">
                Nome
                <Field.RequiredIndicator />
              </Field.Label>
              <Input
                name="name"
                value={draft.name}
                onChange={(e) => onChange({ ...draft, name: e.target.value.replace(/^#/, '') })}
                placeholder="ex: domingo"
                autoFocus
                bg="beige.50"
                fontSize="15px"
                px={3.5}
                _focus={{ bg: 'white' }}
              />
              {validationErrors?.name?.map((error, index) => (
                <Field.ErrorText key={index}>{error}</Field.ErrorText>
              ))}
            </Field.Root>

            <Box position="relative">
              <button
                type="button"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: 'none',
                  backgroundColor: draft.color,
                  boxShadow: `0 0 0 3px ${draft.color}44, 0 2px 6px rgba(0,0,0,0.12)`,
                }}
                onClick={() => colorRef.current?.click()}
              />
              <input
                ref={colorRef}
                type="color"
                value={draft.color}
                onChange={(e) => onChange({ ...draft, color: e.target.value })}
                style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
              />
            </Box>
          </Flex>

          <Flex align="center" gap={2}>
            <Text
              fontSize="10px"
              color="neutral.400"
              fontWeight="700"
              letterSpacing="0.08em"
              textTransform="uppercase"
            >
              Pré-visualização
            </Text>
            <Box
              as="span"
              display="inline-flex"
              px={3}
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
        </Flex>

        <Flex gap={2} justifyContent="flex-end" mt={4} pt={3.5} borderTopWidth="1px" borderColor="beige.100">
          <Button
            type="button"
            variant="ghost"
            fontSize="13px"
            fontWeight="500"
            color="neutral.500"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            bg="primary.500"
            color="white"
            fontSize="13px"
            fontWeight="550"
            px={4}
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
      </form>
    </Box>
  );
}
