import { useMemo, useRef, useState } from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';
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
  const colorInputRef = useRef<HTMLInputElement>(null);

  const { data: tagsData } = useTagsQuery();
  const available = tagsData ?? [];

  const availableTags = useMemo(
    () =>
      available.filter(
        (t) => !selected.some((s) => s.name.toLowerCase() === t.name.toLowerCase())
      ),
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
      <Flex
        borderWidth="1px"
        borderColor="beige.200"
        rounded="12px"
        p={2}
        gap={1.5}
        flexWrap="wrap"
        align="center"
        minH="44px"
        bg="white"
        _focusWithin={{ borderColor: 'primary.200' }}
        transition="border-color 150ms"
      >
        {selected.map((tag) => (
          <Flex
            key={tag.name}
            as="span"
            align="center"
            gap={1}
            px={2.5}
            py={1}
            rounded="full"
            fontSize="12px"
            fontWeight="600"
            flexShrink={0}
            style={{
              backgroundColor: tag.color + '22',
              color: tag.color,
              border: `1px solid ${tag.color}55`,
            }}
          >
            #{tag.name}
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="none"
              bg="transparent"
              cursor="pointer"
              color="inherit"
              opacity={0.6}
              _hover={{ opacity: 1 }}
              p={0}
              onClick={() => removeTag(tag.name)}
            >
              <LuX size={11} />
            </Box>
          </Flex>
        ))}

        <Flex align="center" gap={1.5} flex={1} minW="120px">
          <Box
            as="button"
            w="16px"
            h="16px"
            rounded="full"
            flexShrink={0}
            border="none"
            cursor="pointer"
            style={{ backgroundColor: newColor }}
            boxShadow="0 0 0 2px rgba(0,0,0,0.08)"
            onClick={() => colorInputRef.current?.click()}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(input, newColor);
              }
            }}
            border="none"
            bg="transparent"
            fontSize="13px"
            color="neutral.700"
            placeholder="Nova tag..."
            _placeholder={{ color: 'neutral.400' }}
            _focus={{ boxShadow: 'none', outline: 'none' }}
            p={0}
            h="auto"
          />
        </Flex>
      </Flex>

      {availableTags.length > 0 && (
        <Box mt={2.5}>
          <Text
            fontSize="11px"
            color="neutral.500"
            fontWeight="600"
            letterSpacing="0.05em"
            textTransform="uppercase"
            mb={1.5}
          >
            Das suas tags
          </Text>
          <Flex gap={1.5} flexWrap="wrap">
            {availableTags.map((t) => (
              <Box
                key={t.id}
                as="span"
                display="inline-flex"
                alignItems="center"
                gap={1}
                px={2.5}
                py={1}
                rounded="full"
                fontSize="12px"
                fontWeight="600"
                cursor="pointer"
                style={{
                  backgroundColor: t.color + '22',
                  color: t.color,
                  border: `1px solid ${t.color}55`,
                }}
                onClick={() => addTag(t.name, t.color)}
              >
                + #{t.name}
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
