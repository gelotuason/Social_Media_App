import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

function Home() {
    return (
        <Container maxWidth='2xl'>
            <Box sx={{ flexGrow: 1, p: 4 }}>
                <Grid container>
                    <Grid item md padding={4}>
                        <Typography variant='h5'></Typography>
                        <ListItem alignItems='flex-start'>
                            <ListItemAvatar>
                                <Avatar src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png'></Avatar>

                            </ListItemAvatar>
                            <Box>
                                <Typography variant='subtitle1'>Gelo</Typography>
                                <Typography variant='subtitle2'>gelotuason@gmail.com</Typography>
                            </Box>
                        </ListItem>
                        <Button variant="contained" color='primary' sx={{ borderRadius: 6, p: 1, fontWeight: 'bold', marginTop: '16px' }} fullWidth>
                            POST
                        </Button>
                    </Grid>
                    <Grid item md={7} padding={4}>
                        {/* <Typography variant='h4'>Share something..</Typography> */}
                        <Box sx={{ border: '1px solid #424242', borderRadius: 2, p: 2 }}>
                            {/* <ListItem alignItems='flex-start'>
                                <ListItemAvatar>
                                    <Avatar src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png'></Avatar>
                                </ListItemAvatar>
                                <Typography variant='h5'>What's on your mind?</Typography>
                            </ListItem> */}
                        </Box>
                    </Grid>
                    <Grid md padding={4}>
                        <Box sx={{ border: '1px solid #424242', borderRadius: 2, p: 2 }} fullWidth>
                            <Typography variant='h5'>Follow other users</Typography>
                            {/* <Typography variant='subtitle1'>Connect.</Typography> */}
                            {/* <ListItem alignItems='flex-start'>
                                <ListItemAvatar>
                                    <Avatar src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png'></Avatar>
                                </ListItemAvatar>
                                <Typography variant='h5'>What's on your mind?</Typography>
                            </ListItem> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

export default Home;