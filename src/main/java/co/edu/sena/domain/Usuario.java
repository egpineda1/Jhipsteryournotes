package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Usuario.
 */
@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Size(max = 50)
    @Column(name = "apellido", length = 50)
    private String apellido;

    @Size(max = 20)
    @Column(name = "codigo", length = 20)
    private String codigo;

    @Size(max = 60)
    @Column(name = "correo", length = 60)
    private String correo;

    @Column(name = "edad")
    private Float edad;

    @Size(max = 1)
    @Column(name = "genero", length = 1)
    private String genero;

    @Size(max = 12)
    @Column(name = "identificacion", length = 12)
    private String identificacion;

    @Size(max = 50)
    @Column(name = "nombre", length = 50)
    private String nombre;

    @Size(max = 12)
    @Column(name = "telefono", length = 12)
    private String telefono;

    @OneToMany(mappedBy = "usuario")
    @JsonIgnoreProperties(value = { "asignaturas", "aula", "usuario" }, allowSetters = true)
    private Set<Reporte> reportes = new HashSet<>();

    @OneToMany(mappedBy = "usuario")
    @JsonIgnoreProperties(value = { "asignatura", "usuario" }, allowSetters = true)
    private Set<Nota> notas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "usuarios" }, allowSetters = true)
    private Rol rol;

    @ManyToOne
    @JsonIgnoreProperties(value = { "usuarios" }, allowSetters = true)
    private Direccion direccion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "usuarios" }, allowSetters = true)
    private Sede sede;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Usuario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Usuario apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCodigo() {
        return this.codigo;
    }

    public Usuario codigo(String codigo) {
        this.setCodigo(codigo);
        return this;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getCorreo() {
        return this.correo;
    }

    public Usuario correo(String correo) {
        this.setCorreo(correo);
        return this;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public Float getEdad() {
        return this.edad;
    }

    public Usuario edad(Float edad) {
        this.setEdad(edad);
        return this;
    }

    public void setEdad(Float edad) {
        this.edad = edad;
    }

    public String getGenero() {
        return this.genero;
    }

    public Usuario genero(String genero) {
        this.setGenero(genero);
        return this;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getIdentificacion() {
        return this.identificacion;
    }

    public Usuario identificacion(String identificacion) {
        this.setIdentificacion(identificacion);
        return this;
    }

    public void setIdentificacion(String identificacion) {
        this.identificacion = identificacion;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Usuario nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public Usuario telefono(String telefono) {
        this.setTelefono(telefono);
        return this;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Set<Reporte> getReportes() {
        return this.reportes;
    }

    public void setReportes(Set<Reporte> reportes) {
        if (this.reportes != null) {
            this.reportes.forEach(i -> i.setUsuario(null));
        }
        if (reportes != null) {
            reportes.forEach(i -> i.setUsuario(this));
        }
        this.reportes = reportes;
    }

    public Usuario reportes(Set<Reporte> reportes) {
        this.setReportes(reportes);
        return this;
    }

    public Usuario addReporte(Reporte reporte) {
        this.reportes.add(reporte);
        reporte.setUsuario(this);
        return this;
    }

    public Usuario removeReporte(Reporte reporte) {
        this.reportes.remove(reporte);
        reporte.setUsuario(null);
        return this;
    }

    public Set<Nota> getNotas() {
        return this.notas;
    }

    public void setNotas(Set<Nota> notas) {
        if (this.notas != null) {
            this.notas.forEach(i -> i.setUsuario(null));
        }
        if (notas != null) {
            notas.forEach(i -> i.setUsuario(this));
        }
        this.notas = notas;
    }

    public Usuario notas(Set<Nota> notas) {
        this.setNotas(notas);
        return this;
    }

    public Usuario addNota(Nota nota) {
        this.notas.add(nota);
        nota.setUsuario(this);
        return this;
    }

    public Usuario removeNota(Nota nota) {
        this.notas.remove(nota);
        nota.setUsuario(null);
        return this;
    }

    public Rol getRol() {
        return this.rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Usuario rol(Rol rol) {
        this.setRol(rol);
        return this;
    }

    public Direccion getDireccion() {
        return this.direccion;
    }

    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }

    public Usuario direccion(Direccion direccion) {
        this.setDireccion(direccion);
        return this;
    }

    public Sede getSede() {
        return this.sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    public Usuario sede(Sede sede) {
        this.setSede(sede);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return id != null && id.equals(((Usuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", apellido='" + getApellido() + "'" +
            ", codigo='" + getCodigo() + "'" +
            ", correo='" + getCorreo() + "'" +
            ", edad=" + getEdad() +
            ", genero='" + getGenero() + "'" +
            ", identificacion='" + getIdentificacion() + "'" +
            ", nombre='" + getNombre() + "'" +
            ", telefono='" + getTelefono() + "'" +
            "}";
    }
}
