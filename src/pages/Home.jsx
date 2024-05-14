import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getFirestore, addDoc, collection, Timestamp, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from '../config/firebaseConfig'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Post from './Post';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuButton from "./components/MenuButton";
import Link from '@mui/material/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

function Home() {

    const [userProfile, setUserProfile] = useState({});
    const [body, setBody] = useState('');
    const [postFile, setPostFile] = useState({});
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(false);

    const postData = {
        avatar: userProfile.photo,
        name: userProfile.name,
        body: body,
        file: '',
        date_posted: Timestamp.now()
    }

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();
    const storage = getStorage();

    useEffect(() => {

        setPostFile('');

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                // ...
                setUserProfile({
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL
                });
            } else {
                // User is signed out
                // ...
                navigate('/');
            }
        });

        onSnapshot(collection(db, 'posts'), snapshot => {
            const newPosts = [];

            snapshot.forEach(post => {
                newPosts.push(post.data());
            });

            newPosts.sort((a, b) => b.date_posted - a.date_posted);

            setPosts(newPosts);
        })
    }, []);

    const previewFile = async (file) => {
        if (
            file.name.includes('png') ||
            file.name.includes('jpg') ||
            file.name.includes('jpeg') ||
            file.name.includes('PNG') ||
            file.name.includes('JPG') ||
            file.name.includes('JPEG')
        ) {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                document.querySelector('#postFile').src = reader.result;
            }
        }
    }

    const handleProfilePic = async (file) => {
        // Uploading file to storage
        const storageRef = ref(storage, `${userProfile.name}/profilePic/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);

        const url = await getDownloadURL(snapshot.ref);

        updateProfile(auth.currentUser, {
            photoURL: url
        });
    }

    const handleShare = async () => {
        setLoading(true);

        // handle files
        const storageRef = ref(storage, `${userProfile.name}/images/${postFile.name}`);
        const snapshot = await uploadBytes(storageRef, postFile);

        const url = await getDownloadURL(snapshot.ref);

        postData.file = url;

        // add post
        try {
            addDoc(collection(db, "posts"), postData)
                .then(() => {
                    setBody('');
                    postData.file = '';
                    setPostFile('');
                    document.querySelector('#postFile').src = '';
                });

            setLoading(false);

        } catch (error) {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        setLoading(true);
        signOut(auth).then(() => {
            // Sign-out successful.
            setLoading(false);
            navigate('/');
        })
    }

    return (
        <Container maxWidth='lg'>
            <Box sx={{ p: '8px' }}>
                <Grid container>
                    <Grid item xs={12} padding={'16px'}>
                        <Grid item>
                            <Box sx={{ boxShadow: 2, p: '8px 16px', borderRadius: 4, border: '1px solid #000000', width: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Avatar sx={{ alignSelf: 'center' }} src={userProfile.photo} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
                                            <Typography variant='subtitle1'>{userProfile.name}</Typography>
                                            <Typography variant='subtitle2'>{userProfile.email}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ alignSelf: 'center', p: '12px' }}>
                                        <MenuButton
                                            logout={handleLogout}
                                            handleProfilePic={handleProfilePic}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} md={9} padding={'16px'}>
                        <Box sx={{ backgroundColor: '#181818', marginBottom: '16px', borderRadius: 2, p: 2, boxShadow: 6 }}>
                            <Grid item>
                                <Grid container>
                                    <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
                                        <Avatar sx={{marginRight: '8px', display: { xs: 'none', md: 'block' } }} src={userProfile.photo} />
                                        <TextField
                                            onChange={(e) => {
                                                setBody(e.target.value);
                                            }}
                                            value={body}
                                            multiline
                                            placeholder="Share your thoughts.."
                                            maxRows={4}
                                            InputProps={{
                                                sx: { borderRadius: '20px' }
                                            }}
                                            fullWidth
                                        />

                                        <Box>
                                            <label htmlFor="file">
                                                <Button disableRipple component='span' size="small" sx={{
                                                    '&:hover': { backgroundColor: 'inherit', color: 'inherit' }
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                </Button>
                                            </label>
                                            <input
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                id="file"
                                                type="file"
                                                onChange={(e) => {
                                                    previewFile(e.target.files[0]);
                                                    setPostFile(e.target.files[0]);
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <img id="postFile" src="" alt="" loading="lazy" style={{ width: '100%', height: 'auto', marginTop: '8px', borderRadius: '16px' }} />
                            <LoadingButton
                                disabled={!body && !postFile}
                                loading={loading}
                                onClick={handleShare}
                                size="small"
                                variant="contained"
                                sx={{ marginTop: '8px', borderRadius: '24px' }}
                                fullWidth
                            >
                                Share
                            </LoadingButton>
                        </Box>
                        <Grid container sx={{ backgroundColor: '#181818', borderRadius: 2, p: 2, gap: 1, boxShadow: 6 }}>
                            {
                                posts.map((post) => (
                                    <Post
                                        key={post.id}
                                        avatar={post.avatar}
                                        name={post.name}
                                        body={post.body}
                                        date_posted={post.date_posted.toDate().toString()}
                                        file={post.file}
                                    >
                                    </Post>
                                ))
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs padding={'16px'}>
                        <Box>
                            <Typography color='#bdbdbd' variant='subtitle2'>Developed by Ferangelo Tuason</Typography>
                            <Typography color='#bdbdbd' variant='caption'>© 2024 <strong>Talks.</strong></Typography>

                            <Box gap={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Link href="https://www.linkedin.com/in/ferangelo-tuason/" target="_blank">
                                    <FontAwesomeIcon icon={faLinkedinIn} />
                                </Link>

                                <Link href="https://github.com/gelotuason" target="_blank">
                                    <FontAwesomeIcon icon={faGithub} />
                                </Link>

                                <Link href="mailto:gelotuason@gmail.com" target="_blank">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </Link>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Home;