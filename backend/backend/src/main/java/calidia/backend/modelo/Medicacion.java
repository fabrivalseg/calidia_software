package calidia.backend.modelo;

import calidia.backend.modelo.enums.TipoMedicacion;
import jakarta.persistence.*;

@Entity
@Table(name = "medicaciones")
public class Medicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String momento;
    private String hora;
    @Column(length = 50)
    private String cantidad;
    @Enumerated(EnumType.STRING)
    private TipoMedicacion tipo;
    @ManyToOne
    @JoinColumn(name = "dni_residente")
    private Residente residente;

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

    public Residente getResidente() {
        return residente;
    }

    public void setResidente(Residente residente) {
        this.residente = residente;
    }
}

