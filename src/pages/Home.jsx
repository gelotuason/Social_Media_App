import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
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

function Home() {

    const [userProfile, setUserProfile] = useState({});
    const [body, setBody] = useState('');
    const [postFile, setPostFile] = useState('');
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(false);

    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                // ...
                setUserProfile({
                    name: user.displayName,
                    email: user.email
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

    const getFileData = async (postFile) => {
        if (
            postFile.name.includes('png') ||
            postFile.name.includes('jpg') ||
            postFile.name.includes('jpeg') ||
            postFile.name.includes('PNG') ||
            postFile.name.includes('JPG') ||
            postFile.name.includes('JPEG')
        ) {
            const reader = new FileReader();

            reader.readAsDataURL(postFile);

            reader.onload = () => {
                document.querySelector('#postFile').src = reader.result;
            }
        }
    }

    const handleShare = async () => {
        setLoading(true);

        const postData = {
            avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/445.png',
            name: userProfile.name,
            body: body,
            file: '',
            date_posted: Timestamp.now()
        }

        // Uploading file to storage
        const storage = getStorage();
        const storageRef = ref(storage, `${userProfile.name}/images/${postFile.name}`);
        const snapshot = await uploadBytes(storageRef, postFile);
        const url = await getDownloadURL(snapshot.ref);
        postData.file = url;

        try {
            addDoc(collection(db, "posts"), postData).then(() => {
                setBody('');
                postData.file = '';
                setPostFile('');
                document.querySelector('#postFile').src = '';
            });

            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate('/');
        })
    }

    return (
        <Container maxWidth='lg'>
            <Box sx={{ p: '8px' }}>
                <Grid container>
                    <Grid item xs={12} padding={'16px'}>
                        <Grid item xs={12} sx={{ display: 'flex' }}>
                            <Avatar src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png' />
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '16px' }}>
                                <Typography variant='subtitle1'>{userProfile.name}</Typography>
                                <Typography variant='subtitle2'>{userProfile.email}</Typography>
                            </Box>
                        </Grid>
                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            color='primary'
                            size="small"
                            sx={{ borderRadius: 6, p: 1, fontWeight: 'bold', marginTop: '16px', minWidth: '236px' }}
                        >
                            Logout
                        </Button>

                    </Grid>
                    <Grid item xs={12} md={9} padding={'16px'}>
                        <Box sx={{ backgroundColor: '#181818', marginBottom: '16px', borderRadius: 2, p: 2 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Avatar sx={{ marginTop: '8px' }} src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png' />
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', width: '100%' }}>
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
                                    <Box
                                        display='flex'
                                        justifyContent='space-between'
                                    >
                                        <label htmlFor="file">
                                            <Button component='span' variant="outlined" size="small" sx={{ marginTop: '8px', width: '100px', fontWeight: 'bold', borderRadius: '24px' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                    <span style={{ marginLeft: '4px' }}>Photo</span>
                                                </Box>
                                            </Button>

                                        </label>

                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="file"
                                            type="file"
                                            onChange={(e) => {
                                                getFileData(e.target.files[0]);
                                                setPostFile(e.target.files[0]);
                                            }}
                                        />
                                        <LoadingButton disabled={!body && !postFile} loading={loading} onClick={handleShare} size="small" variant="contained" sx={{ marginTop: '8px', width: '100px', borderRadius: '24px' }}>Share</LoadingButton>
                                    </Box>
                                    <img id="postFile" src="" alt="" loading="lazy" style={{ width: '320px', height: 'auto', marginTop: '8px', borderRadius: '16px' }} />
                                </Box>
                            </Box>
                        </Box>
                        <Grid container sx={{ backgroundColor: '#181818', borderRadius: 2, p: 2, gap: 1 }}>
                            {
                                posts.map((post) => (
                                    <Post
                                        key={post.id}
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
                        <Box sx={{ backgroundColor: '#181818', borderRadius: 2, p: 2 }}>
                            <Typography variant='h5'>Follow other users</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Home;