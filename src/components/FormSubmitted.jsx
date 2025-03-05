import { Typography, Box } from '@mui/material';

const FormSubmitted = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" color="primary.dark">
        Форму успішно відправлено!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Дякуємо за заповнення форми. Можете закрити сторінку.
      </Typography>
    </Box>
  );
};

export default FormSubmitted;
