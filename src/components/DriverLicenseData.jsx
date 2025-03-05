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
import { setDriverLicense, nextStep } from '../redux/formSlice';
import { z } from 'zod';

const schema = z.object({
  licenses: z.array(
    z.object({
        id: z.string().default(() => crypto.randomUUID()),
        // employeeId: z.null(),
      number: z.string().min(5, 'Номер занадто короткий'),
      category: z.string().min(1, 'Вкажіть категорію'),
      active: z.boolean(),
      applyDate: z.string(),
      expirationDate: z.string(),
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
      licenses: [
        {
          number: '',
          category: '',
          active: false,
          applyDate: '',
          expirationDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'licenses',
  });

  const onSubmit = data => {
    console.log(data);
    dispatch(setDriverLicense(data.licenses));
    dispatch(nextStep());
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
            label="Номер посвідчення"
            {...register(`licenses.${index}.number`)}
            error={!!errors.licenses?.[index]?.number}
            helperText={errors.licenses?.[index]?.number?.message}
          />
          <TextField
            label="Категорія"
            {...register(`licenses.${index}.category`)}
            error={!!errors.licenses?.[index]?.category}
            helperText={errors.licenses?.[index]?.category?.message}
          />
          <TextField
            label="Дата видачі"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register(`licenses.${index}.applyDate`)}
            error={!!errors.licenses?.[index]?.applyDate}
            helperText={errors.licenses?.[index]?.applyDate?.message}
          />
          <TextField
            label="Дійсне до"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register(`licenses.${index}.expirationDate`)}
            error={!!errors.licenses?.[index]?.expirationDate}
            helperText={errors.licenses?.[index]?.expirationDate?.message}
          />
          <Button type="button" onClick={() => remove(index)}>
            Видалити
          </Button>
        </Box>
      ))}
      <Button
        type="button"
        onClick={() =>
          append({
            number: '',
            category: '',
            active: false,
            applyDate: '',
            expirationDate: '',
          })
        }
      >
        Додати ще посвідчення
      </Button>
      <Button type="submit" variant="contained">
        Далі
      </Button>
    </Box>
  );
};

export default DriverLicenseData;
