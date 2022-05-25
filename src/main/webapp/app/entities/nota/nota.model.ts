import { IAsignatura } from 'app/entities/asignatura/asignatura.model';
import { IUsuario } from 'app/entities/usuario/usuario.model';

export interface INota {
  id?: number;
  nota?: number | null;
  observaciones?: string | null;
  asignatura?: IAsignatura | null;
  usuario?: IUsuario | null;
}

export class Nota implements INota {
  constructor(
    public id?: number,
    public nota?: number | null,
    public observaciones?: string | null,
    public asignatura?: IAsignatura | null,
    public usuario?: IUsuario | null
  ) {}
}

export function getNotaIdentifier(nota: INota): number | undefined {
  return nota.id;
}
