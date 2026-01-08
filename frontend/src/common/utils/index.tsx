export const stylizeDate = (arg?: number | string | Date | null) => {
  if (!arg) {
    return "";
  } else if (typeof arg === "string" || typeof arg === "number") {
    arg = new Date(arg);
  }
  const year = arg.getFullYear();
  const month = `00${arg.getMonth() + 1}`.slice(-2);
  const date = `00${arg.getDate()}`.slice(-2);
  const hour = `00${arg.getHours()}`.slice(-2);
  const minute = `00${arg.getMinutes()}`.slice(-2);
  return `${year}/${month}/${date} ${hour}:${minute}`;
};

export const shortString = (arg?: string | null) => {
  if (!arg) {
    return "";
  } else if (arg?.split("").length > 10) {
    return `${arg.slice(0, 6)}...${arg.slice(-4)}`;
  }
  return arg;
};


export const formatNumber = (value: number): string  => {
  return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  }).format(value);
}