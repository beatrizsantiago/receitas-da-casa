import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuImages } from 'react-icons/lu';
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

  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="beige.100"
      p={5}
    >
      <Flex justify="space-between" align="flex-end" mb={4} gap={4}>
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
          borderWidth="1.5px"
          borderColor="beige.200"
          bg="transparent"
          rounded="12px"
          onClick={() => galleryInputRef.current?.click()}
          display="inline-flex"
          alignItems="center"
          gap={2}
          fontSize="13px"
          fontWeight="500"
        >
          <LuImages size={14} />
          Adicionar foto
        </Button>
      </Flex>

      <input
        type="file"
        ref={galleryInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={onGalleryFileChange}
      />

      {photos && photos.length > 0 ? (
        <Box
          display="grid"
          gridTemplateColumns={
            mobile
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(160px, 1fr))'
          }
          gap={3}
        >
          {photos.map((photo) => (
            <Box
              key={photo.id}
              rounded="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="beige.200"
              position="relative"
              aspectRatio="1"
            >
              <Image
                src={photo.url}
                alt="Foto da receita"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
          ))}
        </Box>
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
