import { useState } from 'react';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import EmployeeData from './components/EmployeeData';
import DriverLicenseData from './components/DriverLicenseData';
import FamilyData from './components/FamilyData';
import FormSubmitted from './components/FormSubmitted'; 
import { useSelector } from 'react-redux';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const step = useSelector(state => state.form.step);

  
  if (isSubmitted) {
    return <FormSubmitted />;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <CssBaseline />
        {step === 1 && <EmployeeData />}
        {step === 2 && <DriverLicenseData />}
        {step === 3 && <FamilyData setIsSubmitted={setIsSubmitted} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
