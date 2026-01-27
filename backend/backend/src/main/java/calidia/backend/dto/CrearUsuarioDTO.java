package calidia.backend.dto;

import calidia.backend.modelo.enums.Rol;
import jakarta.validation.constraints.*;

public class CrearUsuarioDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    private String telefono;

    @NotNull
    private Rol rol;

    @NotBlank
    private String password;



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
