import { Outlet } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function Layout() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Outlet />
        </LocalizationProvider>
    )
}

export default Layout;