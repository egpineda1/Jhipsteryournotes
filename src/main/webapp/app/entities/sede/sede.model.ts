import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface ISede {
  id?: number;
  correoSede?: string | null;
  direccioSede?: string | null;
  nombreSede?: string | null;
  telefonoSede?: string | null;
  usuarios?: IUsuario[] | null;
}

export class Sede implements ISede {
  constructor(
    public id?: number,
    public correoSede?: string | null,
    public direccioSede?: string | null,
    public nombreSede?: string | null,
    public telefonoSede?: string | null,
    public usuarios?: IUsuario[] | null
  ) {}
}

export function getSedeIdentifier(sede: ISede): number | undefined {
  return sede.id;
}
