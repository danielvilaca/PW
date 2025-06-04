export function temAcessoAdminOuSenhorio(perfil) {
  return perfil?.role === 'admin' || perfil?.role === 'senhorio';
}
export function isAdmin(perfil) {
  return perfil?.role === 'admin';
}
export function isSenhorio(perfil) {
  return perfil?.role === 'senhorio';
}
export function isInquilino(perfil) {
  return perfil?.role === 'inquilino';
}