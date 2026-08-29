import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import EditJobModal from "./EditJobModal";
import { Modal } from "@mui/material";
import { deleteJob } from "../../../../store/employer/employerJobSlice";


const JobTable = () =>
{

    const dispatch = useDispatch();
    const { jobs, deletingJobId } = useSelector( ( state ) => state.employerJob );

    // Delete Job

    const deleteJobHandler = ( id ) =>
    {
        dispatch( deleteJob( id ) );
    };



    // Pagination
    const [ page, setPage ] = useState( 1 );
    const rowsPerPage = 7;

    const startIndex = ( page - 1 ) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedJobs = jobs?.slice( startIndex, endIndex );
    const totalPages = Math.ceil( jobs?.length / rowsPerPage ) || 1;


    // Date Format 
    const formatDate = ( date ) =>
    {
        const d = new Date( date );
        const day = String( d.getDate() ).padStart( 2, "0" );
        const month = String( d.getMonth() + 1 ).padStart( 2, "0" );
        const year = d.getFullYear();

        return `${ day }/${ month }/${ year }`;
    }


    // Edit Job

    const [ selectedJob, setSelectedJob ] = useState( null )
    const [ openEditModal, setOpenEditModal ] = useState( false )


    const handleOpenEditModal = ( job ) => () =>
    {
        setSelectedJob( job )
        setOpenEditModal( true )
    }


    const handleCloseEditModal = ( job ) =>
    {
        setSelectedJob( null )
        setOpenEditModal( false )
    }

    return (
        <>
            <TableContainer
                component={ Paper }
                sx={ { marginTop: 3, overflowX: "auto" } }
            >
                <Table sx={ { minWidth: 650 } } aria-label="jobs table" size="small">
                    <TableHead>
                        <TableRow>
                            { [
                                "Title",
                                "Location",
                                "Job Type",
                                "Status",
                                "Deadline",
                                "Action",
                            ].map( ( head, idx ) => (
                                <TableCell
                                    key={ idx }
                                    sx={ {
                                        px: { xs: 1.5, sm: 2 },
                                        whiteSpace: "nowrap",
                                        fontSize: { xs: "12px", sm: "13px", md: "14px" },
                                    } }
                                >
                                    { head }
                                </TableCell>
                            ) ) }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { paginatedJobs?.map( ( job, i ) => (
                            <TableRow
                                key={ i }
                                sx={ { "&:last-child td, &:last-child th": { border: 0 } } }
                            >
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    { job?.title }
                                </TableCell>
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    { job?.company?.location }
                                </TableCell>
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    { " " }
                                    { job?.timing?.replaceAll( "_", " " ) }
                                </TableCell>
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    { job?.active ? "Active" : "Inactive" }
                                </TableCell>
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    { formatDate( job?.createdAt ) }
                                </TableCell>
                                <TableCell sx={ { px: { xs: 1.5, sm: 2 } } }>
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                        <Button
                                            onClick={ handleOpenEditModal( job ) }
                                            variant="contained"
                                            sx={ {
                                                textTransform: "capitalize",
                                                borderRadius: "50px",
                                                px: { xs: 1.5, sm: 2 },
                                                py: 0.5,
                                                fontSize: { xs: "10px", sm: "12px" },
                                                border: "1px solid #1a6079",
                                                background: "transparent",
                                                color: "#1a6079",
                                            } }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={ () => deleteJobHandler( job?.id ) }
                                            disabled={ job?.id == deletingJobId }
                                            variant="contained"
                                            sx={ {
                                                textTransform: "capitalize",
                                                borderRadius: "50px",
                                                px: { xs: 1.5, sm: 2 },
                                                py: 0.5,
                                                fontSize: { xs: "10px", sm: "12px" },
                                                background: "#1a6079",
                                            } }
                                        >
                                            { job?.id == deletingJobId ? (
                                                <CircularProgress color="black" size={ 10 } />
                                            ) : (
                                                "Delete"
                                            ) }
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) ) }
                    </TableBody>
                </Table>
            </TableContainer>

            <Stack spacing={ 2 } sx={ { marginTop: 5 } } alignItems="center">
                <Pagination
                    count={ totalPages }
                    page={ page }
                    onChange={ ( event, value ) => setPage( value ) }
                    siblingCount={ 0 }
                    boundaryCount={ 1 }
                    sx={ {
                        "& .MuiPaginationItem-root": { color: "#1a6079" },
                        "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#1a6079",
                            color: "#fff",
                        },
                    } }
                />
            </Stack>


            <Modal
                open={ openEditModal }
                onClose={ handleCloseEditModal }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <EditJobModal handleClose={ handleCloseEditModal } selectedJob={ selectedJob } />
            </Modal>


        </>
    )
}

export default JobTable