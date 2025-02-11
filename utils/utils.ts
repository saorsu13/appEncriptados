export const determineType = (id) => {
  if (/^(26|27|28|29|30|31|32)\d{4,}$/.test(id)) {
    return "physical";
  } else if (/^(78|79|80)\d{4,}$/.test(id)) {
    return "electronic";
  } else {
    return false;
  }
};

export const formatNumber = (number) => {
  const floatNumber = parseFloat(number);
  if (isNaN(floatNumber)) {
    return "";
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(floatNumber);
};
