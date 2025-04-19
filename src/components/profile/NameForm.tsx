import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import { FormField } from '../shared/FormField';
import { Button } from '../shared/Button';

interface NameFormProps {
  initialName: string;
  onSubmit: (name: string) => Promise<void>;
}

export function NameForm({ initialName, onSubmit }: NameFormProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(name);
    } catch (err) {
      setError('Failed to update name');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User className="w-5 h-5" />}
        placeholder="Enter your name"
        error={error}
        required
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={loading}
          icon={<Save className="w-4 h-4" />}
        >
          {loading ? 'Updating...' : 'Update Name'}
        </Button>
      </div>
    </form>
  );
}