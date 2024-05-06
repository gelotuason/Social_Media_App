import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Post({ name, body, date_posted }) {

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex' }}>
                    <Avatar src='https://cdn.nba.com/headshots/nba/latest/1040x760/445.png' />
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', width: '100%' }}>
                        <Typography variant="subtitle1">{name}</Typography>
                        <Typography variant="caption" color='grey'>{date_posted}</Typography>

                    </Box>
                </Box>
                <Box sx={{ marginTop: '16px' }}>
                    <Typography variant="caption">{body}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default Post;