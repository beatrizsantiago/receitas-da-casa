import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  Text,
  chakra,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LuMail, LuLock } from 'react-icons/lu';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import smallLogo from '@/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) return;

    const data = new FormData(form);
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    setErrors({});

    login({ email, password })
      .then(() => navigate('/dashboard'))
      .catch(() => toast.error('E-mail ou senha inválidos'));
  };

  const handleInvalid = (
    e: React.InvalidEvent<HTMLInputElement>,
    field: string
  ) => {
    e.preventDefault();
    const input = e.currentTarget;
    let msg = input.validationMessage;
    // Traduz mensagens padrão do HTML5
    if (input.validity.valueMissing) {
      if (field === 'email') msg = 'E-mail é obrigatório';
      if (field === 'password') msg = 'Senha é obrigatória';
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
        <Text
          fontFamily="'Caveat', cursive"
          fontStyle="italic"
          color="neutral.600"
          fontSize="xl"
          mt={2}
          textAlign="center"
          lineHeight="1.3"
        >
          "onde cada receita<br />tem uma história"
        </Text>
      </Flex>

      <chakra.form
        onSubmit={handleSubmit}
        bg="white"
        rounded="2xl"
        shadow="md"
        p={8}
        w="full"
        maxW="380px"
      >
        <Heading size="lg" mb={1} color="neutral.800" fontWeight="700" textAlign="center">
          Bem-vinda de volta
        </Heading>
        <Text color="neutral.500" mb={6} fontSize="sm" textAlign="center">
          Que bom te ver por aqui de novo.
        </Text>

        <Flex direction="column" gap={4}>
          <Field.Root invalid={!!errors.email}>
            <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">
              E-mail
            </Field.Label>
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

          <Field.Root invalid={!!errors.password}>
            <Field.Label fontSize="sm" fontWeight="500" color="neutral.700">
              Senha
            </Field.Label>
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
                onInvalid={(e) => handleInvalid(e, 'password')}
                onInput={() => clearError('password')}
              />
            </Box>
            <Field.ErrorText>{errors.password}</Field.ErrorText>
          </Field.Root>

          <Flex justify="flex-end" mt="-8px">
            <Link
              asChild
              color="neutral.500"
              fontSize="sm"
              textDecoration="underline"
              _hover={{ color: 'primary.500' }}
            >
              <RouterLink to="/esqueci-senha">Esqueci minha senha</RouterLink>
            </Link>
          </Flex>

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
            _hover={{ bg: 'primary.600' }}
            _active={{ bg: 'primary.700' }}
          >
            Entrar
          </Button>
        </Flex>

        <Text textAlign="center" mt={5} color="neutral.500" fontSize="sm">
          Ainda não tem conta?{' '}
          <Link asChild color="primary.500" fontWeight="600" _hover={{ textDecoration: 'underline' }}>
            <RouterLink to="/registro">Criar uma agora</RouterLink>
          </Link>
        </Text>
      </chakra.form>
    </Flex>
  );
};

export default Login;
