package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Aula.
 */
@Entity
@Table(name = "aula")
public class Aula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "capacidad_maxima")
    private Float capacidadMaxima;

    @Column(name = "grado")
    private Float grado;

    @Size(max = 20)
    @Column(name = "salon", length = 20)
    private String salon;

    @OneToMany(mappedBy = "aula")
    @JsonIgnoreProperties(value = { "asignaturas", "aula", "usuario" }, allowSetters = true)
    private Set<Reporte> reportes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Aula id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getCapacidadMaxima() {
        return this.capacidadMaxima;
    }

    public Aula capacidadMaxima(Float capacidadMaxima) {
        this.setCapacidadMaxima(capacidadMaxima);
        return this;
    }

    public void setCapacidadMaxima(Float capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
    }

    public Float getGrado() {
        return this.grado;
    }

    public Aula grado(Float grado) {
        this.setGrado(grado);
        return this;
    }

    public void setGrado(Float grado) {
        this.grado = grado;
    }

    public String getSalon() {
        return this.salon;
    }

    public Aula salon(String salon) {
        this.setSalon(salon);
        return this;
    }

    public void setSalon(String salon) {
        this.salon = salon;
    }

    public Set<Reporte> getReportes() {
        return this.reportes;
    }

    public void setReportes(Set<Reporte> reportes) {
        if (this.reportes != null) {
            this.reportes.forEach(i -> i.setAula(null));
        }
        if (reportes != null) {
            reportes.forEach(i -> i.setAula(this));
        }
        this.reportes = reportes;
    }

    public Aula reportes(Set<Reporte> reportes) {
        this.setReportes(reportes);
        return this;
    }

    public Aula addReporte(Reporte reporte) {
        this.reportes.add(reporte);
        reporte.setAula(this);
        return this;
    }

    public Aula removeReporte(Reporte reporte) {
        this.reportes.remove(reporte);
        reporte.setAula(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Aula)) {
            return false;
        }
        return id != null && id.equals(((Aula) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Aula{" +
            "id=" + getId() +
            ", capacidadMaxima=" + getCapacidadMaxima() +
            ", grado=" + getGrado() +
            ", salon='" + getSalon() + "'" +
            "}";
    }
}
