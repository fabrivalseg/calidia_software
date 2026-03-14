package calidia.backend.excepcion;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        private String getRequestId(HttpServletRequest request) {
                Object requestId = request.getAttribute("requestId");
                return requestId != null ? requestId.toString() : "N/A";
        }

    // 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Recurso no encontrado",
                ex.getMessage(),
                request.getRequestURI(),
                getRequestId(request)
        );

        log.warn("404 {} {} - {}", request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // 400
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(
            BadRequestException ex,
            HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Solicitud inválida",
                ex.getMessage(),
                request.getRequestURI(),
                getRequestId(request)
        );

        log.warn("400 {} {} - {}", request.getMethod(), request.getRequestURI(), ex.getMessage());

        return ResponseEntity.badRequest().body(error);
    }

    // 401 - JWT / Login
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "Credenciales inválidas",
                "Email o contraseña incorrectos",
                request.getRequestURI(),
                getRequestId(request)
        );

        log.warn("401 {} {} - credenciales invalidas", request.getMethod(), request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    // 403 - permisos
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Acceso denegado",
                "No tenés permisos para acceder a este recurso",
                request.getRequestURI(),
                getRequestId(request)
        );

        log.warn("403 {} {} - acceso denegado", request.getMethod(), request.getRequestURI());

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // 500 - error no controlado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error interno del servidor",
                "Ocurrió un error inesperado",
                request.getRequestURI(),
                getRequestId(request)
        );

        log.error("500 {} {} - error no controlado", request.getMethod(), request.getRequestURI(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }

        @ExceptionHandler(IllegalArgumentException.class)
        public ResponseEntity<ErrorResponse> handleIllegalArgument(
                        IllegalArgumentException ex,
                        HttpServletRequest request) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Solicitud inválida",
                                ex.getMessage(),
                                request.getRequestURI(),
                                getRequestId(request)
                );

                log.warn("400 {} {} - {}", request.getMethod(), request.getRequestURI(), ex.getMessage());

                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ErrorResponse> handleDataIntegrity(
                        DataIntegrityViolationException ex,
                        HttpServletRequest request) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Conflicto de datos",
                                "No se pudo guardar por conflicto de datos. Verifique duplicados o campos obligatorios.",
                                request.getRequestURI(),
                                getRequestId(request)
                );

                log.warn("400 {} {} - data integrity violation", request.getMethod(), request.getRequestURI(), ex);

                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ErrorResponse> handleNotReadable(
                        HttpMessageNotReadableException ex,
                        HttpServletRequest request) {

                String mensaje = "Formato de datos invalido. Revise tipo y formato de los campos enviados.";
                Throwable causa = ex.getMostSpecificCause();
                if (causa != null && causa.getMessage() != null && !causa.getMessage().isBlank()) {
                        mensaje = "Formato de datos invalido: " + causa.getMessage();
                }

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Error de formato",
                                mensaje,
                                request.getRequestURI(),
                                getRequestId(request)
                );

                log.warn("400 {} {} - body no legible: {}", request.getMethod(), request.getRequestURI(), mensaje);

                return ResponseEntity.badRequest().body(error);
        }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        String mensaje = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Datos inválidos");

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Error de validación",
                mensaje,
                request.getRequestURI(),
                getRequestId(request)
        );

        log.warn("400 {} {} - validacion: {}", request.getMethod(), request.getRequestURI(), mensaje);

        return ResponseEntity.badRequest().body(error);
    }

}

