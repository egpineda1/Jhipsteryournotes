package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Sede.
 */
@Entity
@Table(name = "sede")
public class Sede implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 80)
    @Column(name = "correo_sede", length = 80)
    private String correoSede;

    @Size(max = 50)
    @Column(name = "direccio_sede", length = 50)
    private String direccioSede;

    @Size(max = 30)
    @Column(name = "nombre_sede", length = 30)
    private String nombreSede;

    @Size(max = 20)
    @Column(name = "telefono_sede", length = 20)
    private String telefonoSede;

    @OneToMany(mappedBy = "sede")
    @JsonIgnoreProperties(value = { "reportes", "notas", "rol", "direccion", "sede" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sede id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCorreoSede() {
        return this.correoSede;
    }

    public Sede correoSede(String correoSede) {
        this.setCorreoSede(correoSede);
        return this;
    }

    public void setCorreoSede(String correoSede) {
        this.correoSede = correoSede;
    }

    public String getDireccioSede() {
        return this.direccioSede;
    }

    public Sede direccioSede(String direccioSede) {
        this.setDireccioSede(direccioSede);
        return this;
    }

    public void setDireccioSede(String direccioSede) {
        this.direccioSede = direccioSede;
    }

    public String getNombreSede() {
        return this.nombreSede;
    }

    public Sede nombreSede(String nombreSede) {
        this.setNombreSede(nombreSede);
        return this;
    }

    public void setNombreSede(String nombreSede) {
        this.nombreSede = nombreSede;
    }

    public String getTelefonoSede() {
        return this.telefonoSede;
    }

    public Sede telefonoSede(String telefonoSede) {
        this.setTelefonoSede(telefonoSede);
        return this;
    }

    public void setTelefonoSede(String telefonoSede) {
        this.telefonoSede = telefonoSede;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.setSede(null));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.setSede(this));
        }
        this.usuarios = usuarios;
    }

    public Sede usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Sede addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.setSede(this);
        return this;
    }

    public Sede removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.setSede(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sede)) {
            return false;
        }
        return id != null && id.equals(((Sede) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sede{" +
            "id=" + getId() +
            ", correoSede='" + getCorreoSede() + "'" +
            ", direccioSede='" + getDireccioSede() + "'" +
            ", nombreSede='" + getNombreSede() + "'" +
            ", telefonoSede='" + getTelefonoSede() + "'" +
            "}";
    }
}
