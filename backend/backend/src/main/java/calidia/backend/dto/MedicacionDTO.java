package calidia.backend.dto;

import calidia.backend.modelo.enums.TipoMedicacion;
import jakarta.validation.constraints.*;

public class MedicacionDTO {

    @NotBlank(message = "El nombre del medicamento es obligatorio")
    @Size(max = 100, message = "El nombre es demasiado largo")
    private String nombre;

    @NotBlank(message = "El momento de la toma es obligatorio")
    private String momento; // Ej: "Almuerzo"

    @NotBlank(message = "La hora es obligatoria")

    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "La hora debe tener formato HH:mm")
    private String hora;

    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a 0")
    @Max(value = 100, message = "Verifique la cantidad, parece excesiva")
    private Integer cantidad;

    @NotNull(message = "El tipo de medicación es obligatorio")
    private TipoMedicacion tipo;

    @NotBlank(message = "El DNI del residente es obligatorio")
    private String dniResidente;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMomento() {
        return momento;
    }

    public void setMomento(String momento) {
        this.momento = momento;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }


    public TipoMedicacion getTipo() {
        return tipo;
    }

    public void setTipo(TipoMedicacion tipo) {
        this.tipo = tipo;
    }

    public String getDniResidente() {
        return dniResidente;
    }

    public void setDniResidente(String dniResidente) {
        this.dniResidente = dniResidente;
    }
}

