import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection, Timestamp, onSnapshot } from 'firebase/firestore';
import firebaseApp from '../config/firebaseConfig'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Post from './Post';

function Home() {

    const [userProfile, setUserProfile] = useState({});
    const [body, setBody] = useState('');
    const [posts, setPosts] = useState([]);
    
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

        onSnapshot(collection(db, "posts"), snapshot => {
            setPosts(snapshot.docs.map((post) => (
                post.data()
            )));
        });
    }, []);

    const handleShare = () => {
        // Post data - avatar, name, date, body

        const postData = {
            avatar: 'https://cdn.nba.com/headshots/nba/latest/1040x760/445.png',
            name: userProfile.name,
            body: body,
            files: '',
            date: '',
        }

        try {
            addDoc(collection(db, "posts"), postData).then(() => {
                setBody('');
            });
        } catch (error) {
            console.log(error);
        }
        
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
                        <Button variant="contained" color='primary' sx={{ borderRadius: 6, p: 1, fontWeight: 'bold', marginTop: '16px', minWidth: '236px' }}>
                            POST
                        </Button>

                    </Grid>
                    <Grid item xs={12} md={9} padding={'16px'}>
                        <Box sx={{ backgroundColor: '#181818', marginBottom: '16px', borderRadius: 2, p: 2 }}>
                            <Box sx={{ display: 'flex' }}>
                                <Avatar sx={{ marginTop: '8px' }} src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png' />
                                <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', width: '100%' }}>
                                    <TextField
                                        onChange={(e) => {
                                            setBody(
                                                e.target.value
                                            )
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
                                        <Button size="small" sx={{ marginTop: '8px', width: '100px', fontWeight: 'bold', borderRadius: '24px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7e57c2" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                                <span style={{ marginLeft: '4px' }}>Files</span>
                                            </Box>
                                        </Button>
                                        <Button disabled={!body} onClick={handleShare} size="small" variant="contained" sx={{ marginTop: '8px', width: '100px', borderRadius: '24px' }}>Share</Button>
                                    </Box>
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