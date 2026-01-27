package calidia.backend.dto.mappers;

import calidia.backend.dto.response.FamiliarResponseDTO;
import calidia.backend.dto.response.ResidenteResponseDTO;
import calidia.backend.modelo.Familiar;
import calidia.backend.modelo.Residente;

import java.time.LocalDate;
import java.time.Period;

public class ResidenteMapper {

    public static ResidenteResponseDTO toDTO(Residente residente) {
        ResidenteResponseDTO dto = new ResidenteResponseDTO();

        dto.setDni(residente.getDni());
        dto.setNombre(residente.getNombre());
        dto.setApellido(residente.getApellido());
        dto.setFechaNacimiento(residente.getFechaNacimiento());
        dto.setFechaIngreso(residente.getFechaIngreso());
        dto.setEdad(calcularEdad(residente.getFechaNacimiento()));
        dto.setObraSocial(residente.getObraSocial());
        dto.setMedico(residente.getMedico());
        dto.setPatologias(residente.getPatologias());
        dto.setMedicacion(residente.getMedicacion());

        Familiar familiar = residente.getFamiliar();
        if (familiar != null) {
            FamiliarResponseDTO famDTO = new FamiliarResponseDTO();
            famDTO.setId(familiar.getId());
            famDTO.setNombre(familiar.getNombre());
            famDTO.setApellido(familiar.getApellido());
            famDTO.setParentesco(familiar.getParentesco());
            famDTO.setTelefono(familiar.getTelefono());
            dto.setFamiliar(famDTO);
        }

        return dto;
    }

    private static int calcularEdad(LocalDate fechaNacimiento) {
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }
}
