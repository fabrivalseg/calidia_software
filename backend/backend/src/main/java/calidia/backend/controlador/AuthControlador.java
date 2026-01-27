package calidia.backend.controlador;

import calidia.backend.dto.CrearUsuarioDTO;
import calidia.backend.dto.LoginRequestDTO;
import calidia.backend.dto.LoginResponseDTO;
import calidia.backend.servicio.AuthServicio;
import calidia.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final AuthServicio authServicio;
    private final UsuarioServicio usuarioServicio;

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
        cookie.setSecure(false); // true en producción (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 8); // 8 horas
        cookie.setAttribute("SameSite", "Lax");

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
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.noContent().build();
    }


    @PostMapping("/register")
    public ResponseEntity<Void> crearUsuario(
            @Valid @RequestBody CrearUsuarioDTO dto
    ) {
        usuarioServicio.crearUsuario(dto);
        return ResponseEntity.status(201).build();
    }

}



