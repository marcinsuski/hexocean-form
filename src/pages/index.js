import Head from "next/head";
import styles from "@/styles/Home.module.css";
import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

// Initial State
const initialState = {
    id: "",
    name: "",
    preparation_time: "",
    type: "",
    no_of_slices: "",
    diameter: "",
    spiciness_scale: "",
    slices_of_bread: "",
};

function Home() {
    //state management
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    // handle input data
    const handleChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: value }));

        if (name === "type") {
            setState((prevState) => ({
                ...prevState,
                no_of_slices: "",
                diameter: "",
                spiciness_scale: "",
                slices_of_bread: "",
            }));
        }
    };

    // reset form fields to empty fields
    const handleReset = () => {
        setState(initialState);
        setFieldErrors({});
        setMessage({});
    };

    // validate form data
    const validateField = (data, fieldName, fieldValue) => {
        let fieldError = "";

        if (fieldName === "name" && fieldValue.length === 0) {
            fieldError = "Dish name is required.";
        } else if (
            fieldName === "preparation_time" &&
            fieldValue.length === 0
        ) {
            fieldError = "Preparation time is required.";
        } else if (
            fieldName === "preparation_time" &&
            !/^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(fieldValue)
        ) {
            fieldError = "Preparation time must be in HH:MM:SS format.";
        } else if (fieldName === "type" && fieldValue.length === 0) {
            fieldError = "Dish type is required.";
        } else if (
            fieldName === "no_of_slices" &&
            data.type === "pizza" &&
            (fieldValue === null || fieldValue === "")
        ) {
            fieldError = "no of slices is required for pizza.";
        } else if (
            fieldName === "diameter" &&
            data.type === "pizza" &&
            (fieldValue === null || fieldValue === "")
        ) {
            fieldError = "Diameter is required for pizza.";
        } else if (
            fieldName === "spiciness_scale" &&
            data.type === "soup" &&
            (fieldValue === null || fieldValue === "")
        ) {
            fieldError = "Spiciness scale is required for soup.";
        } else if (
            fieldName === "spiciness_scale" &&
            data.type === "soup" &&
            (fieldValue < 1 || fieldValue > 10)
        ) {
            fieldError = "Spiciness scale must be between 1 and 10.";
        } else if (
            fieldName === "slices_of_bread" &&
            data.type === "sandwich" &&
            (fieldValue === null || fieldValue === "" || fieldValue < 2)
        ) {
            fieldError =
                "no of slices of bread must be at least 2 for sandwiches.";
        }

        return fieldError;
    };

    // submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage({});

        const url =
            "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/";

        const data = {
            name: state.name,
            preparation_time: state.preparation_time,
            type: state.type,
        };

        if (state.type === "pizza") {
            data.no_of_slices = state.no_of_slices;
            data.diameter = state.diameter;
        } else if (state.type === "soup") {
            data.spiciness_scale = state.spiciness_scale;
        } else if (state.type === "sandwich") {
            data.slices_of_bread = state.slices_of_bread;
        }

        let formErrors = {};

        Object.keys(data).forEach((fieldName) => {
            const fieldError = validateField(data, fieldName, data[fieldName]);
            if (fieldError.length > 0) {
                formErrors[fieldName] = fieldError;
            }
        });

        if (Object.keys(formErrors).length > 0) {
            setFieldErrors(formErrors);
            setLoading(false);
            return;
        }

        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                setLoading(false);
                if (!response.ok) {
                    throw new Error(response.status);
                }
                setState(initialState);
                setMessage({ submit: "You successfuly submitted the form." });
                setFieldErrors({});
            })
            .catch((error) => {
                setLoading(false);
                setMessage({
                    submit: "An error occurred while submitting the form.",
                });
                console.error(error);
            });
    };

    return (
        <>
            {/* HEAD METADATA */}
            <Head>
                <title>Dish form</title>
                <meta name="description" content="HexOcean recruitment task" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favico.svg" />
            </Head>
            <main>
                <section>
                    {/* FORM HEADER */}
                    <Box
                        maxWidth={370}
                        mx="auto"
                        my={4}
                        className={styles.main}
                    >
                        <Typography
                            variant="h4"
                            align="center"
                            gutterBottom
                            sx={{ fontWeight: "bold" }}
                        >
                            Add a new dish
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            {loading && <CircularProgress />}
                            {Object.keys(message).length > 0 &&
                                Object.keys(message).map(
                                    (messageKey, index) => (
                                        <Typography
                                            key={index}
                                            variant="body2"
                                            color={
                                                message[messageKey].includes(
                                                    "successfuly"
                                                )
                                                    ? "greenyellow"
                                                    : "error"
                                            }
                                        >
                                            {message[messageKey]}
                                        </Typography>
                                    )
                                )}
                        </Box>

                        {/* FORM MAIN BODY */}
                        <Box className={styles.formBox}>
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                style={{
                                    "& .Mui-focused": {
                                        border: "2px solid white",
                                    },
                                }}
                            >
                                <TextField
                                    className={styles.inputBox}
                                    fullWidth
                                    required
                                    name="name"
                                    label="Dish name"
                                    value={state.name}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="standard"
                                    error={fieldErrors.name !== undefined}
                                    helperText={fieldErrors.name}
                                />
                                <TextField
                                    className={styles.inputBox}
                                    fullWidth
                                    required
                                    name="preparation_time"
                                    label="Preparation time"
                                    value={state.preparation_time}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="standard"
                                    placeholder="00:00:00"
                                    inputProps={{
                                        pattern:
                                            "([0-9]|[0-9][0-9]):([0-5][0-9]):([0-5][0-9])",
                                    }}
                                    error={
                                        fieldErrors.preparation_time !==
                                        undefined
                                    }
                                    helperText={fieldErrors.preparation_time}
                                />
                                <FormControl
                                    className={styles.inputBox}
                                    fullWidth
                                    required
                                    margin="normal"
                                    variant="standard"
                                >
                                    <InputLabel id="type-label">
                                        Dish type
                                    </InputLabel>
                                    <Select
                                        className={styles.inputBox}
                                        labelId="type-label"
                                        name="type"
                                        value={state.type}
                                        onChange={handleChange}
                                        label="Dish type"
                                        sx={{
                                            color: "white",
                                            background: "transparent",
                                        }}
                                    >
                                        <MenuItem value="pizza">Pizza</MenuItem>
                                        <MenuItem value="soup">Soup</MenuItem>
                                        <MenuItem value="sandwich">
                                            Sandwich
                                        </MenuItem>
                                    </Select>

                                    {fieldErrors.type !== undefined && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                        >
                                            {fieldErrors.type}
                                        </Typography>
                                    )}
                                </FormControl>
                                {state.type === "pizza" && (
                                    <FormGroup>
                                        <TextField
                                            className={styles.inputBox}
                                            fullWidth
                                            required
                                            name="no_of_slices"
                                            label="# of slices"
                                            type="number"
                                            value={state.no_of_slices}
                                            onChange={handleChange}
                                            margin="normal"
                                            variant="standard"
                                            error={
                                                fieldErrors.no_of_slices !==
                                                undefined
                                            }
                                            helperText={
                                                fieldErrors.no_of_slices
                                            }
                                        />
                                        <TextField
                                            className={styles.inputBox}
                                            fullWidth
                                            required
                                            name="diameter"
                                            label="Diameter"
                                            type="number"
                                            value={state.diameter}
                                            onChange={handleChange}
                                            margin="normal"
                                            variant="standard"
                                            error={
                                                fieldErrors.diameter !==
                                                undefined
                                            }
                                            helperText={fieldErrors.diameter}
                                        />
                                    </FormGroup>
                                )}
                                {state.type === "soup" && (
                                    <TextField
                                        className={styles.inputBox}
                                        fullWidth
                                        required
                                        name="spiciness_scale"
                                        label="Spiciness scale (1-10)"
                                        type="number"
                                        value={state.spiciness_scale}
                                        onChange={handleChange}
                                        margin="normal"
                                        variant="standard"
                                        inputProps={{ min: 1, max: 10 }}
                                        error={
                                            fieldErrors.spiciness_scale !==
                                            undefined
                                        }
                                        helperText={fieldErrors.spiciness_scale}
                                    />
                                )}
                                {state.type === "sandwich" && (
                                    <TextField
                                        className={styles.inputBox}
                                        fullWidth
                                        required
                                        name="slices_of_bread"
                                        label="# of slices of bread"
                                        type="number"
                                        value={state.slices_of_bread}
                                        onChange={handleChange}
                                        margin="normal"
                                        variant="standard"
                                        error={
                                            fieldErrors.slices_of_bread !==
                                            undefined
                                        }
                                        helperText={fieldErrors.slices_of_bread}
                                    />
                                )}
                                {/* FORM CONTROLS */}
                                <Box
                                    mt={2}
                                    sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Button
                                        onClick={handleReset}
                                        variant="outlined"
                                        color="inherit"
                                        className={styles.reset_btn}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        className={styles.submit_btn}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </section>
            </main>
        </>
    );
}

export default Home;
