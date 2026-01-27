package calidia.backend.servicio;

import calidia.backend.dto.CrearUsuarioDTO;
import calidia.backend.excepcion.BadRequestException;
import calidia.backend.excepcion.ResourceNotFoundException;
import calidia.backend.modelo.Usuario;
import calidia.backend.repositorio.UsuarioRepositorio;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServicio(UsuarioRepositorio usuarioRepositorio,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario crearUsuario(Usuario usuario) {

        if (usuarioRepositorio.existsByEmail(usuario.getEmail())) {
            throw new BadRequestException("Ya existe un usuario con ese email");
        }

        usuario.setContraseña(
                passwordEncoder.encode(usuario.getContraseña())
        );

        return usuarioRepositorio.save(usuario);
    }

    public Usuario buscarPorEmail(String email) {
        Usuario usuario =  usuarioRepositorio.findByEmail(email);
        if (usuario == null){
            throw new BadCredentialsException("Credenciales inválidas");
        }
        return usuario;
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepositorio.findAll();
    }

    public void eliminarUsuario(String email) {

        if (!usuarioRepositorio.existsByEmail(email)) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }

        usuarioRepositorio.deleteByEmail(email);
    }

    public Usuario obtenerUsuarioActual() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        String email = authentication.getName();

        return usuarioRepositorio.findByEmail(email);
    }

    public void crearUsuario(CrearUsuarioDTO dto) {

        if (usuarioRepositorio.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Ya existe un usuario con ese email");
        }

        Usuario usuario = new Usuario();
        usuario.setEmail(dto.getEmail());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setTelefono(dto.getTelefono());
        usuario.setRol(dto.getRol());


        usuario.setContraseña(
                passwordEncoder.encode(dto.getPassword())
        );

        usuarioRepositorio.save(usuario);
    }
}

