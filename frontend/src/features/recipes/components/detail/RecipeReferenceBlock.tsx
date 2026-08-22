import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import { FaInstagram, FaYoutube } from 'react-icons/fa6';
import { LuLink, LuSquareArrowOutUpRight, LuX } from 'react-icons/lu';
import { EditableBlock } from '@/shared/components/ui/EditableBlock';
import { EmptyHint } from '@/shared/components/ui/EmptyHint';
import { FieldLabel } from '@/shared/components/ui/FieldLabel';
import { IconInput } from '@/shared/components/ui/IconInput';
import type { RecipeDrafts, RecipeDraftSetters } from '../../hooks/useRecipeDrafts';
import type { Recipe } from '../../types';

interface RecipeReferenceBlockProps {
  recipe: Recipe;
  drafts: RecipeDrafts;
  setters: RecipeDraftSetters;
  onSave: () => void | Promise<void>;
  onCancel: () => void;
}

type Platform = 'youtube' | 'instagram' | 'other';

function detectPlatform(url: string): Platform {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') {
      return 'youtube';
    }
    if (host === 'instagram.com') return 'instagram';
    return 'other';
  } catch {
    return 'other';
  }
}

const PLATFORM_META: Record<
  Platform,
  { icon: React.ReactNode; label: string; color: string }
> = {
  youtube: { icon: <FaYoutube size={18} />, label: 'Assistir no YouTube', color: '#FF0000' },
  instagram: { icon: <FaInstagram size={18} />, label: 'Ver no Instagram', color: '#C13584' },
  other: { icon: <LuLink size={18} />, label: 'Abrir referência', color: 'var(--chakra-colors-primary-500)' },
};

export function RecipeReferenceBlock({
  recipe,
  drafts,
  setters,
  onSave,
  onCancel,
}: RecipeReferenceBlockProps) {
  const reference = recipe.reference?.trim();
  const platform = reference ? detectPlatform(reference) : 'other';
  const meta = PLATFORM_META[platform];

  return (
    <EditableBlock
      eyebrow="de onde veio a inspiração"
      title="Referência"
      onSave={onSave}
      onCancel={onCancel}
      editor={
        <Box>
          <FieldLabel>Link</FieldLabel>
          <IconInput
            icon={<LuLink size={16} />}
            value={drafts.reference}
            onChange={(e) => setters.setReference(e.target.value)}
            placeholder="Cole aqui o link do YouTube, Instagram ou de um site"
            type="url"
            bg="white"
            fontSize="15px"
            rightElement={
              drafts.reference ? (
                <chakra.button
                  type="button"
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={1}
                  color="neutral.400"
                  display="flex"
                  alignItems="center"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  p={0}
                  _hover={{ color: 'neutral.600' }}
                  onClick={() => setters.setReference('')}
                  aria-label="Limpar referência"
                >
                  <LuX size={16} />
                </chakra.button>
              ) : undefined
            }
          />
          <Text fontSize="12px" color="neutral.400" mt={1.5}>
            Apenas um link. Deixe em branco para remover a referência.
          </Text>
        </Box>
      }
    >
      {reference ? (
        <Flex
          asChild
          align="center"
          gap={3}
          bg="beige.50"
          borderWidth="1px"
          borderColor="beige.200"
          rounded="12px"
          p={3.5}
          transition="background 140ms, border-color 140ms"
          _hover={{ bg: 'beige.100', borderColor: 'beige.300' }}
        >
          <a href={reference} target="_blank" rel="noopener noreferrer">
            <Flex
              align="center"
              justify="center"
              w="36px"
              h="36px"
              rounded="10px"
              bg="white"
              borderWidth="1px"
              borderColor="beige.200"
              color={meta.color}
              flexShrink={0}
            >
              {meta.icon}
            </Flex>
            <Box minW={0} flex={1}>
              <Text fontSize="14px" fontWeight="550" color="neutral.800">
                {meta.label}
              </Text>
              <Text fontSize="12px" color="neutral.400" truncate>
                {reference}
              </Text>
            </Box>
            <Box color="neutral.400" flexShrink={0}>
              <LuSquareArrowOutUpRight size={16} />
            </Box>
          </a>
        </Flex>
      ) : (
        <EmptyHint>Nenhuma referência ainda.</EmptyHint>
      )}
    </EditableBlock>
  );
}
