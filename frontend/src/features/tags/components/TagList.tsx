import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { LuTrash2 } from 'react-icons/lu';
import type { Tag } from '../types';

interface Props {
  tags: Tag[];
  countFor: (name: string) => number;
  onDelete: (id: number) => void;
  mobile: boolean;
}

export function TagList({ tags, countFor, onDelete, mobile }: Props) {
  if (tags.length === 0) return null;

  return (
    <Grid templateColumns={mobile ? '1fr 1fr' : 'repeat(4, 1fr)'} gap={3}>
      {tags.map((tag) => (
        <Flex
          key={tag.id}
          align="center"
          gap={3}
          p={3.5}
          bg="white"
          rounded="14px"
          borderWidth="1px"
          borderColor="beige.100"
          boxShadow="0 1px 3px rgba(47,30,10,0.05)"
        >
          <Box
            w="32px"
            h="32px"
            rounded="10px"
            flexShrink={0}
            style={{
              backgroundColor: tag.color,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          />
          <Box flex={1} minW={0}>
            <Text
              fontSize="13px"
              fontWeight="600"
              color="neutral.800"
              truncate
            >
              #{tag.name}
            </Text>
            <Text fontSize="11px" color="neutral.400" mt={0.5}>
              {countFor(tag.name)} {countFor(tag.name) === 1 ? 'receita' : 'receitas'}
            </Text>
          </Box>
          <Flex gap={1} flexShrink={0}>
            <Box
              as="button"
              w="28px"
              h="28px"
              rounded="8px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="neutral.400"
              cursor="pointer"
              _hover={{ bg: 'red.50', color: 'red.500' }}
              transition="all 120ms"
              onClick={() => onDelete(tag.id)}
            >
              <LuTrash2 size={13} />
            </Box>
          </Flex>
        </Flex>
      ))}
    </Grid>
  );
}
