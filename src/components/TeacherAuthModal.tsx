'use client';

import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { X } from 'lucide-react';
import { useUI } from '@/provider/UIProvider';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', md: 'auto' },
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: 'center',
};

interface TeacherAuthModalProps {
  open: boolean;
  onClose: () => void;
}

const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({ open, onClose }) => {
  const { switchModal } = useUI();

  const handleSignInClick = () => {
    switchModal('teacherSignin');
  };

  const handleSignUpClick = () => {
    switchModal('teacherSignup');
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="teacher-auth-modal-title">
      <Box sx={style}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <X />
        </IconButton>
        <Typography id="teacher-auth-modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          Join as a Teacher
        </Typography>
        
        <Box sx={{ my: 4, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Already a teacher with us?
          </Typography>
          <Button variant="outlined" onClick={handleSignInClick}>
            Login as Teacher
          </Button>
        </Box>

        <Box sx={{ p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Congratulations on your decision to become a teacher!
          </Typography>
          <Button variant="contained" onClick={handleSignUpClick}>
            Register as a New Teacher
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TeacherAuthModal;