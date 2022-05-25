package co.edu.sena.repository;

import co.edu.sena.domain.Reporte;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface ReporteRepositoryWithBagRelationships {
    Optional<Reporte> fetchBagRelationships(Optional<Reporte> reporte);

    List<Reporte> fetchBagRelationships(List<Reporte> reportes);

    Page<Reporte> fetchBagRelationships(Page<Reporte> reportes);
}
