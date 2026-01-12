/**
 * Password minimal 8 karakter, harus ada 1 Huruf Besar, 1 Huruf Kecil, dan 1 Angka
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;

/**
 * Validasi umum untuk No HP Indonesia (62 atau 08)
 */
export const PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
