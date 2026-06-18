/**
 * Jugadores clave por selección (dataset curado de referencia).
 *
 * El modelo analítico opera a nivel de selección (no de jugador), por lo que
 * esta tabla alimenta únicamente la sección "Comparativa de Estrellas" del
 * comparador. Los `rating` son valoraciones de referencia (escala 0–10) basadas
 * en rendimiento reciente público; no provienen del motor estadístico.
 *
 * Cobertura: principales selecciones del Mundial 2026. Las no listadas muestran
 * un aviso de "datos de plantilla no disponibles".
 */
export interface KeyPlayer {
  readonly name: string;
  readonly position: string;
  readonly rating: number;
}

export const KEY_PLAYERS: Readonly<Record<string, readonly KeyPlayer[]>> = {
  arg: [
    { name: 'L. Messi', position: 'Atacante', rating: 8.9 },
    { name: 'J. Álvarez', position: 'Delantero', rating: 8.2 },
    { name: 'R. De Paul', position: 'Mediocentro', rating: 7.6 },
  ],
  fra: [
    { name: 'K. Mbappé', position: 'Atacante', rating: 8.8 },
    { name: 'A. Griezmann', position: 'Mediapunta', rating: 8.1 },
    { name: 'A. Tchouaméni', position: 'Mediocentro', rating: 7.7 },
  ],
  bra: [
    { name: 'Vinícius Jr.', position: 'Extremo', rating: 8.6 },
    { name: 'Rodrygo', position: 'Extremo', rating: 8.0 },
    { name: 'Casemiro', position: 'Mediocentro', rating: 7.5 },
  ],
  esp: [
    { name: 'Lamine Yamal', position: 'Extremo', rating: 8.7 },
    { name: 'Pedri', position: 'Mediocentro', rating: 8.2 },
    { name: 'Rodri', position: 'Pivote', rating: 8.4 },
  ],
  eng: [
    { name: 'J. Bellingham', position: 'Mediapunta', rating: 8.6 },
    { name: 'H. Kane', position: 'Delantero', rating: 8.4 },
    { name: 'B. Saka', position: 'Extremo', rating: 8.0 },
  ],
  por: [
    { name: 'B. Fernandes', position: 'Mediapunta', rating: 8.2 },
    { name: 'B. Silva', position: 'Mediocentro', rating: 8.0 },
    { name: 'Vitinha', position: 'Mediocentro', rating: 7.8 },
  ],
  ned: [
    { name: 'F. de Jong', position: 'Mediocentro', rating: 8.1 },
    { name: 'C. Gakpo', position: 'Extremo', rating: 7.8 },
    { name: 'V. van Dijk', position: 'Defensa', rating: 8.0 },
  ],
  ger: [
    { name: 'J. Musiala', position: 'Mediapunta', rating: 8.5 },
    { name: 'F. Wirtz', position: 'Mediapunta', rating: 8.3 },
    { name: 'J. Kimmich', position: 'Mediocentro', rating: 7.9 },
  ],
  bel: [
    { name: 'K. De Bruyne', position: 'Mediapunta', rating: 8.4 },
    { name: 'J. Doku', position: 'Extremo', rating: 7.7 },
    { name: 'R. Lukaku', position: 'Delantero', rating: 7.8 },
  ],
  cro: [
    { name: 'J. Gvardiol', position: 'Defensa', rating: 8.0 },
    { name: 'M. Kovačić', position: 'Mediocentro', rating: 7.6 },
    { name: 'L. Sosa', position: 'Lateral', rating: 7.3 },
  ],
  uru: [
    { name: 'F. Valverde', position: 'Mediocentro', rating: 8.3 },
    { name: 'D. Núñez', position: 'Delantero', rating: 7.7 },
    { name: 'R. Araújo', position: 'Defensa', rating: 7.9 },
  ],
  col: [
    { name: 'L. Díaz', position: 'Extremo', rating: 8.2 },
    { name: 'J. Rodríguez', position: 'Mediapunta', rating: 7.6 },
    { name: 'J. Lerma', position: 'Mediocentro', rating: 7.2 },
  ],
  mar: [
    { name: 'A. Hakimi', position: 'Lateral', rating: 8.1 },
    { name: 'B. Díaz', position: 'Mediapunta', rating: 7.7 },
    { name: 'Y. En-Nesyri', position: 'Delantero', rating: 7.4 },
  ],
  usa: [
    { name: 'C. Pulisic', position: 'Extremo', rating: 7.9 },
    { name: 'W. McKennie', position: 'Mediocentro', rating: 7.4 },
    { name: 'A. Robinson', position: 'Lateral', rating: 7.2 },
  ],
  mex: [
    { name: 'S. Giménez', position: 'Delantero', rating: 7.6 },
    { name: 'E. Álvarez', position: 'Pivote', rating: 7.5 },
    { name: 'H. Lozano', position: 'Extremo', rating: 7.3 },
  ],
  jpn: [
    { name: 'K. Mitoma', position: 'Extremo', rating: 7.8 },
    { name: 'T. Kubo', position: 'Extremo', rating: 7.6 },
    { name: 'W. Endo', position: 'Pivote', rating: 7.2 },
  ],
};
