"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import { ICourseMessage } from "../models/CourseMessage";
import { useSession } from "next-auth/react";

interface PopulatedMessage extends Omit<ICourseMessage, "senderId"> {
  senderId: {
    _id: string;
    fullName: string;
    role: string;
  };
  attachmentUrl?: string;
  attachmentType?: string;
}

interface Props {
  courseId: string;
  open: boolean;
  onClose: () => void;
}

const CourseMessageModal: React.FC<Props> = ({ courseId, open, onClose }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<PopulatedMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open && courseId) {
      fetchMessages();
    }
  }, [open, courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/courseMessages/${courseId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch messages.");
      }
      setMessages(data.messages);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      setAttachmentFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentUpload = async () => {
    if (!attachmentFile) return null;

    const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setError("Cloudinary configuration is missing. Please check your environment variables.");
      setIsSending(false);
      return null;
    }

    const formData = new FormData();
    formData.append("file", attachmentFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Attachment upload failed");
      }

      const data = await response.json();
      return {
        url: data.secure_url, // Keep the full URL with the extension
        type: data.format,
      };
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      setError("Error uploading attachment. Please try again.");
      return null;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachmentFile) || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const attachment = await handleAttachmentUpload();

      const res = await fetch(`/api/courseMessages/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage,
          attachmentUrl: attachment?.url,
          attachmentType: attachment?.type,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
      handleRemoveAttachment();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} className="border-2 border-blue-500">
        <Typography variant="h6" component="h2" mb={2}>
          Course Messages
        </Typography>

        <Paper variant="outlined" sx={{ height: 400, overflowY: "auto", p: 2, mb: 2, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {messages.map((msg) => {
                const isSender = msg.senderId._id === currentUserId;
                return (
                  <ListItem key={msg._id.toString()} sx={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ maxWidth: '75%' }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor: isSender ? 'primary.main' : '#374151', // gray-700 for receiver
                          color: isSender ? 'primary.contrastText' : 'white',
                          borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                        }}
                      >
                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {isSender ? "You" : msg.senderId.fullName}
                        </Typography>
                        <ListItemText primary={msg.message} />
                        {msg.attachmentUrl && (
                          <Box sx={{ mt: 1, maxWidth: 200, maxHeight: 200, borderRadius: 2, overflow: "hidden" }}>
                            <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                              <img src={msg.attachmentUrl} alt="attachment" style={{ width: "100%", height: "auto", display: "block" }} />
                            </a>
                          </Box>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'right', opacity: 0.7 }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>
                    </Box>
                  </ListItem>
                );
              })}
              <div ref={messagesEndRef} />
            </List>
          )}
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {attachmentPreview && (
          <Paper variant="outlined" sx={{ p: 1, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img src={attachmentPreview} alt="preview" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
            <Typography variant="body2" noWrap sx={{ flex: 1, mx: 2 }}>
              {attachmentFile?.name}
            </Typography>
            <IconButton size="small" onClick={handleRemoveAttachment}>
              <CloseIcon />
            </IconButton>
          </Paper>
        )}

        <Box component="form" onSubmit={sendMessage} sx={{ display: "flex", gap: 1 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            id="attachment-input"
          />
          <IconButton color="primary" aria-label="attach file" component="label" htmlFor="attachment-input">
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            disabled={isSending}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#374151', // gray-700
                color: 'white',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
              },
            }}
          />
          <IconButton type="submit" color="primary" disabled={(!newMessage.trim() && !attachmentFile) || isSending}>
            {isSending ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: '95%', sm: 600 },
  bgcolor: "#1f2937", // bg-gray-800
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
};

export default CourseMessageModal;
