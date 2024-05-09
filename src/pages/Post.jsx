import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

function Post({ avatar, name, body, date_posted, file }) {

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex' }}>
                    <Avatar src={avatar} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', width: '100%' }}>
                        <Typography variant="subtitle1">{name}</Typography>
                        <Typography variant="caption" color='grey'>{date_posted}</Typography>
                    </Box>
                </Box>
                <Box sx={{ marginTop: '16px' }}>
                    <Typography variant="caption">{body}
                    </Typography>
                </Box>
                <img src={file} alt="" style={{ width: '100%', borderRadius: 2 }} />
            </CardContent>
        </Card>
    )
}

export default Post;