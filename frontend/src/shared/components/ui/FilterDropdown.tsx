import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { LuCheck } from 'react-icons/lu';

interface CategoryOption {
  key: string;
  label: string;
}

interface TagOption {
  id: number;
  name: string;
  color: string;
}

interface Props {
  categoryOptions: CategoryOption[];
  tags: TagOption[];
  draftCategory: string;
  draftTags: string[];
  onCategoryChange: (key: string) => void;
  onTagToggle: (name: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function FilterDropdown({
  categoryOptions,
  tags,
  draftCategory,
  draftTags,
  onCategoryChange,
  onTagToggle,
  onApply,
  onClear,
}: Props) {
  return (
    <Box
      position="absolute"
      top="calc(100% + 8px)"
      right={0}
      zIndex={300}
      bg="white"
      rounded="16px"
      boxShadow="0 8px 32px rgba(47,30,10,0.14)"
      borderWidth="1px"
      borderColor="beige.200"
      p={4}
      minW="260px"
      maxW="320px"
    >
      <Text
        fontSize="11px"
        fontWeight="700"
        color="neutral.500"
        letterSpacing="0.07em"
        textTransform="uppercase"
        mb={2}
      >
        Categoria
      </Text>

      <Flex direction="column" gap={1} mb={4}>
        {categoryOptions.map(({ key, label }) => (
          <Box
            as="button"
            key={key}
            display="flex"
            alignItems="center"
            gap={2.5}
            px={2.5}
            py={1.5}
            rounded="10px"
            fontSize="13px"
            fontWeight="500"
            color={draftCategory === key ? 'primary.700' : 'neutral.700'}
            bg={draftCategory === key ? 'primary.50' : 'transparent'}
            transition="all 0.12s"
            onClick={() => onCategoryChange(key)}
          >
            <Box
              w="16px"
              h="16px"
              rounded="full"
              borderWidth="1.5px"
              borderColor={draftCategory === key ? 'primary.500' : 'neutral.300'}
              bg={draftCategory === key ? 'primary.500' : 'transparent'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {draftCategory === key && <Box w="6px" h="6px" rounded="full" bg="white" />}
            </Box>
            {label}
          </Box>
        ))}
      </Flex>

      {tags.length > 0 && (
        <>
          <Text
            fontSize="11px"
            fontWeight="700"
            color="neutral.500"
            letterSpacing="0.07em"
            textTransform="uppercase"
            mb={2}
          >
            Tags
          </Text>
          <Flex direction="column" gap={1} mb={4}>
            {tags.map((t) => {
              const checked = draftTags.includes(t.name);
              return (
                <Box
                  as="button"
                  key={t.id}
                  display="flex"
                  alignItems="center"
                  gap={2.5}
                  px={2.5}
                  py={1.5}
                  rounded="10px"
                  fontSize="13px"
                  fontWeight="500"
                  color="neutral.700"
                  bg={checked ? t.color + '12' : 'transparent'}
                  transition="all 0.12s"
                  onClick={() => onTagToggle(t.name)}
                >
                  <Box
                    w="16px"
                    h="16px"
                    rounded="4px"
                    borderWidth="1.5px"
                    borderColor={checked ? t.color : 'neutral.300'}
                    bg={checked ? t.color : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {checked && <LuCheck size={10} color="white" />}
                  </Box>
                  <Box as="span" style={{ color: t.color }} fontWeight="600">
                    #{t.name}
                  </Box>
                </Box>
              );
            })}
          </Flex>
        </>
      )}

      <Flex gap={2} borderTopWidth="1px" borderColor="beige.100" pt={3}>
        <Button
          variant="ghost"
          size="sm"
          flex={1}
          fontSize="13px"
          fontWeight="500"
          color="neutral.500"
          onClick={onClear}
        >
          Limpar
        </Button>
        <Button
          bg="primary.500"
          color="white"
          size="sm"
          flex={1}
          fontSize="13px"
          fontWeight="550"
          rounded="10px"
          onClick={onApply}
        >
          Filtrar
        </Button>
      </Flex>
    </Box>
  );
}
