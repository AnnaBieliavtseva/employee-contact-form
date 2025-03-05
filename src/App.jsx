import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import './App.css';
import EmployeeData from './components/EmployeeData';
import { useSelector } from 'react-redux';
import DriverLicenseData from './components/DriverLicenseData';
import FamilyData from './components/FamilyData';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const step = useSelector(state => state.form.step);
  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <CssBaseline />

        <>
          {step === 1 && <EmployeeData />}
          {step === 2 && <DriverLicenseData />}
          {step === 3 && <FamilyData />}
        </>
      </Container>
    </ThemeProvider>
  );
}

export default App;
