import {
  Button,
  TextField,
  Box,
  InputLabel,
  FormControl,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { useForm,  Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setFamily, submitForm } from '../redux/formSlice';
import dayjs from 'dayjs';
import { z } from 'zod';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

const schema = z.object({
  familyMembers: z.array(
    z.object({
      id: z.string().default(() => crypto.randomUUID()),
      firstName: z.string().min(2, "Ім'я занадто коротке").trim(),
      lastName: z.string().min(2, 'Прізвище занадто коротке').trim(),
      birthday: z.string({ required_error: "Обов'язкове поле" }),
      birthdayLocation: z.string().min(2, "Обов'язкове поле").trim(),
      phone: z
        .string()
        .regex(/^\d+$/, 'Будь ласка введіть правильний номер')
        .length(10, 'Номер телефону має 10 цифр'),
      additionalInfo: z.string(),
      hasCrime: z.boolean(),
      hasBankCredits: z.boolean(),
    })
  ),
});

const FamilyData = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

 
  const onSubmit = data => {
    console.log(data);
    dispatch(setFamily(data.familyMembers));
    dispatch(submitForm());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: { xs: '100%', sm: '80%', md: '70%', lg: '60%' },
          gap: 2,
          margin: '0 auto',
          padding: '20px 20px',
          border: '1px solid gray',
        }}
      >
        <Typography
          variant="h3"
          textAlign="center"
          color="primary.dark"
          margin="20px 0"
        >
          Будь ласка заповніть дані про членів сім'ї
        </Typography>
        <TextField
          label="Ім'я"
          {...register('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField
          label="Прізвище"
          {...register('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Дата народження"
              disableFuture
              format="DD-MM-YYYY"
              value={field.value ? dayjs(field.value) : null}
              onChange={newValue =>
                field.onChange(newValue ? newValue.format('DD-MM-YYYY') : '')
              }
              slotProps={{
                textField: {
                  error: !!errors.birthday,
                  helperText: errors.birthday?.message,
                },
              }}
            />
          )}
        />
        <TextField
          label="Місце народження"
          {...register('birthdayLocation')}
          error={!!errors.birthdayLocation}
          helperText={errors.birthdayLocation?.message}
        />
        <TextField
          label="Номер телефону"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">+38</InputAdornment>
              ),
            },
          }}
        />
        <TextField
          label="Додаткова інфоормація"
          {...register('additionalInfo')}
          error={!!errors.additionalInfo}
          helperText={errors.additionalInfo?.message}
        />

        <FormControl>
          <FormLabel>Чи маєте судимості?</FormLabel>
          <Controller
            name="hasCrime"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                value={field.value ? field.value.toString() : 'false'}
                onChange={event =>
                  field.onChange(event.target.value === 'true')
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Так"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Ні"
                />
              </RadioGroup>
            )}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Чи маєте кредити?</FormLabel>
          <Controller
            name="hasBankCredits"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <RadioGroup
                value={field.value ? field.value.toString() : 'false'}
                onChange={event =>
                  field.onChange(event.target.value === 'true')
                }
              >
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  label="Так"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  label="Ні"
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ margin: '0 auto', width: { md: '50%' } }}
        >
          Відправити всі дані
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default FamilyData;
