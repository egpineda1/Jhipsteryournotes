package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Asignatura.
 */
@Entity
@Table(name = "asignatura")
public class Asignatura implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code_asignatura")
    private Float codeAsignatura;

    @Size(max = 40)
    @Column(name = "asignatura", length = 40)
    private String asignatura;

    @JsonIgnoreProperties(value = { "asignatura", "usuario" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Nota nota;

    @ManyToMany(mappedBy = "asignaturas")
    @JsonIgnoreProperties(value = { "asignaturas", "aula", "usuario" }, allowSetters = true)
    private Set<Reporte> reportes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Asignatura id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getCodeAsignatura() {
        return this.codeAsignatura;
    }

    public Asignatura codeAsignatura(Float codeAsignatura) {
        this.setCodeAsignatura(codeAsignatura);
        return this;
    }

    public void setCodeAsignatura(Float codeAsignatura) {
        this.codeAsignatura = codeAsignatura;
    }

    public String getAsignatura() {
        return this.asignatura;
    }

    public Asignatura asignatura(String asignatura) {
        this.setAsignatura(asignatura);
        return this;
    }

    public void setAsignatura(String asignatura) {
        this.asignatura = asignatura;
    }

    public Nota getNota() {
        return this.nota;
    }

    public void setNota(Nota nota) {
        this.nota = nota;
    }

    public Asignatura nota(Nota nota) {
        this.setNota(nota);
        return this;
    }

    public Set<Reporte> getReportes() {
        return this.reportes;
    }

    public void setReportes(Set<Reporte> reportes) {
        if (this.reportes != null) {
            this.reportes.forEach(i -> i.removeAsignatura(this));
        }
        if (reportes != null) {
            reportes.forEach(i -> i.addAsignatura(this));
        }
        this.reportes = reportes;
    }

    public Asignatura reportes(Set<Reporte> reportes) {
        this.setReportes(reportes);
        return this;
    }

    public Asignatura addReporte(Reporte reporte) {
        this.reportes.add(reporte);
        reporte.getAsignaturas().add(this);
        return this;
    }

    public Asignatura removeReporte(Reporte reporte) {
        this.reportes.remove(reporte);
        reporte.getAsignaturas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Asignatura)) {
            return false;
        }
        return id != null && id.equals(((Asignatura) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Asignatura{" +
            "id=" + getId() +
            ", codeAsignatura=" + getCodeAsignatura() +
            ", asignatura='" + getAsignatura() + "'" +
            "}";
    }
}
