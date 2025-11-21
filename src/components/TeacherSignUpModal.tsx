'use client';

import { signIn } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress'; 
import { Autocomplete, Chip, Stack } from '@mui/material';
import { Camera, School } from 'lucide-react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 'auto' },
  maxWidth: 800,
  bgcolor: '#1f2937', // bg-gray-800
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
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [listOfSubjects, setListOfSubjects] = useState<string[]>([]);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textFieldStyles = {
    '& .MuiInputBase-input': { color: '#fff' },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
      '&:hover fieldset': { borderColor: '#fff' },
      '&.Mui-focused fieldset': { borderColor: '#fff' },
    },
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) return '';

    // IMPORTANT: Replace with your Cloudinary details
    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError("Cloudinary configuration is missing. Please check your environment variables.");
      setLoading(false);
      return null;
    }

    const formData = new FormData();
    formData.append('file', profileImageFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || 'Image upload failed. Check Cloudinary credentials.');
      }

      const data = await response.json();
      return data.secure_url; // This is the image link
    } catch (uploadError: any) {
      console.error('Cloudinary Upload Error:', uploadError);
      setError(`Upload Error: ${uploadError.message}`);
      return null;
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    if (!profileImageFile) {
      setError('Profile photo is required.');
      setLoading(false);
      return;
    }

    try {
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

      // Upload image to Cloudinary and get the URL
      let profileImageUrl = '';
      if (profileImageFile) {
        const uploadedUrl = await handleImageUpload();
        if (!uploadedUrl) {
          // Error is already set in handleImageUpload
          setLoading(false);
          return;
        }
        profileImageUrl = uploadedUrl;
      }

      const res = await fetch('/api/auth/teacher-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName, email, mobile, qualification, experiance, listOfSubjects, profileImage: profileImageUrl
        }),
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
        <Box sx={{ p: 4, position: 'relative', width: { xs: '100%', md: 550 }, color: '#fff' }}>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'grey.500' }}><X /></IconButton>
          {step === 'details' && (
            <Box component="form" sx={{ mt: 4 }}>
              <Typography variant="h6" component="h3">Become a Teacher</Typography>
              {error && <Typography color="error" variant="body2">{error}</Typography>}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, mt: 2.5 }}>
                {/* Left side for inputs */}
                <Stack spacing={2.5} sx={{ flex: 1 }}>
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
                </Stack>
                {/* Right side for image */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                  <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} id="profile-image-input" />
                  <label htmlFor="profile-image-input">
                    <Box
                      sx={{
                        width: 140, height: 140, borderRadius: 2, border: '2px dashed rgba(255, 255, 255, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      {!imagePreview && <Camera color="rgba(255, 255, 255, 0.7)" />}
                    </Box>
                  </label>
                  {imagePreview ? (
                    <Button size="small" onClick={handleRemoveImage} sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}>
                      Remove Image
                    </Button>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>Upload Profile Photo</Typography>
                  )}
                </Box>
              </Box>
              <Button variant="contained" onClick={handleVerify} disabled={loading} fullWidth sx={{ mt: 3, bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Get OTP'}
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