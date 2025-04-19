import React, { useState } from 'react';
import { Loader2, Coins } from 'lucide-react';
import { Card } from '../shared/Card';
import { FormField } from '../shared/FormField';
import { Button } from '../shared/Button';

interface RequestFormProps {
  minAmount: number;
  onSubmit: (amount: number) => Promise<void>;
}

export function RequestForm({ minAmount, onSubmit }: RequestFormProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    const tokenAmount = parseInt(amount);
    if (isNaN(tokenAmount) || tokenAmount < minAmount) {
      setError(`Minimum request amount is ${minAmount} tokens`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(tokenAmount);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Request Tokens"
      description="Submit a new token request to admin"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <FormField
            type="number"
            label="Token Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={minAmount}
            placeholder={`Enter amount (min. ${minAmount})`}
            error={error}
            icon={<Coins className="w-5 h-5" />}
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Minimum request amount: {minAmount} tokens</span>
            <br />
            Requests are subject to admin approval.
          </p>
        </div>

        <Button
          type="submit"
          loading={loading}
          icon={<Coins className="w-5 h-5" />}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Submit Request'}
        </Button>
      </form>
    </Card>
  );
}