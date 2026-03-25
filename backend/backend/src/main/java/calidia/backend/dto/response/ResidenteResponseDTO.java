package calidia.backend.dto.response;

import java.time.LocalDate;
import java.util.List;

public class ResidenteResponseDTO {

    private String dni;
    private String nombre;
    private String apellido;
    private LocalDate fechaNacimiento;
    private LocalDate fechaIngreso;
    private Integer edad;
    private String obraSocial;
    private String medico;
    private String patologias;
    private String medicacion;
    private FamiliarResponseDTO familiar;
    private List<FamiliarResponseDTO> familiares;

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

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
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

    public FamiliarResponseDTO getFamiliar() {
        return familiar;
    }

    public void setFamiliar(FamiliarResponseDTO familiar) {
        this.familiar = familiar;
    }

    public List<FamiliarResponseDTO> getFamiliares() {
        return familiares;
    }

    public void setFamiliares(List<FamiliarResponseDTO> familiares) {
        this.familiares = familiares;
    }

    public String getMedicacion() {
        return medicacion;
    }

    public void setMedicacion(String medicacion) {
        this.medicacion = medicacion;
    }
}

