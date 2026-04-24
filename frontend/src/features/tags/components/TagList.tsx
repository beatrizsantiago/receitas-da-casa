import { Box, Button, Flex, Grid, Text } from '@chakra-ui/react';
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
    <Grid templateColumns={mobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'} gap={2.5}>
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
        >
          <Box
            w="28px"
            h="28px"
            rounded="8px"
            flexShrink={0}
            style={{
              backgroundColor: tag.color,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          />
          <Box flex={1} minW={0}>
            <Text fontSize="14px" fontWeight="600" color="neutral.800">
              #{tag.name}
            </Text>
            <Text fontSize="11px" color="neutral.500" mt={0.5}>
              {countFor(tag.name)} {countFor(tag.name) === 1 ? 'receita' : 'receitas'}
            </Text>
          </Box>
          <Button
            w="32px"
            h="32px"
            minW="32px"
            p={0}
            rounded="8px"
            variant="ghost"
            color="red.500"
            borderWidth="1px"
            borderColor="beige.200"
            onClick={() => onDelete(tag.id)}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <LuTrash2 size={14} />
          </Button>
        </Flex>
      ))}
    </Grid>
  );
}
