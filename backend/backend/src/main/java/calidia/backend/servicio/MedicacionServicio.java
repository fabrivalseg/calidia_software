package calidia.backend.servicio;

import calidia.backend.dto.MedicacionDTO;
import calidia.backend.excepcion.ResourceNotFoundException;
import calidia.backend.modelo.Medicacion;
import calidia.backend.modelo.Residente;
import calidia.backend.repositorio.MedicacionRepositorio;
import calidia.backend.repositorio.ResidenteRepositorio;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicacionServicio {

    private final MedicacionRepositorio medicacionRepositorio;
    private final ResidenteRepositorio residenteRepositorio;

    public MedicacionServicio(MedicacionRepositorio medicacionRepositorio,
                              ResidenteRepositorio residenteRepositorio) {
        this.medicacionRepositorio = medicacionRepositorio;
        this.residenteRepositorio = residenteRepositorio;
    }

    public Medicacion registrarMedicacion(MedicacionDTO dto) {

        Residente residente = residenteRepositorio.findByDni(dto.getDniResidente());

        if (residente == null){
            throw new ResourceNotFoundException("No se encontro el residente");
        }

        Medicacion medicacion = new Medicacion();
        medicacion.setNombre(dto.getNombre());
        medicacion.setMomento(dto.getMomento());
        medicacion.setHora(dto.getHora());
        medicacion.setCantidad(dto.getCantidad());
        medicacion.setTipo(dto.getTipo());
        medicacion.setResidente(residente);

        return medicacionRepositorio.save(medicacion);
    }

    public List<Medicacion> listarPorResidente(String dni) {

        if (residenteRepositorio.findByDni(dni) == null){
            throw new ResourceNotFoundException("No se encontro el residente");
        }

        return medicacionRepositorio.findByResidenteDni(dni);
    }

    public Medicacion actualizarMedicacion(Long id, MedicacionDTO dto){
        Medicacion medicacion = medicacionRepositorio.findById(id)
                .orElseThrow();
        medicacion.setNombre(dto.getNombre());
        medicacion.setCantidad(dto.getCantidad());
        medicacion.setHora(dto.getHora());
        medicacion.setTipo(dto.getTipo());
        medicacion.setMomento(dto.getMomento());
        return medicacionRepositorio.save(medicacion);

    }
}

