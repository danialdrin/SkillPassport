import React, { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export interface SpaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialName?: string;
  onSave: (name: string) => void;
}

export const SpaceModal: React.FC<SpaceModalProps> = ({
  open,
  onOpenChange,
  mode,
  initialName = '',
  onSave,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'Create New Space' : 'Edit Space Name'}</DialogTitle>
        <DialogDescription>
          {mode === 'create'
            ? 'Organize your materials into dedicated learning spaces.'
            : 'Update the title of your learning space.'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label htmlFor="space-name-input" className="block text-xs font-medium text-ink mb-1.5">
            Space Name
          </label>
          <Input
            id="space-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Machine Learning, Computer Science..."
            autoFocus
            className="bg-paper text-ink"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!name.trim()}
            className="rounded-lg"
          >
            {mode === 'create' ? 'Create Space' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
