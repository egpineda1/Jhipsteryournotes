package co.edu.sena.repository;

import co.edu.sena.domain.Reporte;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class ReporteRepositoryWithBagRelationshipsImpl implements ReporteRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Reporte> fetchBagRelationships(Optional<Reporte> reporte) {
        return reporte.map(this::fetchAsignaturas);
    }

    @Override
    public Page<Reporte> fetchBagRelationships(Page<Reporte> reportes) {
        return new PageImpl<>(fetchBagRelationships(reportes.getContent()), reportes.getPageable(), reportes.getTotalElements());
    }

    @Override
    public List<Reporte> fetchBagRelationships(List<Reporte> reportes) {
        return Optional.of(reportes).map(this::fetchAsignaturas).orElse(Collections.emptyList());
    }

    Reporte fetchAsignaturas(Reporte result) {
        return entityManager
            .createQuery("select reporte from Reporte reporte left join fetch reporte.asignaturas where reporte is :reporte", Reporte.class)
            .setParameter("reporte", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Reporte> fetchAsignaturas(List<Reporte> reportes) {
        return entityManager
            .createQuery(
                "select distinct reporte from Reporte reporte left join fetch reporte.asignaturas where reporte in :reportes",
                Reporte.class
            )
            .setParameter("reportes", reportes)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
