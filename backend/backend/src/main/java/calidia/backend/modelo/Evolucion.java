package calidia.backend.modelo;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "evoluciones")
public class Evolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private LocalTime hora;

    @Column(name = "signos_vitales")
    private String signosVitales;

    @Column(columnDefinition = "TEXT")
    private String evolucion;

    private String notas;
    private String turno;

    @ManyToOne
    @JoinColumn(name = "dni_residente")
    private Residente residente;

    @ManyToOne
    @JoinColumn(name = "email_usuario")
    private Usuario usuario;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Residente getResidente() {
        return residente;
    }

    public void setResidente(Residente residente) {
        this.residente = residente;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "Evolucion{" +
                "id=" + id +
                ", fecha=" + fecha +
                ", hora=" + hora +
                ", signosVitales='" + signosVitales + '\'' +
                ", evolucion='" + evolucion + '\'' +
                ", notas='" + notas + '\'' +
                ", turno='" + turno + '\'' +
                ", residente=" + residente +
                ", usuario=" + usuario +
                '}';
    }
}

