import { IReporte } from 'app/entities/reporte/reporte.model';
import { INota } from 'app/entities/nota/nota.model';
import { IRol } from 'app/entities/rol/rol.model';
import { IDireccion } from 'app/entities/direccion/direccion.model';
import { ISede } from 'app/entities/sede/sede.model';

export interface IUsuario {
  id?: number;
  apellido?: string | null;
  codigo?: string | null;
  correo?: string | null;
  edad?: number | null;
  genero?: string | null;
  identificacion?: string | null;
  nombre?: string | null;
  telefono?: string | null;
  reportes?: IReporte[] | null;
  notas?: INota[] | null;
  rol?: IRol | null;
  direccion?: IDireccion | null;
  sede?: ISede | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public apellido?: string | null,
    public codigo?: string | null,
    public correo?: string | null,
    public edad?: number | null,
    public genero?: string | null,
    public identificacion?: string | null,
    public nombre?: string | null,
    public telefono?: string | null,
    public reportes?: IReporte[] | null,
    public notas?: INota[] | null,
    public rol?: IRol | null,
    public direccion?: IDireccion | null,
    public sede?: ISede | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
