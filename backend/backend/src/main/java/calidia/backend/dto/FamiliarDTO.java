package calidia.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FamiliarDTO {

    @NotBlank(message = "El nombre del familiar es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre del familiar debe tener entre 2 y 50 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido del familiar es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido del familiar debe tener entre 2 y 50 caracteres")
    private String apellido;

    @NotBlank(message = "El parentesco del familiar es obligatorio")
    @Size(max = 100, message = "El parentesco es demasiado extenso")
    private String parentesco;

    @NotBlank(message = "El telefono del familiar es obligatorio")
    @Pattern(regexp = "^\\+?[0-9\\s\\-]{7,20}$", message = "El telefono del familiar debe tener un formato valido")
    private String telefono;

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

    public String getParentesco() {
        return parentesco;
    }

    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}