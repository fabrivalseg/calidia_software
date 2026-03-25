package calidia.backend.servicio;

import calidia.backend.dto.LoginRequestDTO;
import calidia.backend.dto.LoginResponseDTO;
import calidia.backend.dto.PasswordResetConfirmDTO;
import calidia.backend.dto.PasswordResetRequestDTO;
import calidia.backend.dto.PasswordResetResponseDTO;
import calidia.backend.excepcion.BadRequestException;
import calidia.backend.modelo.PasswordResetToken;
import calidia.backend.modelo.Usuario;
import calidia.backend.repositorio.PasswordResetTokenRepositorio;
import calidia.backend.repositorio.UsuarioRepositorio;
import calidia.backend.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class AuthServicio {

    private static final Logger log = LoggerFactory.getLogger(AuthServicio.class);

    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordResetTokenRepositorio passwordResetTokenRepositorio;
    private final PasswordResetEmailServicio passwordResetEmailServicio;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${security.password-reset.token-minutes:30}")
    private int resetTokenMinutes;

    public AuthServicio(UsuarioRepositorio usuarioRepositorio,
                        PasswordResetTokenRepositorio passwordResetTokenRepositorio,
                        PasswordResetEmailServicio passwordResetEmailServicio,
                        PasswordEncoder passwordEncoder,
                        JwtUtil jwtUtil) {
        this.usuarioRepositorio = usuarioRepositorio;
        this.passwordResetTokenRepositorio = passwordResetTokenRepositorio;
        this.passwordResetEmailServicio = passwordResetEmailServicio;
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

    public PasswordResetResponseDTO solicitarRecuperacion(PasswordResetRequestDTO dto) {
        String email = dto.getEmail().trim().toLowerCase();
        Usuario usuario = usuarioRepositorio.findByEmail(email);

        String mensaje = "Si el correo existe, recibirás instrucciones para restablecer tu contraseña.";

        if (usuario == null) {
            return new PasswordResetResponseDTO(mensaje, null);
        }

        passwordResetTokenRepositorio.deleteByEmail(email);

        String rawToken = generarTokenSeguro();
        PasswordResetToken token = new PasswordResetToken();
        token.setEmail(email);
        token.setTokenHash(hashToken(rawToken));
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(resetTokenMinutes));
        token.setUsed(false);
        passwordResetTokenRepositorio.save(token);
        passwordResetEmailServicio.enviarCodigoRecuperacion(email, rawToken, resetTokenMinutes);
        log.info("Se envio email de recuperacion a {}", email);

        return new PasswordResetResponseDTO(mensaje, null);
    }

    public PasswordResetResponseDTO confirmarRecuperacion(PasswordResetConfirmDTO dto) {
        String tokenPlano = dto.getToken().trim();
        if (tokenPlano.isEmpty()) {
            throw new BadRequestException("El token es obligatorio");
        }

        LocalDateTime now = LocalDateTime.now();
        PasswordResetToken token = passwordResetTokenRepositorio
                .findByTokenHashAndUsedFalseAndExpiresAtAfter(hashToken(tokenPlano), now)
                .orElseThrow(() -> new BadRequestException("Token invalido o expirado"));

        Usuario usuario = usuarioRepositorio.findByEmail(token.getEmail());
        if (usuario == null) {
            throw new BadRequestException("No se pudo completar el restablecimiento de contraseña");
        }

        usuario.setContraseña(passwordEncoder.encode(dto.getNewPassword()));
        usuarioRepositorio.save(usuario);

        token.setUsed(true);
        token.setUsedAt(now);
        passwordResetTokenRepositorio.save(token);

        return new PasswordResetResponseDTO("Contrasena actualizada correctamente", null);
    }

    private String generarTokenSeguro() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte hashByte : hashBytes) {
                sb.append(String.format("%02x", hashByte));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("No se pudo generar hash para token de recuperacion", e);
        }
    }
}


