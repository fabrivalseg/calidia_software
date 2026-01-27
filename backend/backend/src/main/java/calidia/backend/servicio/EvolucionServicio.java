package calidia.backend.servicio;

import calidia.backend.dto.EvolucionDTO;
import calidia.backend.dto.HistorialDTO;
import calidia.backend.dto.PaginacionDTO;
import calidia.backend.excepcion.ResourceNotFoundException;
import calidia.backend.modelo.Evolucion;
import calidia.backend.modelo.Residente;
import calidia.backend.modelo.Usuario;
import calidia.backend.repositorio.EvolucionRepositorio;
import calidia.backend.repositorio.ResidenteRepositorio;
import calidia.backend.repositorio.UsuarioRepositorio;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


@Service
public class EvolucionServicio {

    private final EvolucionRepositorio evolucionRepositorio;
    private final ResidenteRepositorio residenteRepositorio;
    private final UsuarioRepositorio usuarioRepositorio;
    private final UsuarioServicio usuarioServicio;

    public EvolucionServicio(EvolucionRepositorio evolucionRepositorio,
                             ResidenteRepositorio residenteRepositorio,
                             UsuarioRepositorio usuarioRepositorio,
                             UsuarioServicio usuarioServicio
    ) {
        this.evolucionRepositorio = evolucionRepositorio;
        this.residenteRepositorio = residenteRepositorio;
        this.usuarioRepositorio = usuarioRepositorio;
        this.usuarioServicio = usuarioServicio;
    }

    public Evolucion registrarEvolucion(EvolucionDTO dto) {

        Residente residente = residenteRepositorio.findById(dto.getDniResidente())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Residente no encontrado"));

        Usuario usuario = usuarioServicio.obtenerUsuarioActual();

        Evolucion evolucion = new Evolucion();
        evolucion.setFecha(dto.getFecha());
        evolucion.setHora(dto.getHora());
        evolucion.setSignosVitales(dto.getSignosVitales());
        evolucion.setEvolucion(dto.getEvolucion());
        evolucion.setNotas(dto.getNotas());
        evolucion.setTurno(dto.getTurno());
        evolucion.setResidente(residente);
        evolucion.setUsuario(usuario);

        return evolucionRepositorio.save(evolucion);
    }



    public Page<Evolucion> historialPorResidente(
            String dni,
            int page,
            int size
    ) {

        if (!residenteRepositorio.existsById(dni)) {
            throw new ResourceNotFoundException("Residente no encontrado");
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("fecha").descending()
                        .and(Sort.by("hora").descending())
        );

        return evolucionRepositorio
                .findByResidenteDniOrderByFechaDescHoraDesc(dni, pageable);
    }



    public Page<Evolucion> historialFiltrado(
            HistorialDTO dto,
            int page,
            int size
    ) {

        if (!residenteRepositorio.existsById(dto.getResidenteDni())) {
            throw new ResourceNotFoundException("Residente no encontrado");
        }

        String turno = dto.getTurno();
        if (turno != null && turno.trim().isEmpty()) {
            turno = null;
        }

        Pageable pageable = PageRequest.of(page, size);

        return evolucionRepositorio.filtrarHistorial(
                dto.getResidenteDni(),
                dto.getFechaInicio(),
                dto.getFechaFin(),
                turno,
                pageable
        );
    }

}

