import { Badge, Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import type { Recipe } from '../../types';
import type { RecipeDrafts, RecipeDraftSetters } from '../../hooks/useRecipeDrafts';
import type { RecipeCategory } from '../../types';

interface RecipeTitleBlockProps {
  recipe: Recipe;
  drafts: RecipeDrafts;
  setters: RecipeDraftSetters;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}

export function RecipeTitleBlock({
  recipe,
  drafts,
  setters,
  onSave,
  onCancel,
}: RecipeTitleBlockProps) {
  const cat =
    recipe.category === 'SWEET'
      ? { label: 'Doce', tone: 'primary' as const }
      : { label: 'Salgado', tone: 'secondary' as const };

  return (
    <EditableBlock
      eyebrow="como essa receita se chama"
      title={recipe.title}
      onSave={onSave}
      onCancel={onCancel}
      editor={
        <Flex direction="column" gap={3.5}>
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={1.5}
              letterSpacing="-0.005em"
            >
              Título
            </Text>
            <Input
              value={drafts.title}
              onChange={(e) => setters.setTitle(e.target.value)}
              placeholder="Ex: Bolo de fubá da vovó"
              bg="white"
              fontSize="15px"
              px={3.5}
            />
          </Box>
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={1.5}
              letterSpacing="-0.005em"
            >
              Descrição
            </Text>
            <Textarea
              value={drafts.description}
              onChange={(e) => setters.setDescription(e.target.value)}
              rows={3}
              bg="white"
              fontSize="15px"
              px={3.5}
              py={3}
              resize="vertical"
              lineHeight={1.5}
              placeholder="Conte a história dessa receita..."
            />
          </Box>
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={2}
              letterSpacing="-0.005em"
            >
              Categoria
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {[
                { id: 'SAVORY' as RecipeCategory, label: 'Salgado' },
                { id: 'SWEET' as RecipeCategory, label: 'Doce' },
              ].map((c) => (
                <Button
                  key={c.id}
                  size="sm"
                  fontSize="12px"
                  fontWeight="550"
                  px={3}
                  py={1.5}
                  onClick={() => setters.setCategory(c.id)}
                  bg={drafts.category === c.id ? 'neutral.800' : 'transparent'}
                  color={drafts.category === c.id ? 'beige.50' : 'neutral.500'}
                  borderWidth="1px"
                  borderColor={
                    drafts.category === c.id ? 'transparent' : 'beige.200'
                  }
                  _hover={{
                    bg: drafts.category === c.id ? 'neutral.800' : 'beige.50',
                  }}
                >
                  {c.label}
                </Button>
              ))}
            </Flex>
          </Box>
        </Flex>
      }
    >
      <Flex direction="column" gap={2.5}>
        <Flex align="center" gap={2.5} flexWrap="wrap">
          <Badge
            bg={cat.tone === 'primary' ? 'primary.50' : 'secondary.50'}
            color={cat.tone === 'primary' ? 'primary.800' : 'secondary.800'}
            px={2}
            py={0.5}
            rounded="md"
            fontSize="xs"
            fontWeight="500"
          >
            {cat.label}
          </Badge>
        </Flex>
        <Text fontSize="14px" color="neutral.600" lineHeight={1.65}>
          {recipe.description || (
            <Text as="span" color="neutral.400" fontStyle="italic">
              Nenhuma descrição ainda.
            </Text>
          )}
        </Text>
      </Flex>
    </EditableBlock>
  );
}
