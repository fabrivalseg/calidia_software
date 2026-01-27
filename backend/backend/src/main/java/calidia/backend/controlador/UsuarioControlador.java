package calidia.backend.controlador;

import calidia.backend.dto.CrearUsuarioDTO;
import calidia.backend.dto.mappers.UsuarioMapper;
import calidia.backend.dto.response.UsuarioResponseDTO;
import calidia.backend.modelo.Usuario;
import calidia.backend.servicio.UsuarioServicio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioControlador {

    private final UsuarioServicio usuarioServicio;

    public UsuarioControlador(UsuarioServicio usuarioServicio) {
        this.usuarioServicio = usuarioServicio;
    }


    @GetMapping
    public List<UsuarioResponseDTO> listar() {
        return usuarioServicio.listarUsuarios()
                .stream()
                .map(UsuarioMapper::toDTO)
                .toList();
    }

    @GetMapping("/{email}")
    public UsuarioResponseDTO buscar(@PathVariable String email) {
        return UsuarioMapper.toDTO(
                usuarioServicio.buscarPorEmail(email)
        );
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<Void> eliminar(@PathVariable String email) {
        usuarioServicio.eliminarUsuario(email);
        return ResponseEntity.noContent().build();
    }

}

