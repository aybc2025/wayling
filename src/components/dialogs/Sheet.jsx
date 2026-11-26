import * as Dialog from '@radix-ui/react-dialog';

/** Shared centred sheet. Radix owns focus trap, Escape, scroll lock and aria wiring. */
export default function Sheet({ open, onOpenChange, title, description, children, dismissible = true }) {
  return (
    <Dialog.Root open={open} onOpenChange={dismissible ? onOpenChange : undefined}>
      <Dialog.Portal>
        <Dialog.Overlay className="dim fixed inset-0 z-40" />
        <Dialog.Content
          onEscapeKeyDown={(e) => { if (!dismissible) e.preventDefault(); }}
          onPointerDownOutside={(e) => { if (!dismissible) e.preventDefault(); }}
          onInteractOutside={(e) => { if (!dismissible) e.preventDefault(); }}
          className="sheet panel fixed inset-x-0 top-1/2 z-50 mx-auto max-h-[90vh] w-[min(92vw,380px)] -translate-y-1/2 overflow-y-auto p-5 shadow-overlay">
          <Dialog.Title className="font-display text-title text-chalk">{title}</Dialog.Title>
          {description ? <Dialog.Description className="mt-1 text-meta text-dust">{description}</Dialog.Description>
            : <Dialog.Description className="sr-only">{title}</Dialog.Description>}
          <div className="mt-4 flex flex-col gap-3">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
