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
import { ICourseMessage } from "../models/CourseMessage";
import { useSession } from "next-auth/react";

interface PopulatedMessage extends Omit<ICourseMessage, "senderId"> {
  senderId: {
    _id: string;
    fullName: string;
    role: string;
  };
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/courseMessages/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message.");
      }
      setMessages((prev) => [...prev, data.message]);
      setNewMessage("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
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
                          bgcolor: isSender ? 'primary.main' : 'grey.200',
                          color: isSender ? 'primary.contrastText' : 'common.black',
                          borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                        }}
                      >
                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {isSender ? "You" : msg.senderId.fullName}
                        </Typography>
                        <ListItemText primary={msg.message} />
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

        <Box component="form" onSubmit={sendMessage} sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            variant="outlined"
            disabled={isSending}
          />
          <IconButton type="submit" color="primary" disabled={!newMessage.trim() || isSending}>
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
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
};

export default CourseMessageModal;
