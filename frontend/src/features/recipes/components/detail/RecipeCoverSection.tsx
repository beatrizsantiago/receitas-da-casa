import { useRef, useState } from 'react';
import { Badge, Box, Button, Flex, Heading, Image } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuCamera, LuChevronLeft, LuMove, LuTrash2 } from 'react-icons/lu';
import type { Recipe } from '../../types';

const CATEGORY_META: Record<string, { label: string; tone: string }> = {
  SWEET: { label: 'Doce', tone: 'primary' },
  SAVORY: { label: 'Salgado', tone: 'secondary' },
};

import { COVER_GRADIENT } from '@/shared/utils/constants';

interface RecipeCoverSectionProps {
  recipe: Recipe;
  onBack: () => void;
  onDeleteClick: () => void;
  onCoverFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  uploading?: boolean;
  onSavePosition: (photoId: number, positionY: number) => Promise<void>;
}

export function RecipeCoverSection({
  recipe,
  onBack,
  onDeleteClick,
  onCoverFileChange,
  coverInputRef,
  uploading,
  onSavePosition,
}: RecipeCoverSectionProps) {
  const mobile = useBreakpointValue({ base: true, md: false });
  const coverPhoto = recipe.photos?.find((p) => p.type === 'COVER');
  const cat = CATEGORY_META[recipe.category];

  const [repositioning, setRepositioning] = useState(false);
  const [previewY, setPreviewY] = useState(50);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startPosY: number } | null>(null);

  function startReposition() {
    setPreviewY(coverPhoto?.positionY ?? 50);
    setRepositioning(true);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startPosY: previewY };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !containerRef.current) return;
    const delta = e.clientY - dragRef.current.startY;
    const h = containerRef.current.clientHeight;
    const newY = Math.round(
      Math.max(0, Math.min(100, dragRef.current.startPosY - (delta / h) * 100)),
    );
    setPreviewY(newY);
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  async function handleSavePosition() {
    if (!coverPhoto) return;
    setSaving(true);
    try {
      await onSavePosition(coverPhoto.id, previewY);
      setRepositioning(false);
    } finally {
      setSaving(false);
    }
  }

  const displayPositionY = repositioning ? previewY : (coverPhoto?.positionY ?? 50);

  return (
    <Box position="relative" ref={containerRef}>
      {coverPhoto ? (
        <Box
          w="full"
          h={mobile ? '220px' : '320px'}
          overflow="hidden"
          onPointerDown={repositioning ? onPointerDown : undefined}
          onPointerMove={repositioning ? onPointerMove : undefined}
          onPointerUp={repositioning ? onPointerUp : undefined}
          cursor={repositioning ? 'grab' : undefined}
          style={repositioning ? { userSelect: 'none' } : undefined}
        >
          <Image
            src={coverPhoto.url}
            alt={recipe.title}
            w="full"
            h="full"
            objectFit="cover"
            objectPosition={`center ${displayPositionY}%`}
            draggable={false}
            pointerEvents="none"
          />
        </Box>
      ) : (
        <Box
          w="full"
          h={mobile ? '220px' : '320px'}
          style={{ background: COVER_GRADIENT }}
        />
      )}

      <Box
        position="absolute"
        inset={0}
        bg="linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)"
        pointerEvents="none"
      />

      <input
        type="file"
        ref={coverInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={onCoverFileChange}
      />

      {repositioning ? (
        <>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="rgba(0,0,0,0.45)"
            color="white"
            fontSize="13px"
            fontWeight="500"
            px={3}
            py={1.5}
            rounded="full"
            pointerEvents="none"
          >
            Arraste para reposicionar
          </Box>
          <Flex
            position="absolute"
            top={4}
            left={mobile ? 4 : 6}
            right={mobile ? 4 : 6}
            justify="flex-end"
            gap={2}
          >
            <Button
              size="sm"
              bg="rgba(255,251,243,0.95)"
              color="neutral.600"
              border="none"
              fontSize="12px"
              fontWeight="600"
              boxShadow="0 2px 8px rgba(0,0,0,0.15)"
              onClick={() => setRepositioning(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              bg="primary.500"
              color="white"
              border="none"
              fontSize="12px"
              fontWeight="600"
              boxShadow="0 2px 8px rgba(196,74,47,0.3)"
              loading={saving}
              onClick={handleSavePosition}
            >
              Salvar posição
            </Button>
          </Flex>
        </>
      ) : (
        <>
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
              minW="40px"
              p={0}
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
                px={3.5}
                py={1.5}
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
                onClick={() => coverInputRef.current?.click()}
              >
                <LuCamera size={14} />
                {!mobile && ' Alterar capa'}
              </Button>
              {coverPhoto && (
                <Button
                  px={3.5}
                  py={1.5}
                  bg="rgba(255,251,243,0.95)"
                  color="neutral.800"
                  border="none"
                  display="inline-flex"
                  alignItems="center"
                  gap={1.5}
                  fontSize="12px"
                  fontWeight="600"
                  boxShadow="0 2px 8px rgba(0,0,0,0.15)"
                  onClick={startReposition}
                >
                  <LuMove size={14} />
                  {!mobile && ' Reposicionar'}
                </Button>
              )}
              <Button
                w="40px"
                minW="40px"
                p={0}
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
        </>
      )}
    </Box>
  );
}
