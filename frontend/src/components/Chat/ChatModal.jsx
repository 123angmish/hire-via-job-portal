import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatMessages,
  sendChatMessage,
  clearChat,
} from "../../store/candidate/chatSlice";

const QUICK_PROMPTS_EMPLOYER = [
  "We would like to schedule an interview with you.",
  "When are you available for a quick discussion?",
  "Please share your updated resume and portfolio.",
  "Congratulations! We are pleased to extend an offer.",
];

const QUICK_PROMPTS_CANDIDATE = [
  "Hi, thank you for considering my application!",
  "I am available for an interview this week.",
  "Thank you for the update! Looking forward to it.",
  "Please let me know if you need any further information.",
];

const ChatModal = ({
  open,
  handleClose,
  applicationId,
  jobTitle,
  otherPartyName,
  isEmployer = false,
}) => {
  const dispatch = useDispatch();
  const { messages, sending } = useSelector((state) => state.chat);
  const currentUser = useSelector((state) => state.user?.user);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const currentRole = isEmployer
    ? "EMPLOYER"
    : localStorage.getItem("role") || (currentUser?.role === "EMPLOYER" ? "EMPLOYER" : "CANDIDATE");

  const quickPrompts = isEmployer ? QUICK_PROMPTS_EMPLOYER : QUICK_PROMPTS_CANDIDATE;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open && applicationId) {
      dispatch(fetchChatMessages(applicationId));

      // Fast Real-Time Live Polling (every 1.5 seconds)
      const interval = setInterval(() => {
        dispatch(fetchChatMessages(applicationId));
      }, 1500);

      return () => {
        clearInterval(interval);
        dispatch(clearChat());
      };
    }
  }, [open, applicationId, dispatch]);

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = async (msgToSend) => {
    const text = (msgToSend || inputMessage).trim();
    if (!text || !applicationId) return;

    setInputMessage("");

    await dispatch(
      sendChatMessage({
        applicationId,
        message: text,
        senderRole: currentRole,
        senderName: isEmployer
          ? "Employer"
          : (currentUser?.fullName || "Candidate"),
      })
    );

    dispatch(fetchChatMessages(applicationId));
    setTimeout(scrollToBottom, 60);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
          border: "1px solid rgba(226,232,240,0.9)",
          height: "630px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Sleek Modern Header */}
      <div className="bg-gradient-to-r from-[#1a6079] to-[#0284c7] px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg text-white border border-white/30 shadow-inner">
            {otherPartyName ? otherPartyName.charAt(0).toUpperCase() : (isEmployer ? "C" : "E")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white leading-tight">
                {otherPartyName || (isEmployer ? "Candidate" : "Employer")}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white">
                {isEmployer ? "Candidate" : "Employer"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-white/85 font-medium truncate max-w-[260px]">
                {jobTitle || "Live Application Discussion"}
              </p>
            </div>
          </div>
        </div>

        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ color: "white", "&:hover": { background: "rgba(255,255,255,0.2)" } }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-slate-50/70 p-4 sm:p-5 overflow-y-auto overflow-x-hidden space-y-3">
        {messages && messages.length > 0 ? (
          messages.map((m, idx) => {
            const isMe = m.senderRole
              ? m.senderRole.toUpperCase() === currentRole.toUpperCase()
              : (currentUser?.email && m.senderEmail === currentUser.email);

            return (
              <div
                key={m.id || idx}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {isMe ? "You" : m.senderName || (isEmployer ? "Candidate" : "Employer")}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTime(m.createdAt)}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? "bg-[#1a6079] text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className="w-14 h-14 rounded-2xl bg-[#1a6079]/10 text-[#1a6079] flex items-center justify-center mb-3">
              <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Messages Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Start the direct conversation by sending an interview schedule, question, or response below!
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-2 bg-slate-100/80 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
          Quick:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-[11px] text-[#1a6079] bg-white border border-[#1a6079]/25 hover:border-[#1a6079] hover:bg-[#1a6079]/10 rounded-full px-3 py-1 whitespace-nowrap transition-all font-semibold shrink-0 cursor-pointer shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message here... (Press Enter to send)"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-hidden focus:border-[#1a6079] focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />

          <Button
            type="submit"
            variant="contained"
            disabled={!inputMessage.trim() || sending}
            sx={{
              minWidth: "46px",
              height: "44px",
              borderRadius: "12px",
              background: "#1a6079",
              boxShadow: "none",
              "&:hover": { background: "#124557" },
            }}
          >
            {sending ? (
              <CircularProgress size={18} sx={{ color: "white" }} />
            ) : (
              <SendIcon sx={{ fontSize: 18 }} />
            )}
          </Button>
        </form>
      </div>
    </Dialog>
  );
};

export default ChatModal;
