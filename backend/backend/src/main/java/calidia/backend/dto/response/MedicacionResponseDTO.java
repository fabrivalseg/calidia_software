package calidia.backend.dto.response;

import calidia.backend.modelo.enums.TipoMedicacion;

public class MedicacionResponseDTO {

    private Long id;
    private String nombre;
    private String momento;
    private String hora;
    private String cantidad;
    private TipoMedicacion tipo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getCantidad() {
        return cantidad;
    }

    public void setCantidad(String cantidad) {
        this.cantidad = cantidad;
    }

    public TipoMedicacion getTipo() {
        return tipo;
    }

    public void setTipo(TipoMedicacion tipo) {
        this.tipo = tipo;
    }
}

