import {
  Button,
  TextField,
  Box,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Typography,
  InputAdornment,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setFamily, submitForm } from '../redux/formSlice';
import dayjs from 'dayjs';
import { z } from 'zod';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import toast from 'react-hot-toast';

const categories = [
  'ARMY',
  'POLICE',
  'BOARD_FORCES',
  'MARINE_FORCES',
  'AIR_FORCES',
];

const militaryTypeTranslations = {
  ARMY: 'Армія',
  POLICE: 'Поліція',
  BOARD_FORCES: 'Прикордонні війська',
  MARINE_FORCES: 'Морські сили',
  AIR_FORCES: 'Повітряні сили',
};

const familyTypes = [
  'Mother',
  'Father',
  'Brother',
  'Sister',
  'Son',
  'Daughter',
  'Wife',
];

const familyTypeTranslations = {
  Mother: 'Мати',
  Father: 'Батько',
  Brother: 'Брат',
  Sister: 'Сестра',
  Son: 'Син',
  Daughter: 'Донька',
  Wife: 'Дружина',
};

const familyStatuses = ['active', 'inactive', 'not-alive'];

const familyStatusTranslations = {
  active: 'Активний',
  inactive: 'Неактивний',
  'not-alive': 'Неживий',
};

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
      additionalInfo: z.string().optional(),
      hasCrime: z.boolean(),
      hasBankCredits: z.boolean(),
      isMilitary: z.boolean(),
      militaryType: z.array(z.enum(categories)).optional(),
      familyType: z.enum(familyTypes),
      familyStatus: z.enum(familyStatuses),
    })
  ),
});

const FamilyData = ({ setIsSubmitted }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      familyMembers: [
        {
          firstName: '',
          lastName: '',
          birthday: '',
          birthdayLocation: '',
          phone: '',
          additionalInfo: '',
          hasCrime: false,
          hasBankCredits: false,
          isMilitary: false,
          militaryType: [],
          familyType: 'Mother',
          familyStatus: 'active',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const onSubmit = data => {
    console.log('Дані форми:', data);
    dispatch(setFamily(data.familyMembers));
    dispatch(submitForm());
    toast('Дякуємо! Форму успішно відправлено. Можете закрити сторінку.');

    setIsSubmitted(true);
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
          Будь ласка заповніть дані членів сім'ї
        </Typography>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Ім'я"
              {...register(`familyMembers.${index}.firstName`)}
              error={!!errors.familyMembers?.[index]?.firstName}
              helperText={errors.familyMembers?.[index]?.firstName?.message}
            />
            <TextField
              label="Прізвище"
              {...register(`familyMembers.${index}.lastName`)}
              error={!!errors.familyMembers?.[index]?.lastName}
              helperText={errors.familyMembers?.[index]?.lastName?.message}
            />
            <Controller
              name={`familyMembers.${index}.birthday`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Дата народження"
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
                      error: !!errors.familyMembers?.[index]?.birthday,
                      helperText:
                        errors.familyMembers?.[index]?.birthday?.message,
                    },
                  }}
                />
              )}
            />
            <TextField
              label="Місце народження"
              {...register(`familyMembers.${index}.birthdayLocation`)}
              error={!!errors.familyMembers?.[index]?.birthdayLocation}
              helperText={
                errors.familyMembers?.[index]?.birthdayLocation?.message
              }
            />
            <TextField
              label="Номер телефону"
              {...register(`familyMembers.${index}.phone`)}
              error={!!errors.familyMembers?.[index]?.phone}
              helperText={errors.familyMembers?.[index]?.phone?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+38</InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="Додаткова інформація"
              {...register(`familyMembers.${index}.additionalInfo`)}
              error={!!errors.familyMembers?.[index]?.additionalInfo}
              helperText={
                errors.familyMembers?.[index]?.additionalInfo?.message
              }
            />

            <FormControl>
              <FormLabel>Ступінь спорідненості</FormLabel>
              <Controller
                name={`familyMembers.${index}.familyType`}
                control={control}
                defaultValue="Mother"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Ступінь спорідненості"
                    error={!!errors.familyMembers?.[index]?.familyType}
                  >
                    {familyTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {familyTypeTranslations[type]}{' '}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Сімейний статус</FormLabel>
              <Controller
                name={`familyMembers.${index}.familyStatus`}
                control={control}
                defaultValue="active"
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Сімейний статус"
                    error={!!errors.familyMembers?.[index]?.familyStatus}
                  >
                    {familyStatuses.map(status => (
                      <MenuItem key={status} value={status}>
                        {familyStatusTranslations[status]}{' '}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Чи має судимості?</FormLabel>
              <Controller
                name={`familyMembers.${index}.hasCrime`}
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
              <FormLabel>Чи має кредити?</FormLabel>
              <Controller
                name={`familyMembers.${index}.hasBankCredits`}
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
              <FormLabel>Чи є військовослужбовцем?</FormLabel>
              <Controller
                name={`familyMembers.${index}.isMilitary`}
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
              <FormLabel>Виберіть тип військ</FormLabel>
              <Controller
                name={`familyMembers.${index}.militaryType`}
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
                        label={militaryTypeTranslations[category]}
                      />
                    ))}
                  </Box>
                )}
              />
              {errors.familyMembers?.[index]?.militaryType && (
                <Typography color="error" variant="body2">
                  {errors.familyMembers?.[index]?.militaryType?.message}
                </Typography>
              )}
            </FormControl>

            {fields.length > 1 && (
              <Button type="button" onClick={() => remove(index)}>
                Видалити члена сім'ї
              </Button>
            )}
          </Box>
        ))}

        <Button
          type="button"
          onClick={() =>
            append({
              firstName: '',
              lastName: '',
              birthday: '',
              birthdayLocation: '',
              phone: '',
              additionalInfo: '',
              hasCrime: false,
              hasBankCredits: false,
              isMilitary: false,
              militaryType: [],
              familyType: 'Mother',
              familyStatus: 'active',
            })
          }
        >
          Додати ще члена сім'ї
        </Button>

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
