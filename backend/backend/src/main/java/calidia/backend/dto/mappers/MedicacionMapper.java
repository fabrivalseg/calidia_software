package calidia.backend.dto.mappers;

import calidia.backend.dto.response.MedicacionResponseDTO;
import calidia.backend.modelo.Medicacion;

public class MedicacionMapper {

    public static MedicacionResponseDTO toDTO(Medicacion medicacion) {
        MedicacionResponseDTO dto = new MedicacionResponseDTO();
        dto.setId(medicacion.getId());
        dto.setNombre(medicacion.getNombre());
        dto.setMomento(medicacion.getMomento());
        dto.setHora(medicacion.getHora());
        dto.setCantidad(medicacion.getCantidad());
        dto.setTipo(medicacion.getTipo());
        return dto;
    }
}

