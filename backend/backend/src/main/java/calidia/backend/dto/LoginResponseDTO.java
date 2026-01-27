package calidia.backend.dto;

import calidia.backend.modelo.enums.Rol;

public class LoginResponseDTO {
    private String token;
    private String email;
    private Rol rol;

    public LoginResponseDTO(String token, String email, Rol rol) {
        this.token = token;
        this.email = email;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
