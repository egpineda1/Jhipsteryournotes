package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AsignaturaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Asignatura.class);
        Asignatura asignatura1 = new Asignatura();
        asignatura1.setId(1L);
        Asignatura asignatura2 = new Asignatura();
        asignatura2.setId(asignatura1.getId());
        assertThat(asignatura1).isEqualTo(asignatura2);
        asignatura2.setId(2L);
        assertThat(asignatura1).isNotEqualTo(asignatura2);
        asignatura1.setId(null);
        assertThat(asignatura1).isNotEqualTo(asignatura2);
    }
}
