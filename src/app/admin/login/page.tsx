'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState('details');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP.');
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        otp,
        requiredRole: 'admin',
      });

      if (result?.error) {
        // Use the custom error message from the authorize function
        throw new Error(result.error === 'CredentialsSignin' ? 'You are not a verified admin.' : result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={6}
        sx={{ padding: 4, borderRadius: 2, width: '100%', maxWidth: 400 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Admin Login
        </Typography>
        {step === 'details' && (
          <Box component="form" onSubmit={handleVerify} sx={{ mt: 3 }}>
            <Typography variant="h6" align="center">Enter your email</Typography>
            {error && <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>{error}</Typography>}
            <TextField label="Email Address" variant="outlined" fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, py: 1.5 }}>
              {loading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
          </Box>
        )}
        {step === 'otp' && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <Typography variant="h6" align="center">Enter OTP</Typography>
            <Typography variant="body2" align="center" color="text.secondary">An OTP has been sent to {email}.</Typography>
            {error && <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>{error}</Typography>}
            <TextField
              label="One-Time Password"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              required
              inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5rem' } }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 2, py: 1.5 }}>
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
