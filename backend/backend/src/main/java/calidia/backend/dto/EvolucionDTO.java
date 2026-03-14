package calidia.backend.dto;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalTime;

public class EvolucionDTO {

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;

    @NotNull(message = "La hora es obligatoria")
    private LocalTime hora;

    @NotBlank(message = "Los signos vitales son obligatorios")
    @Size(max = 255, message = "Los signos vitales no deben superar los 255 caracteres")
    private String signosVitales;

    @NotBlank(message = "El detalle de la evolución es obligatorio")
    @Size(max = 2000, message = "La evolución no debe superar los 2000 caracteres")
    private String evolucion;

    @Size(max = 1000, message = "Las notas no pueden superar los 1000 caracteres")
    private String notas;

    @NotBlank(message = "El turno es obligatorio")
    @Pattern(regexp = "^(?i)(Mañana|Manana|Tarde|Noche)$", message = "El turno debe ser Manana, Tarde o Noche")
    private String turno;

    @NotBlank(message = "El DNI del residente es obligatorio")
    @Pattern(regexp = "\\d{7,10}", message = "El DNI debe tener formato válido")
    private String dniResidente;

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public String getSignosVitales() {
        return signosVitales;
    }

    public void setSignosVitales(String signosVitales) {
        this.signosVitales = signosVitales;
    }

    public String getEvolucion() {
        return evolucion;
    }

    public void setEvolucion(String evolucion) {
        this.evolucion = evolucion;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getDniResidente() {
        return dniResidente;
    }

    public void setDniResidente(String dniResidente) {
        this.dniResidente = dniResidente;
    }


}

