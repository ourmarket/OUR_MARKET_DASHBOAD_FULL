function formatK(value, locale = "es-AR") {
  if (value < 1000) return value.toString();

  const formatted = (value / 1000).toFixed(2);

  return (
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(formatted) + "K"
  );
}
export default formatK;