"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BorderBeam } from "@/components/ui/border-beam";

const steps = ["Personal Information", "Academic Details", "Schedule Demo"];

export default function FreeTrialPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const textFieldStyles = {
    "& label, & .MuiInputLabel-root": {
      color: isDarkMode ? "hsla(var(--foreground), 0.7)" : "rgba(0,0,0,0.7)",
    },
    "& label.Mui-focused, & .MuiInputLabel-root.Mui-focused": {
      color: isDarkMode ? "hsl(var(--primary))" : "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& .MuiInputBase-input": {
        color: isDarkMode ? "hsl(var(--foreground))" : "#000",
      },
      "& fieldset": {
        borderColor: isDarkMode ? "hsla(var(--foreground), 0.3)" : "rgba(0,0,0,0.3)",
      },
      "&:hover fieldset": {
        borderColor: isDarkMode ? "hsl(var(--primary))" : "#000",
      },
      "&.Mui-focused fieldset": {
        borderColor: isDarkMode ? "hsl(var(--primary))" : "#000",
      },
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => {
    setActiveStep(0);
    setFormData({});
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
            <TextField name="name" label="Student Name" required value={formData.name || ""} onChange={handleChange} sx={textFieldStyles} />
            <TextField name="parentName" label="Parent's Name" required value={formData.parentName || ""} onChange={handleChange} sx={textFieldStyles} />
            <TextField name="email" label="Email ID" type="email" required value={formData.email || ""} onChange={handleChange} sx={textFieldStyles} />
            <TextField name="mobile" label="Mobile Number" type="tel" required value={formData.mobile || ""} onChange={handleChange} sx={textFieldStyles} />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
            <TextField name="grade" label="Grade / Class" required value={formData.grade || ""} onChange={handleChange} sx={textFieldStyles} />
            <FormControl component="fieldset">
              <FormLabel sx={{ color: isDarkMode ? "hsla(var(--foreground), 0.7)" : "#000" }}>Subject / Course</FormLabel>
              <RadioGroup
                row
                name="subject"
                value={formData.subject || ""}
                onChange={handleChange}
                sx={{
                  "& .MuiFormControlLabel-label": { color: isDarkMode ? "hsl(var(--foreground))" : "#000" },
                  "& .MuiRadio-root": { color: isDarkMode ? "hsla(var(--foreground), 0.7)" : "#000" },
                  "& .Mui-checked": { color: "hsl(var(--primary)) !important" },
                }}
              >
                <FormControlLabel value="math" control={<Radio />} label="Math" />
                <FormControlLabel value="science" control={<Radio />} label="Science" />
                <FormControlLabel value="english" control={<Radio />} label="English" />
                <FormControlLabel value="coding" control={<Radio />} label="Coding" />
              </RadioGroup>
            </FormControl>
            <TextField name="demoTopic" label="Specific Demo Topic (Optional)" value={formData.demoTopic || ""} onChange={handleChange} sx={textFieldStyles} />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
            <TextField name="city" label="City" required value={formData.city || ""} onChange={handleChange} sx={textFieldStyles} />
            <TextField name="country" label="Country" required value={formData.country || ""} onChange={handleChange} sx={textFieldStyles} />
            <TextField
              name="demoTime"
              label="Preferred Demo Class Time"
              type="datetime-local"
              required
              value={formData.demoTime || ""}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
                sx: { color: isDarkMode ? "hsla(var(--foreground), 0.7)" : "#000" },
              }}
              sx={textFieldStyles} />
            <TextField name="comment" label="Additional Comments" multiline rows={4} value={formData.comment || ""} onChange={handleChange} sx={textFieldStyles} />
          </Box>
        );

      default:
        return null;
    }
  }

  return (
    <main className="mt-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch overflow-hidden ">
          {/* Left image */}
          <div className="hidden lg:block relative">
            <Image src="/st1.webp" alt="Free trial" fill className="object-cover rounded-l-lg" />
          </div>

          {/* Right form */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 0,
              backgroundColor: "hsla(var(--card), 0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Typography variant="h4" align="center" sx={{ color: isDarkMode ? "hsl(var(--foreground))" : "#000", fontWeight: 600 }}>
              Book Your Free Demo Class
            </Typography>

            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                "& .MuiStepLabel-label": {
                  color: isDarkMode ? "hsla(var(--foreground), 0.7)" : "#000",
                  "&.Mui-active": { color: "hsl(var(--primary))" },
                },
                "& .MuiStepIcon-root": {
                  color: isDarkMode ? "hsla(var(--foreground), 0.3)" : "#00000055",
                  "&.Mui-active, &.Mui-completed": { color: "hsl(var(--primary))" },
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
                <Typography sx={{ mt: 2, mb: 1, color: isDarkMode ? "hsl(var(--foreground))" : "#000" }}>
                  🎉 All steps completed – you’re all set! We will contact you shortly.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <div className="relative rounded-lg overflow-hidden">
                    <Button
                      onClick={handleReset}
                      sx={{
                        color: isDarkMode ? "hsl(var(--primary-foreground))" : "#000",
                        backgroundColor: isDarkMode ? "hsl(var(--primary))" : "transparent",
                        border: isDarkMode ? "none" : "1px solid rgba(0,0,0,0.4)",
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "hsla(var(--primary), 0.85)" : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      Book Another Demo
                    </Button>
                    <BorderBeam size={200} duration={4} />
                  </div>
                </Box>
              </>
            ) : (
              <>
                {getStepContent(activeStep)}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 4 }}>
                  <div className="relative rounded-lg overflow-hidden mr-1">
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{
                        color: isDarkMode ? "hsl(var(--foreground))" : "#000",
                        border: isDarkMode ? "1px solid hsla(var(--foreground), 0.4)" : "1px solid rgba(0,0,0,0.4)",
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "hsla(var(--foreground), 0.1)" : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      Back
                    </Button>
                    <BorderBeam size={200} duration={4} />
                  </div>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <div className="relative rounded-lg overflow-hidden">
                    <Button
                      onClick={handleNext}
                      sx={{
                        color: isDarkMode ? "hsl(var(--primary-foreground))" : "#000",
                        backgroundColor: isDarkMode ? "hsl(var(--primary))" : "transparent",
                        border: isDarkMode ? "none" : "1px solid rgba(0,0,0,0.4)",
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: isDarkMode ? "hsla(var(--primary), 0.85)" : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                    <BorderBeam size={200} duration={4} />
                  </div>
                </Box>
              </>
            )}
          </Paper>
        </div>
      </div>
    </main>
  );
}
