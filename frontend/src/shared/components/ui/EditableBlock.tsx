import { useState } from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuCheck, LuPencil } from 'react-icons/lu';
import { toast } from 'react-toastify';

interface Props {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  editor: React.ReactNode;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
  canEdit?: boolean;
}

export function EditableBlock({ eyebrow, title, children, editor, onSave, onCancel, canEdit = true }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave();
      setEditing(false);
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor={editing ? 'primary.100' : 'beige.100'}
      boxShadow={
        editing
          ? '0 0 0 3px rgba(196,74,47,0.08)'
          : '0 1px 2px rgba(47,30,10,0.03)'
      }
      p={5}
      transition="border-color 160ms, box-shadow 160ms"
    >
      <Flex justify="space-between" align="flex-start" gap={3} mb={3.5}>
        <Box minW={0}>
          {eyebrow && (
            <Text
              fontFamily="'Caveat', cursive"
              fontSize="18px"
              color="primary.500"
              lineHeight={1}
              mb={2}
            >
              {eyebrow}
            </Text>
          )}
          {title && (
            <Heading
              fontFamily="'Fraunces', Georgia, serif"
              fontSize="22px"
              fontWeight="500"
              color="neutral.800"
              letterSpacing="-0.015em"
              lineHeight={1.15}
            >
              {title}
            </Heading>
          )}
        </Box>
        {canEdit && !editing && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            fontSize="12px"
            fontWeight="600"
            color="neutral.500"
            borderColor="beige.200"
            rounded="8px"
            px={2.5}
            py={1.5}
            h="auto"
          >
            <LuPencil size={13} />
            Editar
          </Button>
        )}
      </Flex>

      {editing ? (
        <Box>
          {editor}
          <Flex
            gap={2}
            justify="flex-end"
            mt={3.5}
            pt={3.5}
            borderTopWidth="1px"
            borderColor="beige.100"
          >
            <Button
              size="sm"
              variant="ghost"
              fontSize="13px"
              fontWeight="550"
              onClick={() => {
                onCancel();
                setEditing(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              bg="primary.500"
              color="white"
              fontSize="13px"
              fontWeight="550"
              rounded="10px"
              loading={saving}
              onClick={handleSave}
              display="inline-flex"
              alignItems="center"
              gap={1.5}
              boxShadow="0 6px 14px rgba(196,74,47,0.25)"
            >
              <LuCheck size={14} />
              Salvar
            </Button>
          </Flex>
        </Box>
      ) : (
        children
      )}
    </Box>
  );
}
