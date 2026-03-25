package calidia.backend.dto;

public class PasswordResetResponseDTO {

    private String message;
    private String resetToken;

    public PasswordResetResponseDTO() {
    }

    public PasswordResetResponseDTO(String message, String resetToken) {
        this.message = message;
        this.resetToken = resetToken;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
}
