import { ChakraProvider, Toaster, Toast } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toaster } from '@/shared/components/ui/toaster';
import { system } from './theme';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <Toaster toaster={toaster}>
          {(toast) => (
            <Toast.Root key={toast.id}>
              <Toast.Title>{toast.title}</Toast.Title>
              <Toast.Description>{toast.description}</Toast.Description>
              <Toast.CloseTrigger />
            </Toast.Root>
          )}
        </Toaster>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
