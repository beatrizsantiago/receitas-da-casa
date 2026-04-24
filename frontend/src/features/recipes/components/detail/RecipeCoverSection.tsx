import { Badge, Box, Button, Flex, Heading, Image } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuCamera, LuChevronLeft, LuTrash2 } from 'react-icons/lu';
import { gradientFromHues } from '@/shared/utils/colors';
import type { Recipe } from '../../types';

const CATEGORY_META: Record<string, { label: string; tone: string }> = {
  SWEET: { label: 'Doce', tone: 'primary' },
  SAVORY: { label: 'Salgado', tone: 'secondary' },
};

interface RecipeCoverSectionProps {
  recipe: Recipe;
  onBack: () => void;
  onDeleteClick: () => void;
  onEditCover: () => void;
  onCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  uploading?: boolean;
}

export function RecipeCoverSection({
  recipe,
  onBack,
  onDeleteClick,
  onEditCover,
  onCoverFileChange,
  coverInputRef,
  uploading,
}: RecipeCoverSectionProps) {
  const mobile = useBreakpointValue({ base: true, md: false });
  const coverPhoto = recipe.photos?.find((p) => p.type === 'COVER');
  const cat = CATEGORY_META[recipe.category];

  return (
    <Box position="relative">
      {coverPhoto ? (
        <Image
          src={coverPhoto.url}
          alt={recipe.title}
          w="full"
          h={mobile ? '220px' : '320px'}
          objectFit="cover"
        />
      ) : (
        <Box
          w="full"
          h={mobile ? '220px' : '320px'}
          style={{ background: gradientFromHues(recipe.hues) }}
        />
      )}

      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)"
      />

      <input
        type="file"
        ref={coverInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={onCoverFileChange}
      />

      <Flex
        position="absolute"
        top={4}
        left={mobile ? 4 : 6}
        right={mobile ? 4 : 6}
        justify="space-between"
        align="center"
      >
        <Button
          w="40px"
          h="40px"
          minW="40px"
          p={0}
          rounded="full"
          bg="rgba(255,251,243,0.95)"
          color="neutral.800"
          border="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 2px 8px rgba(0,0,0,0.15)"
          onClick={onBack}
        >
          <LuChevronLeft size={18} />
        </Button>
        <Flex gap={2}>
          <Button
            h="40px"
            px={3.5}
            py={1.5}
            rounded="full"
            bg="rgba(255,251,243,0.95)"
            color="neutral.800"
            border="none"
            display="inline-flex"
            alignItems="center"
            gap={1.5}
            fontSize="12px"
            fontWeight="600"
            boxShadow="0 2px 8px rgba(0,0,0,0.15)"
            loading={uploading}
            onClick={onEditCover}
          >
            <LuCamera size={14} />
            {!mobile && ' Alterar capa'}
          </Button>
<Button
            w="40px"
            h="40px"
            minW="40px"
            p={0}
            rounded="full"
            bg="rgba(255,251,243,0.95)"
            color="red.600"
            border="none"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 2px 8px rgba(0,0,0,0.15)"
            onClick={onDeleteClick}
          >
            <LuTrash2 size={14} />
          </Button>
        </Flex>
      </Flex>

      <Box
        position="absolute"
        bottom={5}
        left={mobile ? 5 : 10}
        right={mobile ? 5 : 10}
      >
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
        <Heading
          fontFamily="'Fraunces', Georgia, serif"
          fontSize={mobile ? '30px' : '42px'}
          fontWeight="500"
          letterSpacing="-0.02em"
          color="white"
          lineHeight={1.05}
          mt={2}
          textShadow="0 2px 4px rgba(0,0,0,0.25)"
        >
          {recipe.title || 'Receita sem título'}
        </Heading>
      </Box>
    </Box>
  );
}
