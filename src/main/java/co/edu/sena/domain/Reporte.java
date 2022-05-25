package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Reporte.
 */
@Entity
@Table(name = "reporte")
public class Reporte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 30)
    @Column(name = "alerta", length = 30)
    private String alerta;

    @Column(name = "promedio_final")
    private Double promedioFinal;

    @Column(name = "promedio_parcial")
    private Double promedioParcial;

    @ManyToMany
    @JoinTable(
        name = "rel_reporte__asignatura",
        joinColumns = @JoinColumn(name = "reporte_id"),
        inverseJoinColumns = @JoinColumn(name = "asignatura_id")
    )
    @JsonIgnoreProperties(value = { "nota", "reportes" }, allowSetters = true)
    private Set<Asignatura> asignaturas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "reportes" }, allowSetters = true)
    private Aula aula;

    @ManyToOne
    @JsonIgnoreProperties(value = { "reportes", "notas", "rol", "direccion", "sede" }, allowSetters = true)
    private Usuario usuario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reporte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlerta() {
        return this.alerta;
    }

    public Reporte alerta(String alerta) {
        this.setAlerta(alerta);
        return this;
    }

    public void setAlerta(String alerta) {
        this.alerta = alerta;
    }

    public Double getPromedioFinal() {
        return this.promedioFinal;
    }

    public Reporte promedioFinal(Double promedioFinal) {
        this.setPromedioFinal(promedioFinal);
        return this;
    }

    public void setPromedioFinal(Double promedioFinal) {
        this.promedioFinal = promedioFinal;
    }

    public Double getPromedioParcial() {
        return this.promedioParcial;
    }

    public Reporte promedioParcial(Double promedioParcial) {
        this.setPromedioParcial(promedioParcial);
        return this;
    }

    public void setPromedioParcial(Double promedioParcial) {
        this.promedioParcial = promedioParcial;
    }

    public Set<Asignatura> getAsignaturas() {
        return this.asignaturas;
    }

    public void setAsignaturas(Set<Asignatura> asignaturas) {
        this.asignaturas = asignaturas;
    }

    public Reporte asignaturas(Set<Asignatura> asignaturas) {
        this.setAsignaturas(asignaturas);
        return this;
    }

    public Reporte addAsignatura(Asignatura asignatura) {
        this.asignaturas.add(asignatura);
        asignatura.getReportes().add(this);
        return this;
    }

    public Reporte removeAsignatura(Asignatura asignatura) {
        this.asignaturas.remove(asignatura);
        asignatura.getReportes().remove(this);
        return this;
    }

    public Aula getAula() {
        return this.aula;
    }

    public void setAula(Aula aula) {
        this.aula = aula;
    }

    public Reporte aula(Aula aula) {
        this.setAula(aula);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Reporte usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reporte)) {
            return false;
        }
        return id != null && id.equals(((Reporte) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reporte{" +
            "id=" + getId() +
            ", alerta='" + getAlerta() + "'" +
            ", promedioFinal=" + getPromedioFinal() +
            ", promedioParcial=" + getPromedioParcial() +
            "}";
    }
}
