import { Badge, Box, Button, Flex, Input, Switch, Text, Textarea } from '@chakra-ui/react';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { FieldLabel } from '@/shared/components/ui/FieldLabel';
import { CATEGORY_META } from '@/shared';
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
  const cat = CATEGORY_META[recipe.category];

  return (
    <EditableBlock
      eyebrow="como essa receita se chama"
      title={recipe.title}
      onSave={onSave}
      onCancel={onCancel}
      editor={
        <Flex direction="column" gap={3.5}>
          <Box>
            <FieldLabel>Título</FieldLabel>
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
            <FieldLabel>Descrição</FieldLabel>
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
            <FieldLabel mb={2}>Categoria</FieldLabel>
            <Flex gap={2} flexWrap="wrap">
              {[
                { id: 'SAVORY' as RecipeCategory, label: 'Salgada' },
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
          <Box>
            <FieldLabel mb={2}>Visibilidade</FieldLabel>
            <Switch.Root
              checked={drafts.isPublic}
              onCheckedChange={(e) => setters.setIsPublic(e.checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label fontSize="14px" color="neutral.600">
                {drafts.isPublic ? 'Pública' : 'Privada'}
              </Switch.Label>
            </Switch.Root>
            <Text fontSize="12px" color="neutral.400" mt={1}>
              Receitas públicas aparecem no link compartilhável.
            </Text>
          </Box>
        </Flex>
      }
    >
      <Flex direction="column" gap={2.5}>
        <Flex align="center" gap={2.5} flexWrap="wrap">
          <Badge
            bg={cat?.bg}
            color={cat?.fg}
            px={2}
            py={0.5}
            rounded="md"
            fontSize="xs"
            fontWeight="500"
          >
            {cat.label}
          </Badge>
          <Badge
            bg={recipe.isPublic ? 'red.100' : 'neutral.100'}
            color={recipe.isPublic ? 'red.700' : 'neutral.500'}
            px={2}
            py={0.5}
            rounded="md"
            fontSize="xs"
            fontWeight="500"
          >
            {recipe.isPublic ? 'Pública' : 'Privada'}
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
