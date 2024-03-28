export const ListNumberOfEmployees = [
  '0 - 10',
  '11 - 50',
  '51 - 200',
  '201 - 500',
  '501 - 1000',
  '1000+',
];

export function generateRangeOfEmployeesFromANumber(number: number) {
  switch (number) {
    case 10: {
      return '0 - 10';
    }
    case 50: {
      return '11 - 50';
    }
    case 200: {
      return '51 - 200';
    }
    case 500: {
      return '201 - 500';
    }
    case 1000: {
      return '501 - 1000';
    }
    default:
      return '1000+';
  }
}
