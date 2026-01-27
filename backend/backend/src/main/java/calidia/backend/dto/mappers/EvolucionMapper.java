package calidia.backend.dto.mappers;

import calidia.backend.dto.response.EvolucionResponseDTO;
import calidia.backend.modelo.Evolucion;
import calidia.backend.modelo.Usuario;

public class EvolucionMapper {

    public static EvolucionResponseDTO toDTO(Evolucion evolucion) {

        EvolucionResponseDTO dto = new EvolucionResponseDTO();
        dto.setId(evolucion.getId());
        dto.setFecha(evolucion.getFecha());
        dto.setHora(evolucion.getHora());
        dto.setSignosVitales(evolucion.getSignosVitales());
        dto.setEvolucion(evolucion.getEvolucion());
        dto.setNotas(evolucion.getNotas());
        dto.setTurno(evolucion.getTurno());

        Usuario usuario = evolucion.getUsuario();
        if (usuario != null) {
            dto.setUsuarioEmail(usuario.getEmail());
            dto.setUsuarioNombre(
                    usuario.getNombre() + " " + usuario.getApellido()
            );
        }

        return dto;
    }
}

