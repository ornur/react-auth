import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import { registerSlice } from "../slices/authSlice";
import { useForm } from "react-hook-form";

interface IRegister {
  name: string;
  phoneNumber: string;
  password: string;
}

const Register = () => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegister>();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (name && phoneNumber && password) {
      try {
        await dispatch(
          registerSlice({
            name,
            phoneNumber,
            password,
          })
        ).unwrap();
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("Please enter a name, email, and password");
    }
  };

  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("name", { 
                    required: true,
                    maxLength: 50,
                    pattern: /^[a-zA-Z\s]*$/i
                  })}
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error = {errors.name ? true : false}
                  helperText = {errors?.name?.type === "required" ? "Name is required" : 
                                errors?.name?.type === "maxLength" ? "Name is too long" :
                                errors?.name?.type === "pattern" ? "Name can only contain letters" : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register("phoneNumber", {
                    required: true,
                    maxLength: 15,
                    pattern: /^\+7\(\d{3}\) \d{3}-\d{2}-\d{2}/gs
                  })}
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error = {errors.phoneNumber ? true : false}
                  helperText = {errors?.phoneNumber?.type === "required" ? "Phone number is required" : 
                                errors?.phoneNumber?.type === "maxLength" ? "Phone number is too long" :
                                errors?.phoneNumber?.type === "pattern" ? "The phone number can only be digits" : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password", {
                    required: true,
                    maxLength: 15,
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gs
                  })}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error = {errors.password ? true : false}
                  helperText = {errors?.password?.type === "required" ? "Password is required" : 
                                errors?.password?.type === "maxLength" ? "Password is too long" :
                                errors?.password?.type === "pattern" ? "Password must contain at least 8 characters, including letters and numbers" : ""}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit(handleRegister)}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">Already have an account? Login</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;
