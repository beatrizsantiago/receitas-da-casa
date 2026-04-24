import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuCheck, LuChevronLeft } from 'react-icons/lu';
import { useCreateRecipeMutation } from '../hooks/useRecipes';
import { CoverUploader } from '@/shared/components/ui/CoverUploader';
import { randomHues } from '@/shared/utils/colors';
import { toaster } from '@/shared/components/ui/toaster';
import type { RecipeCategory } from '../types';

export default function RecipeCreate() {
  const navigate = useNavigate();
  const mobile = useBreakpointValue({ base: true, md: false });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('SAVORY');
  const [cover, setCover] = useState(false);
  const [hues, setHues] = useState<[number, number]>([25, 35]);
  const [defaultHues] = useState<[number, number]>(() => randomHues());

  const createRecipe = useCreateRecipeMutation();
  const canSave = title.trim().length > 0;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!canSave) return;

    try {
      const created = await createRecipe.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
      });
      toaster.create({ title: 'Receita criada!', type: 'success' });
      navigate(`/receitas/${created.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Erro ao criar receita';
      toaster.create({
        title: Array.isArray(msg) ? msg[0] : msg,
        type: 'error',
      });
    }
  };

  return (
    <Box
      minH="100vh"
      bg="beige.100"
      py={mobile ? 0 : 10}
      px={mobile ? 0 : 6}
      display="flex"
      flexDirection="column"
      alignItems={mobile ? 'stretch' : 'center'}
    >
      <Box
        w="full"
        maxW={mobile ? 'none' : '660px'}
        bg="white"
        rounded={mobile ? '0' : '24px'}
        borderWidth={mobile ? '0' : '1px'}
        borderColor="beige.200"
        boxShadow={mobile ? 'none' : '0 4px 28px rgba(47,30,10,0.09)'}
        minH={mobile ? '100vh' : 'auto'}
        pb={mobile ? 24 : 0}
        overflow="hidden"
      >
        {/* Header */}
        <Flex
          px={mobile ? 5 : 6}
          py={mobile ? 4 : 5}
          borderBottomWidth="1px"
          borderColor="beige.100"
          align="center"
          gap={3.5}
        >
          <Button
            w="38px"
            h="38px"
            minW="38px"
            p={0}
            rounded="full"
            variant="outline"
            borderColor="beige.200"
            bg="white"
            color="neutral.800"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => navigate('/receitas')}
          >
            <LuChevronLeft size={18} />
          </Button>
          <Box flex={1} minW={0}>
            <Text
              fontFamily="'Caveat', cursive"
              fontSize="15px"
              color="secondary.600"
              lineHeight={1}
            >
              começar do começo
            </Text>
            <Heading
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={mobile ? '22px' : '26px'}
              fontWeight="500"
              color="neutral.800"
              letterSpacing="-0.015em"
              mt={0.5}
            >
              Nova receita
            </Heading>
          </Box>
        </Flex>

        {/* Form */}
        <Box
          px={mobile ? 5 : 6}
          py={mobile ? 5 : 6}
          display="flex"
          flexDirection="column"
          gap={5}
          as="form"
          onSubmit={submit}
        >
          {/* Foto de capa */}
          <Box>
            <Text
              fontSize="11px"
              fontWeight="600"
              color="neutral.500"
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb={2}
            >
              Foto de capa
            </Text>
            <CoverUploader
              cover={cover}
              hues={hues}
              defaultHues={defaultHues}
              onChange={(c, h) => {
                setCover(c);
                if (h) setHues(h);
              }}
            />
          </Box>

          {/* Título */}
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={1.5}
              letterSpacing="-0.005em"
            >
              Título
            </Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Bolo de chocolate"
              autoFocus
              h="48px"
              rounded="12px"
              borderColor="beige.200"
              bg="beige.50"
              fontSize="15px"
              px={3.5}
              _focus={{ borderColor: 'primary.300', boxShadow: 'none', bg: 'white' }}
            />
          </Box>

          {/* Descrição */}
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={1.5}
              letterSpacing="-0.005em"
            >
              Descrição{' '}
              <Box as="span" fontWeight="400" color="neutral.400">
                (opcional)
              </Box>
            </Text>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Receita da vovó, sempre um sucesso!"
              rows={3}
              rounded="12px"
              borderColor="beige.200"
              bg="beige.50"
              fontSize="15px"
              px={3.5}
              py={3}
              resize="vertical"
              lineHeight={1.5}
              _focus={{ borderColor: 'primary.300', boxShadow: 'none', bg: 'white' }}
            />
          </Box>

          {/* Categoria */}
          <Box>
            <Text
              fontSize="13px"
              fontWeight="550"
              color="neutral.600"
              mb={2}
              letterSpacing="-0.005em"
            >
              Categoria
            </Text>
            <Flex gap={2}>
              {[
                { id: 'SAVORY' as RecipeCategory, label: 'Salgado', tone: 'secondary' },
                { id: 'SWEET' as RecipeCategory, label: 'Doce', tone: 'primary' },
              ].map((c) => {
                const active = category === c.id;
                const isPrimary = c.tone === 'primary';
                return (
                  <Button
                    key={c.id}
                    size="sm"
                    rounded="999px"
                    fontSize="13px"
                    fontWeight="550"
                    px={4}
                    h="32px"
                    onClick={() => setCategory(c.id)}
                    bg={
                      active
                        ? isPrimary
                          ? 'primary.500'
                          : 'secondary.500'
                        : 'beige.50'
                    }
                    color={active ? 'white' : 'neutral.500'}
                    borderWidth="1px"
                    borderColor={
                      active
                        ? 'transparent'
                        : 'beige.200'
                    }
                    boxShadow={active ? (isPrimary ? '0 3px 10px rgba(196,74,47,0.25)' : '0 3px 10px rgba(90,110,60,0.2)') : 'none'}
                    _hover={{
                      bg: active
                        ? isPrimary ? 'primary.600' : 'secondary.600'
                        : 'beige.100',
                    }}
                  >
                    {c.label}
                  </Button>
                );
              })}
            </Flex>
          </Box>

          {/* Footer actions */}
          <Flex
            gap={2.5}
            justifyContent="flex-end"
            mt={2}
            pt={4.5}
            borderTopWidth="1px"
            borderColor="beige.100"
            flexDirection={mobile ? 'column-reverse' : 'row'}
          >
            <Button
              type="button"
              variant="ghost"
              size="lg"
              w={mobile ? 'full' : 'auto'}
              fontWeight="550"
              fontSize="15px"
              rounded="14px"
              h="52px"
              color="neutral.500"
              onClick={() => navigate('/receitas')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              bg="primary.500"
              color="white"
              size="lg"
              w={mobile ? 'full' : 'auto'}
              fontWeight="550"
              fontSize="15px"
              rounded="14px"
              h="52px"
              loading={createRecipe.isPending}
              disabled={!canSave}
              opacity={canSave ? 1 : 0.5}
              display="inline-flex"
              alignItems="center"
              gap={2}
              boxShadow="0 6px 14px rgba(196,74,47,0.25)"
              _hover={{ bg: canSave ? 'primary.600' : 'primary.500' }}
            >
              <LuCheck size={16} />
              Criar receita
            </Button>
          </Flex>
        </Box>
      </Box>

      {!mobile && (
        <Text
          fontSize="12px"
          color="neutral.400"
          textAlign="center"
          mt={4}
          maxW="660px"
        >
          Ingredientes, modo de preparo e anotações você adiciona depois, bloco por bloco.
        </Text>
      )}
    </Box>
  );
}
