'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 'auto' },
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
  borderRadius: 2,
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  overflow: 'hidden',
};

interface TeacherSignInModalProps {
  open: boolean;
  onClose: () => void;
}

const TeacherSignInModal: React.FC<TeacherSignInModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState('details');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const textFieldStyles = {
    '& .MuiInputBase-input': { color: '#fff' },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
      '&:hover fieldset': { borderColor: '#fff' },
      '&.Mui-focused fieldset': { borderColor: '#fff' },
    },
  };

  const handleVerify = async () => {
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

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        otp,
        requiredRole: 'teacher',
      });
      if (result?.error) {
        throw new Error(result.error);
      }
      if (result?.ok) {
        handleClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setError('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="teacher-signin-modal-title">
      <Box sx={style}>
        <Box sx={{ width: { xs: '100%', md: 300 }, p: 4, bgcolor: '#fff', color: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>Tuition-ed</Typography>
          <Typography variant="h5" sx={{ mt: 2 }}>Teacher Login</Typography>
        </Box>
        <Box sx={{ p: 4, position: 'relative', width: { xs: '100%', md: 400 }, bgcolor: '#000', color: '#fff' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}><X /></IconButton>
          {step === 'details' && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
              <Typography variant="h6" component="h3">Enter Your Email</Typography> {error && <Typography color="error" variant="body2">{error}</Typography>}
              <TextField label="Email ID" variant="outlined" fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={textFieldStyles} />
              <Button variant="contained" onClick={handleVerify} disabled={loading} sx={{ mt: 2, bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#eee' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
              </Button>
            </Box>
          )}
          {step === 'otp' && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
              <Typography variant="h6" component="h3">Enter OTP</Typography> {error && <Typography color="error" variant="body2">{error}</Typography>}<Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>An OTP has been sent to {email}.</Typography>
              <TextField
                label="OTP"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={textFieldStyles}
                inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '0.5rem' } }}
              />
              <Button variant="contained" onClick={handleLogin} disabled={loading} sx={{ mt: 2, bgcolor: '#fff', color: '#000', '&:hover': { bgcolor: '#eee' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TeacherSignInModal;