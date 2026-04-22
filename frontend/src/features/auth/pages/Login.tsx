import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toaster } from '../../../components/ui/toaster';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email é obrigatório';
    if (!password) errs.password = 'Senha é obrigatória';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch {
      toaster.create({ title: 'Email ou senha inválidos', type: 'error' });
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="beige.100">
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        rounded="2xl"
        shadow="md"
        p={8}
        w="full"
        maxW="400px"
      >
        <Heading size="xl" mb={1} color="primary.600">Receitas da Casa</Heading>
        <Text color="neutral.500" mb={6}>Faça login para continuar</Text>

        <Flex direction="column" gap={4}>
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Senha</Field.Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" colorPalette="primary" loading={isLoading} w="full" mt={2}>
            Entrar
          </Button>
        </Flex>

        <Text textAlign="center" mt={4} color="neutral.500" fontSize="sm">
          Não tem conta?{' '}
          <Link asChild color="primary.500" fontWeight="medium">
            <RouterLink to="/registro">Cadastre-se</RouterLink>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
