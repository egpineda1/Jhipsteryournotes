import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IRol {
  id?: number;
  descripcion?: string | null;
  usuarios?: IUsuario[] | null;
}

export class Rol implements IRol {
  constructor(public id?: number, public descripcion?: string | null, public usuarios?: IUsuario[] | null) {}
}

export function getRolIdentifier(rol: IRol): number | undefined {
  return rol.id;
}
