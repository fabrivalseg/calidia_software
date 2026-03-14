package calidia.backend.servicio;

import calidia.backend.dto.ResidenteDTO;
import calidia.backend.excepcion.BadRequestException;
import calidia.backend.excepcion.ResourceNotFoundException;
import calidia.backend.modelo.Familiar;
import calidia.backend.modelo.Residente;
import calidia.backend.repositorio.FamiliarRepositorio;
import calidia.backend.repositorio.ResidenteRepositorio;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResidenteServicio {

    private final ResidenteRepositorio residenteRepositorio;
    private final FamiliarRepositorio familiarRepositorio;

    public ResidenteServicio(ResidenteRepositorio residenteRepositorio,
                             FamiliarRepositorio familiarRepositorio) {
        this.residenteRepositorio = residenteRepositorio;
        this.familiarRepositorio = familiarRepositorio;
    }

    @Transactional
    public Residente crearResidente(ResidenteDTO dto) {
        if (residenteRepositorio.existsByDni(dto.getDni())) {
            throw new BadRequestException("Ya existe un residente con ese DNI");
        }

        Familiar familiar = new Familiar();
        familiar.setNombre(dto.getNombreFamiliar());
        familiar.setApellido(dto.getApellidoFamiliar());
        familiar.setParentesco(dto.getParentescoFamiliar());
        familiar.setTelefono(dto.getTelefonoFamiliar());
        familiarRepositorio.save(familiar);

        Residente residente = new Residente();
        residente.setDni(dto.getDni());
        residente.setNombre(dto.getNombre());
        residente.setApellido(dto.getApellido());
        residente.setFechaNacimiento(dto.getFechaNacimiento());
        residente.setFechaIngreso(dto.getFechaIngreso());
        residente.setObraSocial(dto.getObraSocial());
        residente.setMedico(dto.getMedico());
        residente.setPatologias(dto.getPatologias());
        residente.setMedicacion(dto.getMedicacion());
        residente.setFamiliar(familiar);

        try {
            return residenteRepositorio.save(residente);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Ya existe un residente con ese DNI");
        }
    }

    public List<Residente> listarTodos() {
        return residenteRepositorio.findAll();
    }

    public Residente buscarPorDni(String dni) {
        return residenteRepositorio.findById(dni)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Residente no encontrado"));
    }
}

