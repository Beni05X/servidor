export function validarPIN(pin) {
  if (!/^\d{4}$/.test(pin)) return false;      // 4 dígitos
  if (/^(\d)\1{3}$/.test(pin)) return false;  // Repetidos tipo 1111
  if (/(\d)\1(\d)\2/.test(pin)) return false; // Patrones tipo 4455

  const nums = pin.split("").map(Number);
  let asc = true, desc = true;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] - nums[i] !== 1) asc = false;
    if (nums[i] - nums[i + 1] !== 1) desc = false;
  }
  if (asc || desc) return false;

  return true;
}

