package co.edu.sena.repository;

import co.edu.sena.domain.Asignatura;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Asignatura entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AsignaturaRepository extends JpaRepository<Asignatura, Long> {}
