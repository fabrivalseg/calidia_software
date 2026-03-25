package calidia.backend.servicio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class PasswordResetEmailServicio {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetEmailServicio.class);

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String from;

    @Value("${app.name:Calidia}")
    private String appName;

    @Value("${app.password-reset.help-message:Si no solicitaste el cambio, ignorá este correo.}")
    private String helpMessage;

    public PasswordResetEmailServicio(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigoRecuperacion(String emailDestino, String token, int minutosVigencia) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(emailDestino);
        message.setSubject(appName + " - Recuperacion de contrasena");
        message.setText(construirCuerpo(token, minutosVigencia));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            log.error("No se pudo enviar email de recuperacion a {}", emailDestino, ex);
            throw new IllegalStateException("No se pudo enviar el correo de recuperacion", ex);
        }
    }

    private String construirCuerpo(String token, int minutosVigencia) {
        return "Recibimos una solicitud para restablecer tu contrasena.\n\n"
                + "Codigo de recuperacion: " + token + "\n"
                + "Vigencia: " + minutosVigencia + " minutos.\n\n"
                + helpMessage + "\n";
    }
}
