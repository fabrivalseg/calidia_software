package calidia.backend.controlador;

import calidia.backend.dto.CrearUsuarioDTO;
import calidia.backend.dto.LoginRequestDTO;
import calidia.backend.dto.LoginResponseDTO;
import calidia.backend.dto.PasswordResetConfirmDTO;
import calidia.backend.dto.PasswordResetRequestDTO;
import calidia.backend.dto.PasswordResetResponseDTO;
import calidia.backend.modelo.Usuario;
import calidia.backend.servicio.AuthServicio;
import calidia.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final AuthServicio authServicio;
    private final UsuarioServicio usuarioServicio;

    @Value("${security.cookie.secure:true}")
    private boolean secureCookie;

    @Value("${security.cookie.same-site:None}")
    private String sameSite;

    @Value("${security.password-reset.enabled:false}")
    private boolean passwordResetEnabled;

    public AuthControlador(AuthServicio authServicio, UsuarioServicio usuarioServicio) {
        this.authServicio = authServicio;
        this.usuarioServicio = usuarioServicio;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @RequestBody LoginRequestDTO dto,
            HttpServletResponse response) {

        LoginResponseDTO loginResponse = authServicio.login(dto);

        Cookie cookie = new Cookie("auth_token", loginResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 8); // 8 horas
        cookie.setAttribute("SameSite", sameSite);

        response.addCookie(cookie);


        return ResponseEntity.ok(
                new LoginResponseDTO(
                        null,
                        loginResponse.getEmail(),
                        loginResponse.getRol()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("auth_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", sameSite);

        response.addCookie(cookie);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifySession(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        Usuario usuario = usuarioServicio.buscarPorEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("email", usuario.getEmail());
        response.put("nombre", usuario.getNombre());
        response.put("rol", usuario.getRol());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/register")
    public ResponseEntity<Void> crearUsuario(
            @Valid @RequestBody CrearUsuarioDTO dto
    ) {
        usuarioServicio.crearUsuario(dto);
        return ResponseEntity.status(201).build();
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<PasswordResetResponseDTO> solicitarRecuperacion(
            @Valid @RequestBody PasswordResetRequestDTO dto
    ) {
        if (!passwordResetEnabled) {
            return ResponseEntity.status(503)
                    .body(new PasswordResetResponseDTO("La recuperacion de contrasena no esta disponible por el momento.", null));
        }
        return ResponseEntity.ok(authServicio.solicitarRecuperacion(dto));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<PasswordResetResponseDTO> confirmarRecuperacion(
            @Valid @RequestBody PasswordResetConfirmDTO dto
    ) {
        if (!passwordResetEnabled) {
            return ResponseEntity.status(503)
                    .body(new PasswordResetResponseDTO("La recuperacion de contrasena no esta disponible por el momento.", null));
        }
        return ResponseEntity.ok(authServicio.confirmarRecuperacion(dto));
    }

}



