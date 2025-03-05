import {
  Button,
  TextField,
  Box,
  FormControl,
  FormLabel,
  Typography,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setDriverLicense, nextStep } from '../redux/formSlice';
import { z } from 'zod';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const categories = ['A', 'B', 'C', 'D'];

const schema = z.object({
  licenses: z.array(
    z.object({
      id: z.string().default(() => crypto.randomUUID()),
      number: z.string().min(5, 'Номер занадто короткий').trim(),
      categories: z
        .array(z.enum(categories))
        .min(1, 'Виберіть хоча б одну категорію'),
      active: z.boolean(),
      applyDate: z.string(),
    })
  ),
});

const DriverLicenseData = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      licenses: [{ number: '', categories: [], active: true, applyDate: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'licenses',
  });

  const onSubmit = data => {
    console.log('Дані форми:', data);
    dispatch(setDriverLicense(data.licenses));
    dispatch(nextStep());
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
          variant="h4"
          textAlign="center"
          color="primary.dark"
          margin="20px 0"
        >
          Будь ласка заповніть дані про водійське посвідчення
        </Typography>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Номер посвідчення"
              {...register(`licenses.${index}.number`)}
              error={!!errors.licenses?.[index]?.number}
              helperText={errors.licenses?.[index]?.number?.message}
            />

            <FormControl>
              <FormLabel>Категорії транспортних засобів</FormLabel>
              <Controller
                name={`licenses.${index}.categories`}
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <Box>
                    {categories.map(category => (
                      <FormControlLabel
                        key={category}
                        control={
                          <Checkbox
                            checked={field.value.includes(category)}
                            onChange={e => {
                              const newValue = e.target.checked
                                ? [...field.value, category]
                                : field.value.filter(
                                    value => value !== category
                                  );
                              field.onChange(newValue);
                            }}
                          />
                        }
                        label={category}
                      />
                    ))}
                  </Box>
                )}
              />
              {errors.licenses?.[index]?.categories && (
                <Typography color="error" variant="body2">
                  {errors.licenses?.[index]?.categories?.message}
                </Typography>
              )}
            </FormControl>

            <Controller
              name={`licenses.${index}.applyDate`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Дата видачі"
                  disableFuture
                  format="DD-MM-YYYY"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={newValue =>
                    field.onChange(
                      newValue ? newValue.format('DD-MM-YYYY') : ''
                    )
                  }
                  slotProps={{
                    textField: {
                      error: !!errors.licenses?.[index]?.applyDate,
                      helperText: errors.licenses?.[index]?.applyDate?.message,
                    },
                  }}
                />
              )}
            />
            <FormControl>
              <FormLabel>Чи посвідчення активне?</FormLabel>
              <Controller
                name={`licenses.${index}.active`}
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? field.value.toString() : 'true'}
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

            {fields.length > 1 && (
              <Button type="button" onClick={() => remove(index)}>
                Видалити посвідчення
              </Button>
            )}
          </Box>
        ))}

        <Button
          type="button"
          onClick={() =>
            append({ number: '', categories: [], active: true, applyDate: '' })
          }
        >
          Додати ще посвідчення
        </Button>

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

export default DriverLicenseData;
