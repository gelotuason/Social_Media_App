import { useState } from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function MenuButton({ logout, handleProfilePic }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                variant="contained"
                size="small"
                color="secondary"
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ borderRadius: 4, fontWeight: 'bold', minWidth: '60px' }}
            >
                Menu
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <label htmlFor="picture">
                    <MenuItem>Edit Profile Picture</MenuItem>
                </label>

                <MenuItem onClick={logout}>Logout</MenuItem>

                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="picture"
                    type="file"
                    onChange={(e) => {
                        handleProfilePic(e.target.files[0]);
                    }}
                />
            </Menu>
        </div>
    );
}

export default MenuButton;