import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';
import Link from '@mui/material/Link';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from '../../config/firebaseConfig'
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';

function Authentication() {

    const [openModal, setOpenModal] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = getAuth(firebaseApp);
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setOpenModal(true);
        // setSignupError(false);
        // setSignupHelperText('');
    }
    const handleCloseModal = () => {
        setOpenModal(false);
        // setSigninError(false);
        // setSigninHelperText('');
    }

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // ...
                alert('Registered successfully!');
                navigate('/home');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
                console.log(errorCode);
                //auth/email-already-in-use
                //auth/invalid-email
                //auth/missing-password
            });

    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                navigate('/home');
                alert('You are signed in!');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                // setSigninError(true);
                // setSigninHelperText('Incorrect/missing entry.');
            });


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
    };

    return (
        <Container maxWidth='lg'>
            <Grid container spacing={8} minHeight='100vh'>
                <Grid item md={6} display='flex' justifyContent="center" alignItems="center">
                    <Box>
                        <Typography variant='h1' sx={{ fontWeight: 'bold' }}>Welcome!</Typography>
                    </Box>
                </Grid>
                <Grid item md={6} display="flex" alignItems="center">
                    <Grid item md={12} >
                        <Box>
                            <Typography variant='h4' marginBottom={'12px'} color='#e0e0e0' sx={{ fontWeight: 'bold', marginBottom: '24px' }}>Join us today.</Typography>
                        </Box>
                        <Box component='form' noValidate autoComplete='off' sx={{ width: '100%' }}>
                            <TextField
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                // error={nameError}
                                label="Name"
                                type='text'
                                fullWidth
                                sx={{ marginBottom: '6px' }}
                            />
                            {/* {
                                nameError ? <FormHelperText sx={{ marginLeft: '16px', marginBottom: '16px', color: 'red' }}>Incorrect/missing entry.</FormHelperText> : null
                            } */}

                            <TextField
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                // error={emailError}
                                // helperText={'Incorrect/missing entry.'}
                                label="Email"
                                type='email'
                                fullWidth
                                sx={{ marginBottom: '6px' }}
                            />
                            <TextField
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                // error={passError}
                                // helperText={'Incorrect/missing entry.'}
                                label="Password"
                                type="password"
                                fullWidth
                                sx={{ marginBottom: '6px' }}
                            />
                            <TextField
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                                // error={conpassError}
                                // helperText={'Incorrect/missing entry.'}
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                sx={{ marginBottom: '6px' }}
                            />
                            <Button
                                onClick={handleSignUp}
                                variant="contained"
                                color='primary'
                                sx={{ borderRadius: 6, p: 1, fontWeight: 'bold' }}
                                fullWidth
                            >
                                Sign up
                            </Button>
                        </Box>
                        <Divider sx={{ marginTop: '24px', marginBottom: '24px' }}>or</Divider>
                        <Typography variant='h6' marginBottom={'12px'} color='#e0e0e0' sx={{ fontWeight: 'bold', marginBottom: '16px' }}>
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
                            <Box component='form' autoComplete='off' sx={style}>
                                <Typography id="modal-modal-title" variant="h4" sx={{ fontWeight: 'bold', marginBottom: '24px' }}>
                                    Sign in your account
                                </Typography>
                                <TextField
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    value={email}
                                    // error={signinError}
                                    // helperText={'Incorrect/missing entry.'}
                                    label="Email"
                                    type='email'
                                    fullWidth
                                    sx={{ marginBottom: '16px' }}
                                />
                                <TextField
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    value={password}
                                    // error={signinError}
                                    // helperText={'Incorrect/missing entry.'}
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    sx={{ marginBottom: '24px' }}
                                />
                                <Button
                                    onClick={handleSignIn}
                                    variant="contained"
                                    color='primary'
                                    sx={{ borderRadius: 6, p: 1, fontWeight: 'bold', marginBottom: '24px' }}
                                    fullWidth
                                >
                                    Sign in
                                </Button>
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
        </Container >
    )
}

export default Authentication;