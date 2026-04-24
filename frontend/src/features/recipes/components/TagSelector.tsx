import { useMemo, useState } from 'react';
import { Badge, Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useTagsQuery } from '@/features/tags/hooks/useTags';

interface SelectedTag {
  name: string;
  color: string;
}

interface Props {
  selected: SelectedTag[];
  onChange: (tags: SelectedTag[]) => void;
}

function randomColor(): string {
  const colors = [
    '#C44A2F', '#5E6F3A', '#D4AE3F', '#88321F',
    '#4A4A4A', '#B69332', '#6A2617', '#394522',
    '#2F2F2F', '#7E654A', '#A63E27', '#4B5A2E',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function TagSelector({ selected, onChange }: Props) {
  const [input, setInput] = useState('');
  const [newColor, setNewColor] = useState(randomColor);

  const { data: tagsData } = useTagsQuery();
  const available = tagsData ?? [];

  const availableTags = useMemo(
    () => available.filter((t) => !selected.some((s) => s.name.toLowerCase() === t.name.toLowerCase())),
    [available, selected]
  );

  function addTag(name: string, color: string) {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed || selected.some((s) => s.name.toLowerCase() === trimmed)) return;
    onChange([...selected, { name: trimmed, color }]);
    setInput('');
    setNewColor(randomColor());
  }

  function removeTag(name: string) {
    onChange(selected.filter((t) => t.name !== name));
  }

  return (
    <Box>
      <Text fontWeight="semibold" fontSize="lg" mb={2}>
        Tags
      </Text>
      <Flex gap={2} mb={3} flexWrap="wrap">
        {selected.map((tag) => (
          <Badge
            key={tag.name}
            px={2}
            py={1}
            rounded="md"
            style={{ backgroundColor: tag.color, color: '#fff' }}
          >
            {tag.name}
            <Button
              size="xs"
              variant="ghost"
              ml={1}
              onClick={() => removeTag(tag.name)}
              color="inherit"
            >
              ✕
            </Button>
          </Badge>
        ))}
      </Flex>
      <Flex gap={2} align="center">
        <Input
          size="sm"
          placeholder="Nova tag"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(input, newColor);
            }
          }}
        />
        <Input
          size="sm"
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          w="50px"
          p={1}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => addTag(input, newColor)}
          disabled={!input.trim()}
        >
          Adicionar
        </Button>
      </Flex>
      {availableTags.length > 0 && (
        <Flex gap={2} mt={2} flexWrap="wrap">
          {availableTags.map((t) => (
            <Badge
              key={t.id}
              cursor="pointer"
              px={2}
              py={1}
              rounded="md"
              style={{ backgroundColor: t.color, color: '#fff' }}
              onClick={() => addTag(t.name, t.color)}
            >
              + {t.name}
            </Badge>
          ))}
        </Flex>
      )}
    </Box>
  );
}
