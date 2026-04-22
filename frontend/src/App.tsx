import { ChakraProvider, Toaster, Toast } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import { toaster } from './components/ui/toaster';
import { system } from './theme';
import { router } from './routes';

export default function App() {
  return (
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
  );
}
