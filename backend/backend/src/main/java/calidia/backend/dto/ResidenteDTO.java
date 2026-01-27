package calidia.backend.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class ResidenteDTO {

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "\\d{7,10}", message = "El DNI debe contener solo números (7 a 10 dígitos)")
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50)
    private String apellido;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;

    @NotNull(message = "La fecha de ingreso es obligatoria")
    private LocalDate fechaIngreso;

    @NotBlank(message = "La obra social es obligatoria")
    private String obraSocial;

    private String medico;

    @Size(max = 5000, message = "El historial de patologías es demasiado extenso")
    private String patologias;

    private String medicacion;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    private String nombreFamiliar;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50)
    private String apellidoFamiliar;

    @Size(max = 100, message = "El parentesco de patologías es demasiado extenso")
    private String parentescoFamiliar;

    private String telefonoFamiliar;

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
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

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public String getObraSocial() {
        return obraSocial;
    }

    public void setObraSocial(String obraSocial) {
        this.obraSocial = obraSocial;
    }

    public String getMedico() {
        return medico;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public String getPatologias() {
        return patologias;
    }

    public void setPatologias(String patologias) {
        this.patologias = patologias;
    }

    public @NotBlank(message = "El nombre es obligatorio") @Size(min = 2, max = 50) String getNombreFamiliar() {
        return nombreFamiliar;
    }

    public void setNombreFamiliar(@NotBlank(message = "El nombre es obligatorio") @Size(min = 2, max = 50) String nombreFamiliar) {
        this.nombreFamiliar = nombreFamiliar;
    }

    public @NotBlank(message = "El apellido es obligatorio") @Size(min = 2, max = 50) String getApellidoFamiliar() {
        return apellidoFamiliar;
    }

    public void setApellidoFamiliar(@NotBlank(message = "El apellido es obligatorio") @Size(min = 2, max = 50) String apellidoFamiliar) {
        this.apellidoFamiliar = apellidoFamiliar;
    }

    public @Size(max = 100, message = "El parentesco de patologías es demasiado extenso") String getParentescoFamiliar() {
        return parentescoFamiliar;
    }

    public void setParentescoFamiliar(@Size(max = 100, message = "El parentesco de patologías es demasiado extenso") String parentescoFamiliar) {
        this.parentescoFamiliar = parentescoFamiliar;
    }

    public String getTelefonoFamiliar() {
        return telefonoFamiliar;
    }

    public void setTelefonoFamiliar(String telefonoFamiliar) {
        this.telefonoFamiliar = telefonoFamiliar;
    }

    public String getMedicacion() {
        return medicacion;
    }

    public void setMedicacion(String medicacion) {
        this.medicacion = medicacion;
    }
}

