import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseApp from '../../config/firebaseConfig'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Link from '@mui/material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import dayjs from 'dayjs';
import * as Yup from 'yup';

function Authentication() {

    const [openModal, setOpenModal] = useState(false);

    const [date, setDate] = useState(dayjs(new Date()));
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthDate: date
    });
    const [signinData, setSigninData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({});
    const [signinErrors, setSigninErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
        setErrors('');
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setSigninErrors('');
    }

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required'),
        email: Yup.string()
            .required('Email is required')
            .email('Invalid email format'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm password is required'),
        birthDate: Yup.date()
            .required('Birth date is required')
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setUserData({
            ...userData,
            [name]: value
        });
    }

    const handleSigninChange = (e) => {
        const { name, value } = e.target;

        setSigninData({
            ...signinData,
            [name]: value
        });
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await validationSchema.validate(userData, { abortEarly: false });
            createUserWithEmailAndPassword(auth, userData.email, userData.password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    // ...
                    updateProfile(auth.currentUser, {
                        displayName: userData.name,
                    });

                    setUserData({
                        name: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        birthDate: date
                    });

                    alert('Registered successfully!');
                    
                    setLoading(false);

                    handleOpenModal();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..

                    if (errorCode == 'auth/email-already-in-use') {
                        setErrors({
                            ...errors,
                            email: 'Email already in use'
                        })
                    }

                    setLoading(false);
                });

        } catch (error) {
            const newErrors = {}

            error.inner.forEach(err => {
                newErrors[err.path] = err.message
            });

            setErrors(newErrors);
            setLoading(false);
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            signInWithEmailAndPassword(auth, signinData.email, signinData.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    // ...
                    setLoading(false);
                    navigate('/home');
                    alert('You are signed in!');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    if (errorCode == 'auth/invalid-credential') {
                        setSigninErrors('');
                        alert('Incorrect email or password');
                    }

                    if (errorCode == 'auth/missing-password') {
                        setSigninErrors({
                            ...signinErrors,
                            password: 'Invalid password'
                        })
                    }

                    if (errorCode == 'auth/invalid-email') {
                        setSigninErrors({
                            ...signinErrors,
                            email: 'Invalid email'
                        })
                    }

                    if (errorCode == 'auth/too-many-requests') {
                        alert('Too many requests. Please try again later.');
                    }
                    setLoading(false);
                });
        } catch (error) {
            setLoading(false);
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: 24,
        p: 4,
        '& > :not(style)': {
            marginBottom: '12px',
        },
        width: '480px'
    };

    return (
        <Container maxWidth='lg'>
            <Grid container spacing={8} padding={'8px'} minHeight='100vh'>
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                        <Typography variant='h2' color='secondary' sx={{ fontWeight: 'bold', position: 'absolute', marginLeft: '8px' }}>Everybody talks.</Typography>
                        <img
                            src={'https://images.unsplash.com/photo-1528642474498-1af0c17fd8c3?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                            alt={'People'}
                            loading="lazy"
                            style={{ minWidth: '445px', maxWidth: '100%', height: 'auto', borderRadius: 6 }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} display="flex" alignItems="center">
                    <Grid item xs={12}>
                        <Box>
                            <Typography variant='h4' color='primary' sx={{ fontWeight: 'bold', marginBottom: '8px' }}>Join us today.</Typography>
                        </Box>
                        <Box
                            onSubmit={handleSignUp}
                            component='form'
                            autoComplete='off'
                            sx={{
                                '& > :not(style)': {
                                    marginBottom: '12px',
                                },
                                width: '100%'
                            }}
                        >
                            <Box>
                                <TextField
                                    onChange={handleChange}
                                    name='name'
                                    value={userData.name}
                                    label="Name"
                                    type='text'
                                    fullWidth
                                />
                                {errors.name && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{errors.name}</Typography>}
                            </Box>
                            <Box>
                                <TextField
                                    onChange={handleChange}
                                    name='email'
                                    value={userData.email}
                                    label="Email"
                                    type='email'
                                    fullWidth
                                />
                                {errors.email && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{errors.email}</Typography>}
                            </Box>
                            <Box>
                                <TextField
                                    onChange={handleChange}
                                    name='password'
                                    value={userData.password}
                                    label="Password"
                                    type="password"
                                    fullWidth
                                />
                                {errors.password && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{errors.password}</Typography>}
                            </Box>
                            <Box>
                                <TextField
                                    onChange={handleChange}
                                    name='confirmPassword'
                                    value={userData.confirmPassword}
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                />
                                {errors.confirmPassword && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{errors.confirmPassword}</Typography>}
                            </Box>
                            <Box>
                                <DatePicker
                                    onChange={(newValue) => {
                                        setUserData({
                                            ...userData,
                                            birthDate: newValue.format('MM/DD/YYYY')
                                        });
                                    }}
                                    name='birthDate'
                                    value={date}
                                    label='Birth Date'
                                    fullWidth
                                />
                                {errors.birthDate && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{errors.birthDate}</Typography>}
                            </Box>
                            <LoadingButton
                                loading={loading}
                                type='submit'
                                variant="contained"
                                color='primary'
                                sx={{ marginTop: '4px', borderRadius: 6, p: 1, fontWeight: 'bold' }}
                                fullWidth
                            >
                                Sign up
                            </LoadingButton>
                        </Box>

                        <Divider sx={{ marginTop: '16px', marginBottom: '16px' }}>or</Divider>

                        <Typography variant='h6' color='#e0e0e0' sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
                            Already have an account?
                        </Typography>
                        <Button
                            onClick={handleOpenModal}
                            variant="outlined"
                            color='primary'
                            sx={{ borderRadius: 6, p: 1, fontWeight: 'bold' }}
                            fullWidth
                        >
                            Sign in
                        </Button>

                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box onSubmit={handleSignIn} component='form' autoComplete='off' sx={style}>
                                <Typography id="modal-modal-title" variant="h4" sx={{ fontWeight: 'bold', marginBottom: '24px' }}>
                                    Sign in your account
                                </Typography>
                                <Box>
                                    <TextField
                                        onChange={handleSigninChange}
                                        name='email'
                                        value={signinData.email}
                                        label="Email"
                                        type='email'
                                        fullWidth
                                    />
                                    {signinErrors.email && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{signinErrors.email}</Typography>}
                                </Box>
                                <Box>
                                    <TextField
                                        onChange={handleSigninChange}
                                        name='password'
                                        value={signinData.password}
                                        label="Password"
                                        type="password"
                                        fullWidth
                                    />
                                    {signinErrors.password && <Typography variant='subtitle2' sx={{ marginLeft: '8px', marginBottom: '12px', color: 'red' }}>{signinErrors.password}</Typography>}
                                </Box>
                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
                                    color='primary'
                                    type='submit'
                                    sx={{ marginTop: '16px', borderRadius: 6, p: 1, fontWeight: 'bold' }}
                                    fullWidth
                                >
                                    Sign in
                                </LoadingButton>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'light' }}>
                                    Don't have an account?
                                    <Link marginLeft='4px' onClick={handleCloseModal} underline="hover" color='inherit' sx={{ fontWeight: 'bold' }}>
                                        Sign up.
                                    </Link>
                                </Typography>
                            </Box>
                        </Modal>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Authentication;