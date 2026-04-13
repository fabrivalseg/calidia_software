package calidia.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;
    private final boolean secureCookie;
    private final String sameSite;

    public JwtAuthenticationFilter(JwtUtil jwtUtil,
                                   CustomUserDetailsService userDetailsService,
                                   @Value("${security.cookie.secure:true}") boolean secureCookie,
                                   @Value("${security.cookie.same-site:Lax}") String sameSite) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.secureCookie = secureCookie;
        this.sameSite = sameSite;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = obtenerToken(request);

        if (token != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
                String email = jwtUtil.extraerEmail(token);

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                if (jwtUtil.tokenValido(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                }
            } catch (JwtException | IllegalArgumentException e) {
                log.warn("JWT invalido en {} {} - {}", request.getMethod(), request.getRequestURI(), e.getMessage());
                limpiarCookieAuth(response);
            } catch (Exception e) {
                log.error("Error al procesar JWT en {} {}", request.getMethod(), request.getRequestURI(), e);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String obtenerToken(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return null;
        }

        for (Cookie cookie : request.getCookies()) {
            if ("auth_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }

    private void limpiarCookieAuth(HttpServletResponse response) {
        Cookie cookie = new Cookie("auth_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", sameSite);
        response.addCookie(cookie);
    }
}
