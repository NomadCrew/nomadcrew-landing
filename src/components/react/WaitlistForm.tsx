import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Email format validation
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email');
      return;
    }

    if (!email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle non-JSON responses gracefully
      let data;
      try {
        data = await response.json();
      } catch {
        // If response is not JSON, create error object
        data = { error: 'Invalid response from server' };
      }

      if (!response.ok) {
        console.error('Server error:', data);

        // Provide specific error messages for common HTTP status codes
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        }

        throw new Error(data.error || data.message || 'Failed to join waitlist');
      }

      setStatus('success');
      setEmail('');
    } catch (error: any) {
      console.error('Submission error:', error);
      setStatus('error');

      // Provide user-friendly error messages
      let friendlyMessage = error.message || 'Something went wrong. Please try again.';

      // Handle network errors
      if (error.message === 'Failed to fetch') {
        friendlyMessage = 'Network error. Please check your connection and try again.';
      }

      setErrorMessage(friendlyMessage);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 justify-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        disabled={status === 'loading' || status === 'success'}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
      />
      <motion.button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        whileHover={status === 'idle' || status === 'error' ? { scale: 1.05 } : {}}
        whileTap={status === 'idle' || status === 'error' ? { scale: 0.95 } : {}}
        className={`px-8 py-3 rounded-lg font-semibold whitespace-nowrap flex items-center justify-center gap-2 ${
          status === 'success'
            ? 'bg-green-500 text-white'
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        } transition-colors disabled:opacity-50`}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            Joining...
          </>
        ) : status === 'success' ? (
          "You're In"
        ) : status === 'error' ? (
          'Try Again'
        ) : (
          'Get Early Access'
        )}
      </motion.button>
      {errorMessage && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-red-500 w-full text-center"
        >
          {errorMessage}
        </motion.p>
      )}
      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-green-600 w-full text-center"
        >
          Welcome to NomadCrew. You're officially crew. We'll let you know the moment it's ready.
        </motion.p>
      )}
    </motion.form>
  );
}
