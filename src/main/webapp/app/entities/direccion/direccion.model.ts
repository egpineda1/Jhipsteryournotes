import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IDireccion {
  id?: number;
  barrio?: string | null;
  ciudad?: string | null;
  departamento?: string | null;
  numeracion?: string | null;
  usuarios?: IUsuario[] | null;
}

export class Direccion implements IDireccion {
  constructor(
    public id?: number,
    public barrio?: string | null,
    public ciudad?: string | null,
    public departamento?: string | null,
    public numeracion?: string | null,
    public usuarios?: IUsuario[] | null
  ) {}
}

export function getDireccionIdentifier(direccion: IDireccion): number | undefined {
  return direccion.id;
}
