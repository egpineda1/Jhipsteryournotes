import { INota } from 'app/entities/nota/nota.model';
import { IReporte } from 'app/entities/reporte/reporte.model';

export interface IAsignatura {
  id?: number;
  codeAsignatura?: number | null;
  asignatura?: string | null;
  nota?: INota | null;
  reportes?: IReporte[] | null;
}

export class Asignatura implements IAsignatura {
  constructor(
    public id?: number,
    public codeAsignatura?: number | null,
    public asignatura?: string | null,
    public nota?: INota | null,
    public reportes?: IReporte[] | null
  ) {}
}

export function getAsignaturaIdentifier(asignatura: IAsignatura): number | undefined {
  return asignatura.id;
}
