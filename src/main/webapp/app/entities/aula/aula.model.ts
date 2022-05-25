import { IReporte } from 'app/entities/reporte/reporte.model';

export interface IAula {
  id?: number;
  capacidadMaxima?: number | null;
  grado?: number | null;
  salon?: string | null;
  reportes?: IReporte[] | null;
}

export class Aula implements IAula {
  constructor(
    public id?: number,
    public capacidadMaxima?: number | null,
    public grado?: number | null,
    public salon?: string | null,
    public reportes?: IReporte[] | null
  ) {}
}

export function getAulaIdentifier(aula: IAula): number | undefined {
  return aula.id;
}
