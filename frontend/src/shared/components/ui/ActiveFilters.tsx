import { Flex } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';

interface TagOption {
  name: string;
  color: string;
}

interface ActiveCategoryBadge {
  label: string;
  tone: string;
  bg: string;
  fg: string;
}

interface Props {
  activeCategory?: ActiveCategoryBadge;
  tagFilter: string[];
  allTags: TagOption[];
  onRemoveCategory: () => void;
  onRemoveTag: (name: string) => void;
}

export function ActiveFilters({
  activeCategory,
  tagFilter,
  allTags,
  onRemoveCategory,
  onRemoveTag,
}: Props) {
  return (
    <Flex gap={2} flexWrap="wrap" mt={3}>
      {activeCategory && (
        <Flex
          as="button"
          align="center"
          gap={1.5}
          px={2.5}
          py={1}
          rounded="full"
          fontSize="12px"
          fontWeight="600"
          bg={activeCategory.bg}
          color={activeCategory.fg}
          borderWidth="1px"
          borderColor={`${activeCategory.tone}.200`}
          onClick={onRemoveCategory}
        >
          {activeCategory.label}
          <LuX size={11} />
        </Flex>
      )}

      {tagFilter.map((name) => {
        const tag = allTags.find((t) => t.name === name);
        return (
          <Flex
            as="button"
            key={name}
            align="center"
            gap={1.5}
            px={2.5}
            py={1}
            rounded="full"
            fontSize="12px"
            fontWeight="600"
            style={
              tag
                ? { backgroundColor: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}44` }
                : { backgroundColor: '#f5f5f5', color: '#555' }
            }
            onClick={() => onRemoveTag(name)}
          >
            #{name}
            <LuX size={11} />
          </Flex>
        );
      })}
    </Flex>
  );
}
