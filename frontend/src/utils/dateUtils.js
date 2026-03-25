export const getTodayLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateOnly = (dateValue) => {
  if (!dateValue) {
    return null;
  }

  if (dateValue instanceof Date) {
    return dateValue;
  }

  if (Array.isArray(dateValue) && dateValue.length >= 3) {
    const [year, month, day] = dateValue.map(Number);
    if (![year, month, day].some(Number.isNaN)) {
      return new Date(year, month - 1, day, 12, 0, 0);
    }
  }

  if (typeof dateValue === 'string') {
    const match = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = Number(match[1]);
      const month = Number(match[2]);
      const day = Number(match[3]);
      return new Date(year, month - 1, day, 12, 0, 0);
    }

    return new Date(dateValue);
  }

  return null;
};

export const formatDateEsAr = (dateString, options = {}) => {
  const parsedDate = parseDateOnly(dateString);

  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return dateString || '';
  }

  return parsedDate.toLocaleDateString('es-AR', options);
};

export const calculateAgeFromDate = (dateValue) => {
  const parsedDate = parseDateOnly(dateValue);
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - parsedDate.getFullYear();
  const mes = hoy.getMonth() - parsedDate.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < parsedDate.getDate())) {
    edad -= 1;
  }

  return edad;
};