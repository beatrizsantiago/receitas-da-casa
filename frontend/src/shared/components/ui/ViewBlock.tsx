import { Box, Heading, Text } from '@chakra-ui/react';

interface Props {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}

export function ViewBlock({ eyebrow, title, children }: Props) {
  return (
    <Box
      bg="white"
      rounded="16px"
      borderWidth="1px"
      borderColor="beige.100"
      boxShadow="0 1px 2px rgba(47,30,10,0.03)"
      p={5}
    >
      <Box mb={3.5}>
        {eyebrow && (
          <Text
            fontFamily="'Caveat', cursive"
            fontSize="18px"
            color="primary.500"
            lineHeight={1}
            mb={2}
          >
            {eyebrow}
          </Text>
        )}
        <Heading
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="22px"
          fontWeight="500"
          color="neutral.800"
          letterSpacing="-0.015em"
          lineHeight={1.15}
        >
          {title}
        </Heading>
      </Box>
      {children}
    </Box>
  );
}
