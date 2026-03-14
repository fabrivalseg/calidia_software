package calidia.backend.modelo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum Rol {
    ADMIN,
    ENFERMERO,
    MEDICO;

    @JsonCreator
    public static Rol fromValue(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT);

        return switch (normalized) {
            case "ADMIN", "ADMINISTRATIVO", "DIRECTOR" -> ADMIN;
            case "ENFERMERO" -> ENFERMERO;
            case "MEDICO" -> MEDICO;
            default -> Rol.valueOf(normalized);
        };
    }
}
