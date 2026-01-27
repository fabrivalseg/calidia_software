package calidia.backend.controlador;

import calidia.backend.dto.MedicacionDTO;
import calidia.backend.dto.mappers.MedicacionMapper;
import calidia.backend.dto.response.MedicacionResponseDTO;
import calidia.backend.servicio.MedicacionServicio;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaciones")
public class MedicacionControlador {

    private final MedicacionServicio medicacionServicio;

    public MedicacionControlador(MedicacionServicio medicacionServicio) {
        this.medicacionServicio = medicacionServicio;
    }

    @PostMapping
    public MedicacionResponseDTO registrar(@RequestBody MedicacionDTO dto) {
        return MedicacionMapper.toDTO(
                medicacionServicio.registrarMedicacion(dto)
        );
    }

    @GetMapping("/residente/{dni}")
    public List<MedicacionResponseDTO> listarPorResidente(@PathVariable String dni) {
        return medicacionServicio.listarPorResidente(dni)
                .stream()
                .map(MedicacionMapper::toDTO)
                .toList();
    }

    @PutMapping("/{id}")
    public MedicacionResponseDTO actualizarMedicacion(@PathVariable Long id, @RequestBody MedicacionDTO dto){
        return MedicacionMapper.toDTO(medicacionServicio.actualizarMedicacion(id, dto));

    }
}

