import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector, useDispatch } from "react-redux";
import {
  updateApplicantStatus,
  setLocalStatus,
  fetchApplicants,
} from "../../../../store/employer/employerApplicantSlice";
import ApplicantDetailModal from "./ApplicantDetailModal";
import ChatModal from "../../../../components/Chat/ChatModal";

const STATUS_OPTIONS = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "REJECTED",
];

const STATUS_COLORS = {
  APPLIED: { color: "#4b5563", bg: "#f3f4f6", label: "Applied" },
  UNDER_REVIEW: { color: "#b45309", bg: "#fef3c7", label: "Under Review" },
  SHORTLISTED: { color: "#1d4ed8", bg: "#dbeafe", label: "Shortlisted" },
  INTERVIEW: { color: "#7c3aed", bg: "#ede9fe", label: "Interview" },
  OFFERED: { color: "#15803d", bg: "#dcfce7", label: "Offered" },
  REJECTED: { color: "#b91c1c", bg: "#fee2e2", label: "Rejected" },
};

const formatStatus = (status) => {
  if (!status) return "Applied";
  return (
    STATUS_COLORS[status]?.label ||
    status.charAt(0) + status.slice(1).toLowerCase().replace("_", " ")
  );
};

const ApplicantTable = () => {
  const dispatch = useDispatch();
  const { applicants } = useSelector((state) => state.employerApplicant);

  const [updatingId, setUpdatingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatApplicant, setChatApplicant] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedApplicants = applicants?.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(applicants?.length / rowsPerPage) || 1;

  const handleStatusChange = async (applicationId, newStatus) => {
    if (!applicationId || !newStatus) return;

    // 1. Optimistic Instant UI Update
    dispatch(setLocalStatus({ applicationId, status: newStatus }));
    setUpdatingId(applicationId);

    // 2. Dispatch to Backend API
    const res = await dispatch(
      updateApplicantStatus({ applicationId, status: newStatus })
    );

    setUpdatingId(null);

    if (res.meta.requestStatus === "fulfilled") {
      setSuccessId(applicationId);
      setTimeout(() => {
        setSuccessId(null);
      }, 1500);
    }
  };

  const handleViewClick = (applicant) => {
    setSelectedApplicant(applicant);
    setModalOpen(true);
  };

  const handleChatClick = (applicant) => {
    setChatApplicant(applicant);
    setChatOpen(true);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 3,
          overflowX: "auto",
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="applicants table">
          <TableHead sx={{ background: "#f8fafc" }}>
            <TableRow>
              {[
                "Candidate",
                "Job Applied",
                "Skills",
                "Location",
                "Decision Status",
                "Action",
              ].map((head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: 2,
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#475569",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedApplicants?.map((a, idx) => {
              const isUpdating = updatingId === a.id;
              const isSuccess = successId === a.id;
              const currentStatus = a.status || "APPLIED";
              const statusStyle =
                STATUS_COLORS[currentStatus] || STATUS_COLORS.APPLIED;

              return (
                <TableRow
                  key={a.id || idx}
                  sx={{
                    "&:hover": { background: "#f8fafc/60" },
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  {/* Candidate Name & Email */}
                  <TableCell sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {a.user?.fullName || "Candidate"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {a.user?.email}
                      </p>
                    </div>
                  </TableCell>

                  {/* Job Title */}
                  <TableCell sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                    <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {a.job?.title || "Job Position"}
                    </span>
                  </TableCell>

                  {/* Skills */}
                  <TableCell sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(a.user?.skills?.length
                        ? a.user.skills
                        : a.job?.requiredSkills || []
                      )
                        .slice(0, 2)
                        .map((s, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium bg-[#1a6079]/10 text-[#1a6079] px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      py: 2,
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    {a.user?.location ||
                      a.job?.company?.location ||
                      "Delhi, India"}
                  </TableCell>

                  {/* Decision Status Dropdown */}
                  <TableCell sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 155 }}>
                      <Select
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(a.id, e.target.value)
                        }
                        renderValue={(value) => (
                          <div className="flex items-center gap-1.5 py-0.5">
                            {isUpdating ? (
                              <CircularProgress
                                size={12}
                                sx={{ color: statusStyle.color }}
                              />
                            ) : isSuccess ? (
                              <CheckCircleIcon
                                sx={{ fontSize: 14, color: "#16a34a" }}
                              />
                            ) : (
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: statusStyle.color }}
                              />
                            )}
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: statusStyle.color,
                              }}
                            >
                              {formatStatus(value)}
                            </span>
                          </div>
                        )}
                        sx={{
                          fontSize: "12px",
                          bgcolor: statusStyle.bg,
                          borderRadius: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: isSuccess
                              ? "1.5px solid #16a34a"
                              : "1px solid rgba(0,0,0,0.06)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid rgba(0,0,0,0.15)",
                          },
                          "& .MuiSelect-select": {
                            py: "6px !important",
                            px: "12px !important",
                          },
                          "& .MuiSelect-icon": {
                            color: statusStyle.color,
                            fontSize: "18px",
                          },
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <MenuItem
                            key={opt}
                            value={opt}
                            sx={{
                              fontSize: "13px",
                              fontWeight: 600,
                              color: STATUS_COLORS[opt]?.color,
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              py: 1,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor: STATUS_COLORS[opt]?.color,
                              }}
                            />
                            {formatStatus(opt)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Actions (Chat + View) */}
                  <TableCell sx={{ px: { xs: 2, sm: 2.5 }, py: 2 }}>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={
                          <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                        }
                        onClick={() => handleChatClick(a)}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "10px",
                          px: 2,
                          py: 0.6,
                          fontSize: "12px",
                          fontWeight: 700,
                          background: "#1a6079",
                          boxShadow: "none",
                          "&:hover": { background: "#124557" },
                        }}
                      >
                        Chat
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewClick(a)}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "10px",
                          px: 2,
                          py: 0.6,
                          fontSize: "12px",
                          fontWeight: 700,
                          borderColor: "#cbd5e1",
                          color: "#475569",
                          "&:hover": {
                            borderColor: "#94a3b8",
                            background: "#f1f5f9",
                          },
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ marginTop: 4 }} alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#1a6079",
              fontWeight: 600,
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "#1a6079",
              color: "#fff",
            },
          }}
        />
      </Stack>

      <ApplicantDetailModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        applicant={selectedApplicant}
        onOpenChat={() => {
          setModalOpen(false);
          setChatApplicant(selectedApplicant);
          setChatOpen(true);
        }}
      />

      <ChatModal
        open={chatOpen}
        handleClose={() => setChatOpen(false)}
        applicationId={chatApplicant?.id}
        jobTitle={chatApplicant?.job?.title}
        otherPartyName={chatApplicant?.user?.fullName}
        isEmployer={true}
      />
    </>
  );
};

export default ApplicantTable;