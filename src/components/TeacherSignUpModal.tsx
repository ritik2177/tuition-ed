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
import { Autocomplete, Chip, Stack } from '@mui/material';
import { School } from 'lucide-react';

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

interface TeacherSignUpModalProps {
  open: boolean;
  onClose: () => void;
}

const TeacherSignUpModal: React.FC<TeacherSignUpModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState('details');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [qualification, setQualification] = useState('');
  const [experiance, setExperiance] = useState('');
  const [listOfSubjects, setListOfSubjects] = useState<string[]>([]);
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
      // First, check if the user already exists and what their role is.
      const roleCheckRes = await fetch('/api/auth/check-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!roleCheckRes.ok) {
        throw new Error('Failed to check user status.');
      }

      const { role } = await roleCheckRes.json();

      if (role === 'teacher') {
        throw new Error('You are already registered as a teacher. Please log in instead.');
      }

      const res = await fetch('/api/auth/teacher-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, mobile, qualification, experiance, listOfSubjects }),
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

  const handleSignUp = async () => {
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
    <Modal open={open} onClose={handleClose} aria-labelledby="teacher-signup-modal-title">
      <Box sx={style}>
        <Box sx={{ width: { xs: '100%', md: 300 }, p: 4, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <School size={64} />
          <Typography variant="h5" component="h2" sx={{ mt: 2, fontWeight: 'bold' }}>
            Join Our Team
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Share your knowledge and inspire the next generation of learners.
          </Typography>
        </Box>
        <Box sx={{ p: 4, position: 'relative', width: { xs: '100%', md: 450 }, bgcolor: '#1f2937', color: '#fff' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500' }}><X /></IconButton>
          {step === 'details' && (
            <Stack component="form" spacing={2.5} sx={{ mt: 4 }}>
              <Typography variant="h6" component="h3">Become a Teacher</Typography>
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <TextField label="Full Name" variant="outlined" fullWidth required value={fullName} onChange={(e) => setFullName(e.target.value)} sx={textFieldStyles} />
              <TextField label="Email ID" variant="outlined" fullWidth required type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={textFieldStyles} />
              <TextField label="Mobile Number" variant="outlined" fullWidth type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} sx={textFieldStyles} />
              <TextField label="Highest Qualification" variant="outlined" fullWidth value={qualification} onChange={(e) => setQualification(e.target.value)} sx={textFieldStyles} />
              <TextField label="Years of Experience" variant="outlined" fullWidth value={experiance} onChange={(e) => setExperiance(e.target.value)} sx={textFieldStyles} />
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={listOfSubjects}
                onChange={(event, newValue) => {
                  setListOfSubjects(newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Subjects You Teach" placeholder="Type a subject and press Enter" sx={textFieldStyles} />
                )}
              />
              <Button variant="contained" onClick={handleVerify} disabled={loading} sx={{ mt: 2, bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Get OTP'}
              </Button>
            </Stack>
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
              <Button variant="contained" onClick={handleSignUp} disabled={loading} sx={{ mt: 2, bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default TeacherSignUpModal;