import { Button, Dialog, Text } from '@chakra-ui/react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => onOpenChange(e.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>{description}</Text>
          </Dialog.Body>
          <Dialog.Footer gap={2}>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              colorPalette="red"
              loading={loading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <Button variant="ghost" size="sm" position="absolute" top={2} right={2}>
              ✕
            </Button>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
