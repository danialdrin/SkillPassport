import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert } from '../ui/alert';
import { LogIn, ArrowRight } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const registeredEmail = (location.state as { registeredEmail?: string })?.registeredEmail || '';
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const [email, setEmail] = useState(registeredEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { detail?: string };
      setError(apiErr.detail || 'Incorrect email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-line rounded-sm p-6 sm:p-8 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink mb-1">Student Sign In</h1>
        <p className="text-xs text-ink-muted leading-relaxed">
          Access your digital skill passport, learning analytics, and adaptive assessments.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          <span>{error}</span>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={submitting}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          disabled={submitting}
        >
          {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
          {!submitting && <LogIn className="w-4 h-4 ml-2" />}
        </Button>
      </form>

      <div className="mt-6 pt-4 border-t border-line text-center text-xs text-ink-muted">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-semibold text-ink hover:underline inline-flex items-center gap-0.5">
          Register Passport <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
