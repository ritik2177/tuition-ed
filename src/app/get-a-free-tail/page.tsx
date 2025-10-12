"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const steps = ["Academic Details", "Schedule Demo"];

export default function FreeTrialPage() {
  const { data: session } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        studentName: session.user.fullName || '',
        email: session.user.email || '',
        mobile: session.user.mobile || '',
        studentId: session.user.id || '',
      }));
    }
  }, [session]);

  const handleNext = () => {
    setError(''); // Clear errors on step change
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleReset = () => {
    setActiveStep(0);
    setFormData({});
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/demoClass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Something went wrong.');
      handleNext(); // Move to the success screen
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
            <TextField name="grade" label="Grade / Class" required value={formData.grade || ""} onChange={handleChange} size="small" />
            <FormControl component="fieldset">
              <FormLabel sx={{ color: 'text.secondary' }}>Subject / Course</FormLabel>
              <RadioGroup
                row
                name="subject"
                value={formData.subject || ""}
                onChange={handleChange}
              >
                <FormControlLabel value="math" control={<Radio />} label="Maths" />
                <FormControlLabel value="science" control={<Radio />} label="Science" />
                <FormControlLabel value="english" control={<Radio />} label="English" />
                <FormControlLabel value="physics" control={<Radio />} label="Physics" />
                <FormControlLabel value="chemistry" control={<Radio />} label="Chemistry" />
                <FormControlLabel value="biology" control={<Radio />} label="Biology" />
                <FormControlLabel value="history" control={<Radio />} label="History" />
                <FormControlLabel value="coding" control={<Radio />} label="Coding" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
            {formData.subject === 'other' && (
              <TextField name="otherSubject" label="Please specify subject" value={formData.otherSubject || ""} onChange={handleChange} size="small" />
            )}
            <TextField name="demoTopic" label="Specific Demo Topic (Optional)" value={formData.demoTopic || ""} onChange={handleChange} size="small" />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
            <TextField name="parentName" label="Parent's Name" required value={formData.parentName || ""} onChange={handleChange} size="small" />
            <TextField name="city" label="City" required value={formData.city || ""} onChange={handleChange} size="small" />
            <TextField name="country" label="Country" required value={formData.country || ""} onChange={handleChange} size="small" />
            <TextField
              name="demoTime"
              label="Preferred Demo Class Time"
              type="datetime-local"
              required
              value={formData.demoTime || ""}
              onChange={handleChange}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField name="comment" label="Additional Comments" multiline rows={4} value={formData.comment || ""} onChange={handleChange} size="small" />
          </Box>
        );

      default:
        return null;
    }
  }

  return (
    <main className="mt-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          {/* Left side content */}
          <div className="hidden lg:flex flex-col justify-center items-center text-center p-8 rounded-l-lg">
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
              Unlock Your Potential
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '400px', color: 'text.secondary' }}>
              Experience our interactive teaching methods firsthand. Our free demo class is a great way to understand our curriculum, meet our expert tutors, and see how we make learning engaging and effective. Sign up today and take the first step towards academic excellence.
            </Typography>
          </div>

          {/* Right form */}
          <div className="p-6 sm:p-8 md:p-12">
            <Typography variant="h4" align="center" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Book Your Free Demo Class
            </Typography>

            <Stepper
              activeStep={activeStep}
              sx={{
                my: 4,
                "& .MuiStepIcon-root": {
                  "&.Mui-active, &.Mui-completed": { color: "primary.main" },
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  🎉 Demo Class Confirmed!
                </Typography>
                <Typography sx={{ mt: 2, mb: 1, color: 'text.primary', textAlign: 'center' }}>
                  Your demo class for <strong>{new Date(formData.demoTime).toLocaleString()}</strong> has been successfully booked.
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                  A confirmation email has been sent to <strong>{formData.email}</strong>.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={handleReset}
                    variant="contained"
                    sx={{ px: 3, py: 1.2, borderRadius: "8px" }}
                  >
                    Book Another Demo
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {error && (
                  <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>
                )}
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ mr: 1, px: 3, py: 1.2, borderRadius: "8px" }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button
                    onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                    variant="contained"
                    sx={{ px: 3, py: 1.2, borderRadius: "8px" }}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : (activeStep === steps.length - 1 ? "Finish" : "Next")}
                  </Button>
                </Box>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}