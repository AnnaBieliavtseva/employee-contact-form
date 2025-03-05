import {
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setFamily,  submitForm } from '../redux/formSlice';
import { z } from 'zod';

const schema = z.object({
  familyMembers: z.array(
    z.object({
      firstName: z.string().min(2, "Ім'я занадто коротке"),
      lastName: z.string().min(2, 'Прізвище занадто коротке'),
      birthday: z.string(),
      birthdayLocation: z.string(),
      phone: z.string(),
      additionalInfo: z.string(),
      hasCrime: z.boolean(),
      hasBankCredits: z.boolean(),
      isMilitary: z.boolean(),
      status: z.string(),
      type: z.string().optional(),
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
          status: '',
          type: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'familyMembers',
  });

  const onSubmit = data => {
    console.log(data);
    dispatch(setFamily(data.familyMembers));
    dispatch(submitForm());
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
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
          <TextField
            label="Дата народження"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register(`familyMembers.${index}.birthday`)}
            error={!!errors.familyMembers?.[index]?.birthday}
            helperText={errors.familyMembers?.[index]?.birthday?.message}
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
            label="Телефон"
            {...register(`familyMembers.${index}.phone`)}
            error={!!errors.familyMembers?.[index]?.phone}
            helperText={errors.familyMembers?.[index]?.phone?.message}
          />
          <TextField
            label="Додаткова інформація"
            {...register(`familyMembers.${index}.additionalInfo`)}
            error={!!errors.familyMembers?.[index]?.additionalInfo}
            helperText={errors.familyMembers?.[index]?.additionalInfo?.message}
          />
          <FormControl>
            <InputLabel>Статус</InputLabel>
            <Select
              {...register(`familyMembers.${index}.status`)}
              error={!!errors.familyMembers?.[index]?.status}
            >
              <MenuItem value="active">Активний</MenuItem>
              <MenuItem value="inactive">Неактивний</MenuItem>
              <MenuItem value="not-alive">Неживий</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Тип військових</InputLabel>
            <Select
              {...register(`familyMembers.${index}.type`)}
              error={!!errors.familyMembers?.[index]?.type}
            >
              <MenuItem value="ARMY">Армія</MenuItem>
              <MenuItem value="POLICE">Поліція</MenuItem>
              <MenuItem value="BOARD_FORCES">Прикордонні війська</MenuItem>
              <MenuItem value="MARINE_FORCES">Морські сили</MenuItem>
              <MenuItem value="AIR_FORCES">Повітряні сили</MenuItem>
            </Select>
          </FormControl>
          <Button type="button" onClick={() => remove(index)}>
            Видалити
          </Button>
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
            status: '',
            type: '',
          })
        }
      >
        Додати ще члена сім'ї
      </Button>
      <Button type="submit" variant="contained">
        Завершити
      </Button>
    </Box>
  );
};

export default FamilyData;
