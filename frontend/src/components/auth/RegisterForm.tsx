import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { UserPlus, ArrowRight } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2 || name.trim().length > 100) {
      setError('Name must be between 2 and 100 characters.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { registeredEmail: email.trim() } });
      }, 1500);
    } catch (err: unknown) {
      const apiErr = err as { detail?: string };
      setError(apiErr.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-line rounded-sm p-6 sm:p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">Create Student Passport Account</h1>
        <p className="text-xs text-ink-muted leading-relaxed">
          Track your concept mastery, generate verified skill graphs, and uncover prerequisite gaps.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          <span>{error}</span>
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          <span>Account created successfully! Redirecting to login...</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="e.g. Alex Turing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting || success}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="alex@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting || success}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
            Password (min 6 characters)
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting || success}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={submitting || success}
        >
          {submitting ? 'Creating Passport...' : 'Register Account'}
          {!submitting && <UserPlus className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-line text-center text-xs text-ink-muted">
        Already have a student passport account?{' '}
        <Link to="/login" className="font-semibold text-ink hover:underline inline-flex items-center gap-0.5">
          Sign In <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
