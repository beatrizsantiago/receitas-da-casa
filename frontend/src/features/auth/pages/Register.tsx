import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  Link,
  Text,
  chakra,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuUser, LuMail, LuLock } from 'react-icons/lu';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import smallLogo from '@/assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const data = new FormData(form);
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;
    const confirmPassword = data.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'As senhas não conferem' });
      return;
    }

    setErrors({});

    register({ name, email, password })
      .then(() => navigate('/dashboard'))
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Erro ao criar conta';
        toast.error(Array.isArray(msg) ? msg[0] : msg);
      });
  };

  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement>,
    field: string
  ) => {
    e.preventDefault();
    const input = e.currentTarget;
    let msg = input.validationMessage;
    if (input.validity.valueMissing) {
      if (field === 'name') msg = 'Nome é obrigatório';
      if (field === 'email') msg = 'E-mail é obrigatório';
      if (field === 'password') msg = 'Senha é obrigatória';
      if (field === 'confirmPassword') msg = 'Confirme sua senha';
    }
    if (input.validity.tooShort && field === 'password') {
      msg = 'A senha deve ter no mínimo 8 caracteres';
    }
    if (input.validity.typeMismatch && field === 'email') {
      msg = 'Digite um e-mail válido';
    }
    setErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="beige.100" direction="column" px={4}>
      <Flex direction="column" align="center" mb={6}>
        <Image src={smallLogo} alt="Logo Receitas da Casa" w="180px" mb={2} />
      </Flex>

      <chakra.form
        onSubmit={handleSubmit}
        bg="white"
        rounded="2xl"
        shadow="md"
        p={8}
        w="full"
        maxW="460px"
      >
        <Heading
          size="lg"
          mb={1}
          color="neutral.800"
          fontWeight="700"
          textAlign="center"
        >
          Crie seu caderno
        </Heading>
        <Text color="neutral.500" mb={6} fontSize="sm" textAlign="center">
          Guarde suas receitas de família em um só lugar.
        </Text>

        <Flex direction="column" gap={4}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">Nome</Field.Label>
            <Box position="relative" w="full">
              <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="neutral.400" pointerEvents="none" display="flex" alignItems="center">
                <LuUser size={16} />
              </Box>
              <Input
                name="name"
                placeholder="Seu nome"
                pl="38px"
                borderColor="neutral.200"
                _hover={{ borderColor: 'neutral.300' }}
                _focus={{ borderColor: 'primary.400', boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)' }}
                required
                onInvalid={(e) => handleInvalid(e, 'name')}
                onInput={() => clearError('name')}
              />
            </Box>
            <Field.ErrorText>{errors.name}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">E-mail</Field.Label>
            <Box position="relative" w="full">
              <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="neutral.400" pointerEvents="none" display="flex" alignItems="center">
                <LuMail size={16} />
              </Box>
              <Input
                name="email"
                type="email"
                placeholder="seu@email.com"
                pl="38px"
                borderColor="neutral.200"
                _hover={{ borderColor: 'neutral.300' }}
                _focus={{ borderColor: 'primary.400', boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)' }}
                required
                onInvalid={(e) => handleInvalid(e, 'email')}
                onInput={() => clearError('email')}
              />
            </Box>
            <Field.ErrorText>{errors.email}</Field.ErrorText>
          </Field.Root>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            <Field.Root invalid={!!errors.password}>
              <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">Senha</Field.Label>
              <Box position="relative" w="full">
                <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="neutral.400" pointerEvents="none" display="flex" alignItems="center">
                  <LuLock size={16} />
                </Box>
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  pl="38px"
                  borderColor="neutral.200"
                  _hover={{ borderColor: 'neutral.300' }}
                  _focus={{ borderColor: 'primary.400', boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)' }}
                  required
                  minLength={8}
                  onInvalid={(e) => handleInvalid(e, 'password')}
                  onInput={() => clearError('password')}
                />
              </Box>
              <Field.ErrorText>{errors.password}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.confirmPassword}>
              <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">Confirmar senha</Field.Label>
              <Box position="relative" w="full">
                <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="neutral.400" pointerEvents="none" display="flex" alignItems="center">
                  <LuLock size={16} />
                </Box>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  pl="38px"
                  borderColor="neutral.200"
                  _hover={{ borderColor: 'neutral.300' }}
                  _focus={{ borderColor: 'primary.400', boxShadow: '0 0 0 1px var(--chakra-colors-primary-400)' }}
                  required
                  onInvalid={(e) => handleInvalid(e, 'confirmPassword')}
                  onInput={() => clearError('confirmPassword')}
                />
              </Box>
              <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
            </Field.Root>
          </Grid>

          <Button
            type="submit"
            bg="primary.500"
            color="white"
            loading={isLoading}
            w="full"
            borderRadius="md"
            fontWeight="600"
            fontSize="md"
            py={6}
            mt={2}
            _hover={{ bg: 'primary.600' }}
            _active={{ bg: 'primary.700' }}
          >
            Criar conta
          </Button>
        </Flex>

        <Text textAlign="center" mt={5} color="neutral.500" fontSize="sm">
          Já tem conta?{' '}
          <Link asChild color="primary.500" fontWeight="600" _hover={{ textDecoration: 'underline' }}>
            <RouterLink to="/">Entrar</RouterLink>
          </Link>
        </Text>
      </chakra.form>
    </Flex>
  );
};

export default Register;
