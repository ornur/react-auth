import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux-hooks";
import { login } from "../slices/authSlice";
import { useForm } from "react-hook-form";

interface ILogin {
  phoneNumber: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value: string) => {
    value = value.replace(/\D/g, "");

    // Format the number according to the pattern +7(XXX) XXX-XX-XX
    if (value.length <= 1) {
      return `+7(${value}`;
    } else if (value.length <= 4) {
      return `+7(${value.substring(1, 4)}`;
    } else if (value.length <= 7) {
      return `+7(${value.substring(1, 4)}) ${value.substring(4, 7)}`;
    } else if (value.length <= 9) {
      return `+7(${value.substring(1, 4)}) ${value.substring(4, 7)}-${value.substring(7, 9)}`;
    } else {
      return `+7(${value.substring(1, 4)}) ${value.substring(4, 7)}-${value.substring(7, 9)}-${value.substring(9, 11)}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhoneNumber(e.target.value));
  };

  const {
    register,
    handleSubmit,
    formState: {errors}
    } = useForm<ILogin>();

  const handleLogin = async () => {
    if (phoneNumber && password) {
      setLoading(true);
      try {
        await dispatch(
          login({
            phoneNumber,
            password,
          })
        ).unwrap();
      } catch (e) {
        console.error(e);
      }
      finally {
        setLoading(false);
      }
    } else {
      console.error("Please enter a phone number and password");
    }
  };
  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Login</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              {...register("phoneNumber", {
                required: true,
                maxLength: 17,
                pattern: /^\+7\(\d{3}\) \d{3}-\d{2}-\d{2}/gs
              })}
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Phone Number"
              name="phoneNumber"
              autoFocus
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              error={errors?.phoneNumber ? true : false}
              helperText={errors?.phoneNumber?.type === "required" ? "Phone number is required" : 
                          errors?.phoneNumber?.type === "maxLength" ? "Phone number is too long" : 
                          errors?.phoneNumber?.type === "pattern" ? "The phone number can only be digits" : ""}
            />

            <TextField
              {...register("password", { 
                required: true,
                maxLength: 15,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/gs
              })}
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              error={errors?.password ? true : false}
              helperText={errors?.password?.type === "required" ? "Password is required" : 
                          errors?.password?.type === "maxLength" ? "Password is too long" : 
                          errors?.password?.type === "pattern" ? "Password must contain at least 8 characters, including letters and numbers" : ""}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit(handleLogin)}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Grid container justifyContent={"flex-end"}>
              <Grid item>
                <Link to="/register">Don't have an account? Register</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default Login;
