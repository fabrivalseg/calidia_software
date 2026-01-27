package calidia.backend.dto;

import java.time.LocalDate;

public class HistorialDTO {
    private String residenteDni;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String turno;

    public String getResidenteDni() {
        return residenteDni;
    }

    public void setResidenteDni(String residenteDni) {
        this.residenteDni = residenteDni;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }
}
