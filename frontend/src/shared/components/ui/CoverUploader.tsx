import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { LuCamera } from 'react-icons/lu';
import { gradientFromHues } from '@/shared/utils/colors';

interface Props {
  cover: boolean;
  hues: [number, number];
  onChange: (cover: boolean, hues?: [number, number]) => void;
  defaultHues?: [number, number];
}

const HUE_PRESETS: [number, number][] = [
  [18, 35],
  [42, 30],
  [12, 22],
  [45, 55],
  [28, 50],
];

export function CoverUploader({ cover, hues, onChange, defaultHues }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box
        position="relative"
        rounded="16px"
        overflow="hidden"
        border={cover ? 'none' : '1.5px dashed'}
        borderColor={cover ? 'transparent' : 'beige.200'}
      >
        {cover ? (
          <>
            <Box w="full" h="200px" style={{ background: gradientFromHues(hues) }} />
            <Button
              position="absolute"
              top="12px"
              right="12px"
              size="sm"
              rounded="full"
              bg="rgba(255,251,243,0.95)"
              color="neutral.800"
              fontSize="12px"
              fontWeight="600"
              px={3}
              py={1.5}
              h="auto"
              gap={1.5}
              boxShadow="0 2px 8px rgba(0,0,0,0.12)"
              border="none"
              onClick={() => onChange(false, hues)}
            >
              <LuCamera size={14} />
              Trocar
            </Button>
          </>
        ) : (
          <Box
            h="200px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2.5}
            color="neutral.500"
            bg="beige.50"
            cursor="pointer"
            onClick={() => onChange(true, defaultHues ?? [25, 35])}
          >
            <Box display="inline-flex" p={3.5} rounded="full" bg="white" color="primary.500">
              <LuCamera size={24} />
            </Box>
            <Text
              fontFamily="'Fraunces', Georgia, serif"
              fontSize="18px"
              fontWeight="500"
              color="neutral.800"
              letterSpacing="-0.01em"
            >
              Adicionar foto de capa
            </Text>
            <Text fontSize="12px" color="neutral.500">
              Clique para selecionar do seu dispositivo
            </Text>
          </Box>
        )}
      </Box>
      {cover && (
        <Flex align="center" gap={2.5} flexWrap="wrap">
          <Text
            fontSize="11px"
            color="neutral.500"
            fontWeight="600"
            letterSpacing="0.05em"
            textTransform="uppercase"
          >
            Tom
          </Text>
          {HUE_PRESETS.map((h, i) => (
            <button
              key={i}
              onClick={() => onChange(true, h)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border:
                  hues && hues[0] === h[0]
                    ? '2px solid #2F2F2F'
                    : '1px solid rgba(47,47,47,0.10)',
                background: `linear-gradient(135deg, oklch(0.72 0.14 ${h[0]}), oklch(0.52 0.12 ${h[1]}))`,
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
}
