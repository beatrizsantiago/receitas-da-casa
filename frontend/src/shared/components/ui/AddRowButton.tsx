import { Button, type ButtonProps } from '@chakra-ui/react';

export function AddRowButton({
  color = 'neutral.500',
  borderColor = 'beige.200',
  fontSize = '13px',
  hoverBg = 'beige.50',
  children,
  ...rest
}: ButtonProps & { hoverBg?: string }) {
  return (
    <Button
      w="full"
      variant="outline"
      borderStyle="dashed"
      borderColor={borderColor}
      color={color}
      fontSize={fontSize}
      fontWeight="500"
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      bg="transparent"
      _hover={{ bg: hoverBg }}
      {...rest}
    >
      {children}
    </Button>
  );
}
