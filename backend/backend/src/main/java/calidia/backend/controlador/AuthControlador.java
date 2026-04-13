package calidia.backend.controlador;

import calidia.backend.dto.LoginRequestDTO;
import calidia.backend.dto.LoginResponseDTO;
import calidia.backend.dto.PasswordResetConfirmDTO;
import calidia.backend.dto.PasswordResetRequestDTO;
import calidia.backend.dto.PasswordResetResponseDTO;
import calidia.backend.modelo.Usuario;
import calidia.backend.security.RateLimitService;
import calidia.backend.servicio.AuthServicio;
import calidia.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthControlador {

    private final AuthServicio authServicio;
    private final UsuarioServicio usuarioServicio;
    private final RateLimitService rateLimitService;

    @Value("${security.cookie.secure:true}")
    private boolean secureCookie;

    @Value("${security.cookie.same-site:None}")
    private String sameSite;

    @Value("${security.password-reset.enabled:false}")
    private boolean passwordResetEnabled;

    public AuthControlador(AuthServicio authServicio,
                           UsuarioServicio usuarioServicio,
                           RateLimitService rateLimitService) {
        this.authServicio = authServicio;
        this.usuarioServicio = usuarioServicio;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response) {

        String rateLimitKey = "login:" + resolveClientIp(request) + ":" + dto.getEmail();
        if (rateLimitService.isBlocked(rateLimitKey)) {
            long retryAfter = rateLimitService.retryAfterSeconds(rateLimitKey);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Demasiados intentos. Reintenta en " + retryAfter + " segundos");
        }

        LoginResponseDTO loginResponse;
        try {
            loginResponse = authServicio.login(dto);
            rateLimitService.registerSuccess(rateLimitKey);
        } catch (BadCredentialsException ex) {
            rateLimitService.registerFailure(rateLimitKey);
            throw ex;
        }

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


    @PostMapping("/password-reset/request")
    public ResponseEntity<PasswordResetResponseDTO> solicitarRecuperacion(
            @Valid @RequestBody PasswordResetRequestDTO dto,
            HttpServletRequest request
    ) {
        String rateLimitKey = "reset-request:" + resolveClientIp(request);
        if (rateLimitService.isBlocked(rateLimitKey)) {
            long retryAfter = rateLimitService.retryAfterSeconds(rateLimitKey);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Demasiadas solicitudes. Reintenta en " + retryAfter + " segundos");
        }

        if (!passwordResetEnabled) {
            return ResponseEntity.status(503)
                    .body(new PasswordResetResponseDTO("La recuperacion de contrasena no esta disponible por el momento.", null));
        }

        try {
            PasswordResetResponseDTO responseDTO = authServicio.solicitarRecuperacion(dto);
            rateLimitService.registerSuccess(rateLimitKey);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException ex) {
            rateLimitService.registerFailure(rateLimitKey);
            throw ex;
        }
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<PasswordResetResponseDTO> confirmarRecuperacion(
            @Valid @RequestBody PasswordResetConfirmDTO dto,
            HttpServletRequest request
    ) {
        String rateLimitKey = "reset-confirm:" + resolveClientIp(request);
        if (rateLimitService.isBlocked(rateLimitKey)) {
            long retryAfter = rateLimitService.retryAfterSeconds(rateLimitKey);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Demasiados intentos. Reintenta en " + retryAfter + " segundos");
        }

        if (!passwordResetEnabled) {
            return ResponseEntity.status(503)
                    .body(new PasswordResetResponseDTO("La recuperacion de contrasena no esta disponible por el momento.", null));
        }

        try {
            PasswordResetResponseDTO responseDTO = authServicio.confirmarRecuperacion(dto);
            rateLimitService.registerSuccess(rateLimitKey);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException ex) {
            rateLimitService.registerFailure(rateLimitKey);
            throw ex;
        }
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

}



