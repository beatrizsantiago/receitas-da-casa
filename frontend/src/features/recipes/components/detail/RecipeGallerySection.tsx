import { useState } from 'react';
import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuImages } from 'react-icons/lu';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import type { Photo } from '../../types';

interface RecipeGallerySectionProps {
  photos: Photo[] | undefined;
  onGalleryFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  galleryInputRef: React.RefObject<HTMLInputElement | null>;
  recipeId: number;
}

export function RecipeGallerySection({
  photos,
  onGalleryFileChange,
  galleryInputRef,
}: RecipeGallerySectionProps) {
  const mobile = useBreakpointValue({ base: true, md: false });
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const slides = photos?.map((p) => ({ src: p.url })) ?? [];

  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="beige.100"
      p={5}
    >
      <Box
        display="flex"
        flexDirection={mobile ? 'column' : 'row'}
        justifyContent="space-between"
        gap={mobile ? 3 : 2}
        mb={4}
      >
        <Box>
          <Text
            fontFamily="'Caveat', cursive"
            fontSize="18px"
            color="primary.500"
            lineHeight={1}
            mb={2}
          >
            lembranças
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize="22px"
            fontWeight="500"
            color="neutral.800"
            letterSpacing="-0.015em"
            lineHeight={1.15}
          >
            Fotos da receita
          </Heading>
        </Box>
        <Button
          size="sm"
          variant="outline"
          color="neutral.500"
          borderStyle="dashed"
          borderColor="beige.200"
          bg="transparent"
          w={mobile ? 'full' : 'auto'}
          justifyContent={mobile ? 'center' : 'flex-start'}
          onClick={() => galleryInputRef.current?.click()}
          display="inline-flex"
          alignItems="center"
          gap={2}
          fontSize="13px"
          fontWeight="500"
          _hover={{ bg: 'beige.50' }}
        >
          <LuImages size={14} />
          Adicionar foto
        </Button>
      </Box>

      <input
        type="file"
        ref={galleryInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={onGalleryFileChange}
      />

      {slides.length > 0 ? (
        <>
          <Box
            display="grid"
            gridTemplateColumns={
              mobile
                ? 'repeat(2, 1fr)'
                : 'repeat(auto-fill, minmax(160px, 1fr))'
            }
            gap={3}
          >
            {slides.map((slide, i) => (
              <Box
                key={i}
                rounded="lg"
                overflow="hidden"
                borderWidth="1px"
                borderColor="beige.200"
                position="relative"
                aspectRatio="1"
                cursor="pointer"
                onClick={() => setLightboxIndex(i)}
                _hover={{ opacity: 0.88 }}
                transition="opacity 150ms"
              >
                <Image
                  src={slide.src}
                  alt="Foto da receita"
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Box>

          <Lightbox
            open={lightboxIndex >= 0}
            index={lightboxIndex}
            close={() => setLightboxIndex(-1)}
            slides={slides}
            plugins={[Zoom]}
            carousel={{ finite: slides.length <= 1 }}
          />
        </>
      ) : (
        <Box
          textAlign="center"
          p={6}
          bg="beige.50"
          border="1.5px dashed"
          borderColor="beige.200"
          rounded="16px"
        >
          <Text fontSize="13px" color="neutral.500">
            Nenhuma foto na galeria ainda.
          </Text>
        </Box>
      )}
    </Box>
  );
}
