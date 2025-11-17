export function validarPIN(pin) {
  // Debe ser exactamente 4 dígitos
  if (!/^\d{4}$/.test(pin)) return false;

  // No repetidos (1111, 4444, etc)
  if (/^(\d)\1{3}$/.test(pin)) return false;

  // No patrones como 4455 o 2233
  if (/(\d)\1(\d)\2/.test(pin)) return false;

  // Convertir el PIN en array de números
  const nums = pin.split("").map(Number);

  // Revisar secuencias ascendentes o descendentes
  let asc = true;
  let desc = true;

  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] !== 1) asc = false;
    if (nums[i] - nums[i + 1] !== 1) desc = false;
  }

  if (asc || desc) return false;

  return true;
}
