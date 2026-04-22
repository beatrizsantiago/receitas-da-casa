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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toaster } from '../../../components/ui/toaster';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Nome é obrigatório';
    if (!email) errs.email = 'Email é obrigatório';
    if (password.length < 6) errs.password = 'Senha deve ter no mínimo 6 caracteres';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Erro ao criar conta';
      toaster.create({ title: Array.isArray(msg) ? msg[0] : msg, type: 'error' });
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
        <Text color="neutral.500" mb={6}>Crie sua conta</Text>

        <Flex direction="column" gap={4}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label>Nome</Field.Label>
            <Input
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field.ErrorText>{errors.name}</Field.ErrorText>
          </Field.Root>

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Button type="submit" colorPalette="primary" loading={isLoading} w="full" mt={2}>
            Criar conta
          </Button>
        </Flex>

        <Text textAlign="center" mt={4} color="neutral.500" fontSize="sm">
          Já tem conta?{' '}
          <Link asChild color="primary.500" fontWeight="medium">
            <RouterLink to="/login">Entrar</RouterLink>
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
