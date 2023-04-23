import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack, Chip } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Typography from 'themes/overrides/Typography';
// import Logo from 'components/Logo';

// ==============================|| DRAWER HEADER ||============================== //

const DrawerHeader = ({ open }) => {
    const theme = useTheme();

    return (
        <DrawerHeaderStyled theme={theme} open={open}>
            <Stack direction="row" spacing={1} alignItems="center">
                <h3>Simple Accounting</h3>
            </Stack>
        </DrawerHeaderStyled>
    );
};

DrawerHeader.propTypes = {
    open: PropTypes.bool
};

export default DrawerHeader;
