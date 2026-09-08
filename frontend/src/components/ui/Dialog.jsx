import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
  size = 'sm',
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
      <div className="space-y-4">
        {(description || message) && (
          <p className="text-xs text-slate-300 leading-relaxed">{description || message}</p>
        )}
        {children}
        {onConfirm && (
          <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant}
              size="sm"
              onClick={onConfirm}
              isLoading={loading}
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Dialog;
