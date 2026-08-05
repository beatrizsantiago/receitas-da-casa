import { Text, type TextProps } from '@chakra-ui/react';

export function FieldLabel({ mb = 1.5, children, ...rest }: TextProps) {
  return (
    <Text
      fontSize="13px"
      fontWeight="550"
      color="neutral.600"
      letterSpacing="-0.005em"
      mb={mb}
      {...rest}
    >
      {children}
    </Text>
  );
}
