import { useState } from 'react';
import { Container, CssBaseline } from '@mui/material';
import EmployeeData from './components/EmployeeData';
import DriverLicenseData from './components/DriverLicenseData';
import FamilyData from './components/FamilyData';
import FormSubmitted from './components/FormSubmitted'; 
import { useSelector } from 'react-redux';

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const step = useSelector(state => state.form.step);

  
  if (isSubmitted) {
    return <FormSubmitted />;
  }

  return (
    <Container>
      <CssBaseline />
      {step === 1 && <EmployeeData />}
      {step === 2 && <DriverLicenseData />}
      {step === 3 && <FamilyData setIsSubmitted={setIsSubmitted} />}
    </Container>
  );
}

export default App;
