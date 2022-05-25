import { IAsignatura } from 'app/entities/asignatura/asignatura.model';
import { IAula } from 'app/entities/aula/aula.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface IReporte {
  id?: number;
  alerta?: string | null;
  promedioFinal?: number | null;
  promedioParcial?: number | null;
  asignaturas?: IAsignatura[] | null;
  aula?: IAula | null;
  usuario?: IUsuario | null;
}

export class Reporte implements IReporte {
  constructor(
    public id?: number,
    public alerta?: string | null,
    public promedioFinal?: number | null,
    public promedioParcial?: number | null,
    public asignaturas?: IAsignatura[] | null,
    public aula?: IAula | null,
    public usuario?: IUsuario | null
  ) {}
}

export function getReporteIdentifier(reporte: IReporte): number | undefined {
  return reporte.id;
}
