package calidia.backend.controlador;

import calidia.backend.dto.ResidenteDTO;
import calidia.backend.dto.mappers.ResidenteMapper;
import calidia.backend.dto.response.ResidenteResponseDTO;
import calidia.backend.servicio.ResidenteServicio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residentes")
public class ResidenteControlador {

    private final ResidenteServicio residenteServicio;

    public ResidenteControlador(ResidenteServicio residenteServicio) {
        this.residenteServicio = residenteServicio;
    }

    @PostMapping
    public ResponseEntity<ResidenteResponseDTO> crear(@Valid @RequestBody ResidenteDTO dto) {
        return ResponseEntity.ok(
                ResidenteMapper.toDTO(
                        residenteServicio.crearResidente(dto)
                )
        );
    }

    @GetMapping
    public List<ResidenteResponseDTO> listar() {
        return residenteServicio.listarTodos()
                .stream()
                .map(ResidenteMapper::toDTO)
                .toList();
    }

    @GetMapping("/{dni}")
    public ResidenteResponseDTO buscar(@PathVariable String dni) {
        return ResidenteMapper.toDTO(
                residenteServicio.buscarPorDni(dni)
        );
    }
}

