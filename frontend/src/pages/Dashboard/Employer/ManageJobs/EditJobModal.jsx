import React from "react";

import
{
    Button,
    CircularProgress,
    IconButton,
    TextField,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postJob, updateJob } from "../../../../store/employer/employerJobSlice";



const EditJobModal = ( { handleClose, selectedJob } ) =>
{
    const dispatch = useDispatch();
    const { employer } = useSelector( ( state ) => state.employer );
    const { categories } = useSelector( ( state ) => state.category );
    const { updateLoading } = useSelector( ( state ) => state.employerJob );

    const formik = useFormik( {
        initialValues: {
            title: selectedJob?.title || "",
            description: selectedJob?.description || "",
            categoryId: selectedJob?.category?.id || "",
            requiredExperience: selectedJob?.requiredExperience || "",
            avgSalary: selectedJob?.avgSalary || "",
            timing: selectedJob?.timing || "",
            responsibilities: selectedJob?.responsibilities || [],
            responsibilityInput: "",
            requiredSkills: selectedJob?.requiredSkills || [],
            skillInput: "",
        },

        validationSchema: Yup.object( {
            title: Yup.string()
                .min( 3, "Job title must be at least 3 characters" )
                .required( "Job title is required" ),

            description: Yup.string()
                .min( 50, "Description must be at least 50 characters" )
                .required( "Job description is required" ),

            categoryId: Yup.string().required( "Category is required" ),

            requiredExperience: Yup.string().required( "Experience is required" ),

            avgSalary: Yup.string().required( "Average salary is required" ),

            timing: Yup.string().required( "Job type is required" ),

            responsibilities: Yup.array().min( 1, "At least one responsibility is required" ),

            requiredSkills: Yup.array().min( 1, "At least one skill is required" ),
        } ),

        onSubmit: ( values, { resetForm } ) =>
        {

            dispatch( updateJob( { ...values, id: selectedJob?.id } ) );
            handleClose()
        },
    } );

    // Responsibilities
    const addResHandler = () =>
    {
        const value = formik.values.responsibilityInput.trim();
        if ( !value ) return;
        formik.setFieldValue( "responsibilities", [ ...formik.values.responsibilities, value ] );
        formik.setFieldValue( "responsibilityInput", "" );
    };

    const removeResHandler = ( idx ) =>
    {
        formik.setFieldValue(
            "responsibilities",
            formik.values.responsibilities.filter( ( _, i ) => i !== idx )
        );
    };

    // Skills
    const addSkillHandler = () =>
    {
        const value = formik.values.skillInput.trim();
        if ( !value ) return;
        formik.setFieldValue( "requiredSkills", [ ...formik.values.requiredSkills, value ] );
        formik.setFieldValue( "skillInput", "" );
    };

    const removeSkillHandler = ( idx ) =>
    {
        formik.setFieldValue(
            "requiredSkills",
            formik.values.requiredSkills.filter( ( _, i ) => i !== idx )
        );
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            height: { xs: 44, sm: 48, md: 52 },
            fontSize: { xs: 12, sm: 14, md: 16 },
        },
        "& .MuiInputBase-input": {
            padding: "0 14px",
            height: "100%",
            fontSize: { xs: 12, sm: 14, md: 16 },
        },
        "& .MuiInputLabel-root": {
            fontSize: { xs: 12, sm: 14, md: 15 },
        },
    };

    return (
        <>
            <Box
                sx={ {
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "95vw", sm: 600, md: 900 },
                    maxHeight: "85vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 5,
                    zIndex: 9999,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                } }
            >
                <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-100">
                    <h2 className="text-[20px] sm:text-[22px] font-medium">Edit Job</h2>
                    <IconButton onClick={ handleClose } size="small">
                        <CancelOutlinedIcon />
                    </IconButton>
                </div>

                <Box sx={ { overflowY: "auto", px: { xs: 3, sm: 4 }, pt: 3, pb: 4, flex: 1 } }>

                    <div className="flex flex-col md:flex-row gap-5 md:gap-7">
                        <TextField
                            fullWidth
                            name="title"
                            label="Job Title"
                            variant="outlined"
                            value={ formik.values.title }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            error={ formik.touched.title && Boolean( formik.errors.title ) }
                            helperText={ formik.touched.title && formik.errors.title }
                            sx={ inputSx }
                        />

                        <TextField
                            fullWidth
                            name="description"
                            label="Job Description"
                            variant="outlined"
                            value={ formik.values.description }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            error={ formik.touched.description && Boolean( formik.errors.description ) }
                            helperText={ formik.touched.description && formik.errors.description }
                            sx={ inputSx }
                        />
                    </div>

                    <div className="mt-6 sm:mt-7 flex flex-col md:flex-row gap-5 md:gap-7">
                        <FormControl fullWidth>
                            <InputLabel sx={ { fontSize: { xs: 12, sm: 14 } } }>Category</InputLabel>
                            <Select
                                name="categoryId"
                                label="Category"
                                value={ formik.values.categoryId }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                sx={ { height: { xs: 44, sm: 48, md: 52 }, fontSize: { xs: 12, sm: 14, md: 16 } } }
                            >
                                { categories?.map( ( c ) => (
                                    <MenuItem key={ c?.id } value={ c?.id }>{ c?.name }</MenuItem>
                                ) ) }
                            </Select>
                            { formik.touched.categoryId && formik.errors.categoryId && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{ formik.errors.categoryId }</p>
                            ) }
                        </FormControl>
                    </div>

                    <div className="mt-6 sm:mt-7 flex flex-col md:flex-row gap-5 md:gap-7">
                        <TextField
                            fullWidth
                            name="requiredExperience"
                            label="Experience"
                            variant="outlined"
                            value={ formik.values.requiredExperience }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            error={ formik.touched.requiredExperience && Boolean( formik.errors.requiredExperience ) }
                            helperText={ formik.touched.requiredExperience && formik.errors.requiredExperience }
                            sx={ inputSx }
                        />

                        <TextField
                            fullWidth
                            name="avgSalary"
                            label="Average Salary"
                            variant="outlined"
                            value={ formik.values.avgSalary }
                            onChange={ formik.handleChange }
                            onBlur={ formik.handleBlur }
                            error={ formik.touched.avgSalary && Boolean( formik.errors.avgSalary ) }
                            helperText={ formik.touched.avgSalary && formik.errors.avgSalary }
                            sx={ inputSx }
                        />
                    </div>

                    <div className="mt-6 sm:mt-7 flex flex-col md:flex-row gap-5 md:gap-7">
                        <FormControl fullWidth>
                            <InputLabel sx={ { fontSize: { xs: 12, sm: 14 } } }>Job Type</InputLabel>
                            <Select
                                name="timing"
                                label="Job Type"
                                value={ formik.values.timing }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                sx={ { height: { xs: 44, sm: 48, md: 52 }, fontSize: { xs: 12, sm: 14, md: 16 } } }
                            >
                                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                                <MenuItem value="PART_TIME">Part Time</MenuItem>
                                <MenuItem value="INTERNSHIP">Internship</MenuItem>
                                <MenuItem value="CONTRACT">Contract</MenuItem>
                            </Select>
                            { formik.touched.timing && formik.errors.timing && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{ formik.errors.timing }</p>
                            ) }
                        </FormControl>
                    </div>

                    <div className="mt-6 sm:mt-7">
                        <div className="relative">
                            <TextField
                                fullWidth
                                name="responsibilityInput"
                                label="Responsibilities"
                                variant="outlined"
                                value={ formik.values.responsibilityInput }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                onKeyDown={ ( e ) => e.key === "Enter" && ( e.preventDefault(), addResHandler() ) }
                                sx={ inputSx }
                            />
                            <Button
                                type="button"
                                onClick={ addResHandler }
                                sx={ { textTransform: "capitalize", position: "absolute", right: 4, top: 6, fontSize: { xs: 12, sm: 14 } } }
                            >
                                <span className="text-(--primary-color)">Add</span>
                            </Button>
                            { formik.touched.responsibilities && formik.errors.responsibilities && (
                                <p className="text-red-500 text-xs mt-1">{ formik.errors.responsibilities }</p>
                            ) }
                        </div>

                        { formik.values.responsibilities.length > 0 && (
                            <ul className="mt-4 flex gap-3 flex-wrap">
                                { formik.values.responsibilities.map( ( elem, idx ) => (
                                    <li
                                        key={ idx }
                                        className="text-[11px] lg:text-[13px] relative text-[#626262] bg-[rgba(0,123,255,0.1)] font-medium py-1.5 pl-3 pr-7 rounded-lg"
                                    >
                                        { elem }
                                        <ClearIcon
                                            onClick={ () => removeResHandler( idx ) }
                                            sx={ { cursor: "pointer", fontSize: { xs: 13, sm: 15 }, color: "#555", position: "absolute", top: "50%", transform: "translateY(-50%)", right: 5 } }
                                        />
                                    </li>
                                ) ) }
                            </ul>
                        ) }
                    </div>

                    <div className="mt-6 sm:mt-7">
                        <div className="relative">
                            <TextField
                                fullWidth
                                name="skillInput"
                                label="Required Skills"
                                variant="outlined"
                                value={ formik.values.skillInput }
                                onChange={ formik.handleChange }
                                onBlur={ formik.handleBlur }
                                onKeyDown={ ( e ) => e.key === "Enter" && ( e.preventDefault(), addSkillHandler() ) }
                                sx={ inputSx }
                            />
                            <Button
                                type="button"
                                onClick={ addSkillHandler }
                                sx={ { textTransform: "capitalize", position: "absolute", right: 4, top: 6, fontSize: { xs: 12, sm: 14 } } }
                            >
                                <span className="text-(--primary-color)">Add</span>
                            </Button>
                            { formik.touched.requiredSkills && formik.errors.requiredSkills && (
                                <p className="text-red-500 text-xs mt-1">{ formik.errors.requiredSkills }</p>
                            ) }
                        </div>

                        { formik.values.requiredSkills.length > 0 && (
                            <ul className="mt-4 flex gap-3 flex-wrap">
                                { formik.values.requiredSkills.map( ( elem, idx ) => (
                                    <li
                                        key={ idx }
                                        className="text-[11px] lg:text-[13px] relative text-[#626262] bg-[rgba(0,123,255,0.1)] font-medium py-1.5 pl-3 pr-7 rounded-lg"
                                    >
                                        { elem }
                                        <ClearIcon
                                            onClick={ () => removeSkillHandler( idx ) }
                                            sx={ { cursor: "pointer", fontSize: { xs: 13, sm: 15 }, color: "#555", position: "absolute", top: "50%", transform: "translateY(-50%)", right: 5 } }
                                        />
                                    </li>
                                ) ) }
                            </ul>
                        ) }
                    </div>

                    <div className="mt-8 sm:mt-10">
                        <Button
                            onClick={ formik.handleSubmit }
                            fullWidth
                            variant="contained"
                            disabled={ updateLoading }
                            sx={ {
                                background: "#1a6079",
                                textTransform: "capitalize",
                                paddingY: { xs: 1, sm: 1.2, md: 1.5 },
                                fontSize: { xs: 14, sm: 15, md: 16 },
                                height: "48px",
                                "&:hover": { background: "#154f63" },
                            } }
                        >
                            { updateLoading
                                ? <CircularProgress size={ 18 } sx={ { color: "#fff" } } />
                                : <span className="font-medium">Save Changes</span>
                            }
                        </Button>
                    </div>

                </Box>
            </Box>
        </>
    );
};

export default EditJobModal;