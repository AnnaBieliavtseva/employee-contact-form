import {
  Button,
  TextField,
  Box,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  styled,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { z } from 'zod';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'react-redux';
import { nextStep, setEmployeeData } from '../redux/formSlice';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const schema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  firstName: z.string().min(2, "Ім'я занадто коротке").trim(),
  lastName: z.string().min(2, 'Прізвище занадто коротке').trim(),
  birthday: z.string({ required_error: "Обов'язкове поле" }),
  birthdayLocation: z.string().min(2, "Обов'язкове поле").trim(),
  phone: z
    .string()
    .regex(/^\d+$/, 'Будь ласка введіть правильний номер')
    .length(10, 'Номер телефону має 10 цифр'),
  nationality: z.string().min(2, "Обов'язкове поле").trim(),
  taxNumber: z.string().length(10, 'Ідентифікаційний код має 10 цифр'),
  hasCrime: z.boolean(),
  hasBankCredits: z.boolean(),
  photoUrl: z.string({ required_error: "Обов'язково завантажте фото" }),
});

const EmployeeData = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = data => {
    console.log(data);
    dispatch(setEmployeeData(data));
    dispatch(nextStep());
  };

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('photoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Будь ласка завантажте коректний файл зображення');
    }
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
          Будь ласка заповніть особисті дані
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
          label="Національність"
          {...register('nationality')}
          error={!!errors.nationality}
          helperText={errors.nationality?.message}
        />
        <TextField
          label="Ідентифікаційний код"
          {...register('taxNumber')}
          error={!!errors.taxNumber}
          helperText={errors.taxNumber?.message}
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
        <FormControl>
          <FormLabel sx={{ marginBottom: '15px', textAlign: 'center' }}>
            Завантажте свою фотографію
          </FormLabel>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ margin: '0 auto', width: { md: '50%' } }}
           
          >
            Завантажити файл
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </Button>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          sx={{ margin: '0 auto', width: { md: '50%' } }}
        >
          Підтвердити дані та перейти далі
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployeeData;
