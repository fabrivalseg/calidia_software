package calidia.backend.servicio;

import calidia.backend.dto.LoginRequestDTO;
import calidia.backend.dto.LoginResponseDTO;
import calidia.backend.modelo.Usuario;
import calidia.backend.repositorio.UsuarioRepositorio;
import calidia.backend.security.JwtUtil;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServicio {

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServicio(UsuarioRepositorio usuarioRepositorio,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponseDTO login(LoginRequestDTO dto) {

        Usuario usuario = usuarioRepositorio.findByEmail(dto.getEmail());

        if (usuario == null){
            throw new BadCredentialsException("Credenciales inválidas");
        }


        if (!passwordEncoder.matches(dto.getPassword(), usuario.getContraseña())) {
            throw new BadCredentialsException("Credenciales inválidas");
        }

        String token = jwtUtil.generarToken(usuario);

        return new LoginResponseDTO(
                token,
                usuario.getEmail(),
                usuario.getRol()
        );
    }
}


