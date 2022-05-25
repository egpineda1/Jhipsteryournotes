package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Nota.
 */
@Entity
@Table(name = "nota")
public class Nota implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nota")
    private Double nota;

    @Size(max = 100)
    @Column(name = "observaciones", length = 100)
    private String observaciones;

    @JsonIgnoreProperties(value = { "nota", "reportes" }, allowSetters = true)
    @OneToOne(mappedBy = "nota")
    private Asignatura asignatura;

    @ManyToOne
    @JsonIgnoreProperties(value = { "reportes", "notas", "rol", "direccion", "sede" }, allowSetters = true)
    private Usuario usuario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Nota id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getNota() {
        return this.nota;
    }

    public Nota nota(Double nota) {
        this.setNota(nota);
        return this;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public String getObservaciones() {
        return this.observaciones;
    }

    public Nota observaciones(String observaciones) {
        this.setObservaciones(observaciones);
        return this;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Asignatura getAsignatura() {
        return this.asignatura;
    }

    public void setAsignatura(Asignatura asignatura) {
        if (this.asignatura != null) {
            this.asignatura.setNota(null);
        }
        if (asignatura != null) {
            asignatura.setNota(this);
        }
        this.asignatura = asignatura;
    }

    public Nota asignatura(Asignatura asignatura) {
        this.setAsignatura(asignatura);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Nota usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Nota)) {
            return false;
        }
        return id != null && id.equals(((Nota) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Nota{" +
            "id=" + getId() +
            ", nota=" + getNota() +
            ", observaciones='" + getObservaciones() + "'" +
            "}";
    }
}
