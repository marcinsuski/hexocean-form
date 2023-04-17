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

const initialState = {
    id: null,
    name: "",
    preparation_time: "",
    type: "",
    no_of_slices: null,
    diameter: null,
    spiciness_scale: null,
    slices_of_bread: null,
};

function Home() {
    const [state, setState] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: value }));

        if (name === "type") {
            setState((prevState) => ({
                ...prevState,
                no_of_slices: null,
                diameter: null,
                spiciness_scale: null,
                slices_of_bread: null,
            }));
        }
    };

    const handleReset = () => {
        setState(initialState);
        setFieldErrors({});
        setErrors({});
    };

    const validateField = (data, fieldName, fieldValue) => {
        let fieldError = "";

        if (fieldName === "dish_name" && fieldValue.length === 0) {
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setErrors({});

        const url =
            "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/";

        const data = {
            id: Date.now(),
            name: state.dish_name,
            preparation_time: state.preparation_time,
            type: state.type,
            no_of_slices: state.no_of_slices,
            diameter: state.diameter,
            spiciness_scale: state.spiciness_scale,
            slices_of_bread: state.slices_of_bread,
        };

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
                console.log(JSON.stringify(data));
                setLoading(false);
                if (!response.ok) {
                    throw new Error(
                        "An error occurred while submitting the form."
                    );
                }

                setState(initialState);
                setErrors({});
            })
            .catch((error) => {
                setLoading(false);
                setErrors({
                    submit: "An error occurred while submitting the form.",
                });
                console.error(error);
            });
    };

    return (
        <>
            <Head>
                <title>Dish form</title>
                <meta name="description" content="HexOcean recruitment task" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favico.svg" />
            </Head>
            <main className={styles.main}>
                <Box maxWidth={370} mx="auto" my={4}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Add a new dish
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {loading && <CircularProgress />}
                        {Object.keys(errors).length > 0 &&
                            Object.keys(errors).map((errorKey, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    color="error"
                                >
                                    {errors[errorKey]}
                                </Typography>
                            ))}
                    </Box>
                    <form onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            required
                            name="name"
                            label="Dish name"
                            value={state.dish_name}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            error={fieldErrors.dish_name !== undefined}
                            helperText={fieldErrors.dish_name}
                        />
                        <TextField
                            fullWidth
                            required
                            name="preparation_time"
                            label="Preparation time"
                            value={state.preparation_time}
                            onChange={handleChange}
                            margin="normal"
                            variant="outlined"
                            placeholder="00:00:00"
                            inputProps={{
                                pattern:
                                    "([0-9]|[0-9][0-9]):([0-5][0-9]):([0-5][0-9])",
                            }}
                            error={fieldErrors.preparation_time !== undefined}
                            helperText={fieldErrors.preparation_time}
                        />
                        <FormControl
                            fullWidth
                            required
                            margin="normal"
                            variant="outlined"
                        >
                            <InputLabel id="type-label">Dish type</InputLabel>
                            <Select
                                labelId="type-label"
                                name="type"
                                value={state.type}
                                onChange={handleChange}
                                label="Dish type"
                            >
                                <MenuItem value="pizza">Pizza</MenuItem>
                                <MenuItem value="soup">Soup</MenuItem>
                                <MenuItem value="sandwich">Sandwich</MenuItem>
                            </Select>

                            {fieldErrors.type !== undefined && (
                                <Typography variant="caption" color="error">
                                    {fieldErrors.type}
                                </Typography>
                            )}
                        </FormControl>
                        {state.type === "pizza" && (
                            <FormGroup>
                                <TextField
                                    fullWidth
                                    required
                                    name="no_of_slices"
                                    label="# of slices"
                                    type="number"
                                    value={state.no_of_slices}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    error={
                                        fieldErrors.no_of_slices !== undefined
                                    }
                                    helperText={fieldErrors.no_of_slices}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    name="diameter"
                                    label="Diameter"
                                    type="number"
                                    value={state.diameter}
                                    onChange={handleChange}
                                    margin="normal"
                                    variant="outlined"
                                    error={fieldErrors.diameter !== undefined}
                                    helperText={fieldErrors.diameter}
                                />
                            </FormGroup>
                        )}
                        {state.type === "soup" && (
                            <TextField
                                fullWidth
                                required
                                name="spiciness_scale"
                                label="Spiciness scale (1-10)"
                                type="number"
                                value={state.spiciness_scale}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                inputProps={{ min: 1, max: 10 }}
                                error={
                                    fieldErrors.spiciness_scale !== undefined
                                }
                                helperText={fieldErrors.spiciness_scale}
                            />
                        )}
                        {state.type === "sandwich" && (
                            <TextField
                                fullWidth
                                required
                                name="slices_of_bread"
                                label="# of slices of bread"
                                type="number"
                                value={state.slices_of_bread}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                error={
                                    fieldErrors.slices_of_bread !== undefined
                                }
                                helperText={fieldErrors.slices_of_bread}
                            />
                        )}
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
                                color="primary"
                                sx={{
                                    color: "rgb(255 ,70, 0)",
                                    border: "1px solid rgb(255 ,70, 0)",
                                }}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </main>
        </>
    );
}

export default Home;
