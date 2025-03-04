import { Button, TextField, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { useDispatch } from "react-redux";
// import { setEmployeeData, nextStep } from "../store/formSlice";
import { z } from 'zod';

const schema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  firstName: z.string().min(2, 'Name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Incorrect email'),
  dateBirthday: z.string(),
});

const EmployeeData = () => {
  //   const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = data => {
    // dispatch(setEmployeeData(data));
    // dispatch(nextStep());
    console.log(data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
          alignItems: 'stretch',
        width:{xs:'100%', sm:'80%', md:'70%', lg:'60%'},
        gap: 2,
          margin: '0 auto',
        padding: '10px 10px'
      }}
    >
      <TextField
        label="First name"
        {...register('firstName')}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        label="Last name"
        {...register('lastName')}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
      <TextField
        label="Date birthday"
        {...register('dateBirthday')}
        error={!!errors.dateBirthday}
        helperText={errors.dateBirthday?.message}
      />
      <TextField
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Button type="submit" variant="contained">
        Next
      </Button>
    </Box>
  );
};

export default EmployeeData;
