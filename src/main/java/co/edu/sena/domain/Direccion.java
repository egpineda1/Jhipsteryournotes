package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Direccion.
 */
@Entity
@Table(name = "direccion")
public class Direccion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 30)
    @Column(name = "barrio", length = 30)
    private String barrio;

    @Size(max = 30)
    @Column(name = "ciudad", length = 30)
    private String ciudad;

    @Size(max = 25)
    @Column(name = "departamento", length = 25)
    private String departamento;

    @Size(max = 50)
    @Column(name = "numeracion", length = 50)
    private String numeracion;

    @OneToMany(mappedBy = "direccion")
    @JsonIgnoreProperties(value = { "reportes", "notas", "rol", "direccion", "sede" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Direccion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBarrio() {
        return this.barrio;
    }

    public Direccion barrio(String barrio) {
        this.setBarrio(barrio);
        return this;
    }

    public void setBarrio(String barrio) {
        this.barrio = barrio;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public Direccion ciudad(String ciudad) {
        this.setCiudad(ciudad);
        return this;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDepartamento() {
        return this.departamento;
    }

    public Direccion departamento(String departamento) {
        this.setDepartamento(departamento);
        return this;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getNumeracion() {
        return this.numeracion;
    }

    public Direccion numeracion(String numeracion) {
        this.setNumeracion(numeracion);
        return this;
    }

    public void setNumeracion(String numeracion) {
        this.numeracion = numeracion;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.setDireccion(null));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.setDireccion(this));
        }
        this.usuarios = usuarios;
    }

    public Direccion usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Direccion addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.setDireccion(this);
        return this;
    }

    public Direccion removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.setDireccion(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Direccion)) {
            return false;
        }
        return id != null && id.equals(((Direccion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Direccion{" +
            "id=" + getId() +
            ", barrio='" + getBarrio() + "'" +
            ", ciudad='" + getCiudad() + "'" +
            ", departamento='" + getDepartamento() + "'" +
            ", numeracion='" + getNumeracion() + "'" +
            "}";
    }
}
