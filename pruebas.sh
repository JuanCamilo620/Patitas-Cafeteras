#!/bin/bash
# ============================================================
#  Pruebas de la API  -  Patitas Cafeteras
#  Requiere el servidor encendido (npm start) en otra terminal.
#  Uso:  bash pruebas.sh
#  Guarda todo en resultados-pruebas.txt (para el README)
# ============================================================
BASE="${BASE_URL:-http://localhost:3000}"
SALIDA="resultados-pruebas.txt"

if ! curl -s -o /dev/null "$BASE/api/turnos"; then
  echo "❌ No hay servidor en $BASE. Ejecuta 'npm start' en otra terminal."
  exit 1
fi

: > "$SALIDA"

bonito() {
  if command -v jq >/dev/null 2>&1; then jq .
  elif command -v json_pp >/dev/null 2>&1; then json_pp
  else cat; fi
}

# prueba "Título" "Código esperado" METODO RUTA [json]
prueba() {
  local titulo="$1" esperado="$2" metodo="$3" ruta="$4" cuerpo="$5"
  local resp codigo cuerpo_resp ok

  if [ -n "$cuerpo" ]; then
    resp=$(curl -s -w $'\n%{http_code}' -X "$metodo" "$BASE$ruta" \
      -H "Content-Type: application/json" -d "$cuerpo")
  else
    resp=$(curl -s -w $'\n%{http_code}' -X "$metodo" "$BASE$ruta")
  fi
  codigo=$(echo "$resp" | tail -n 1)
  cuerpo_resp=$(echo "$resp" | sed '$d')

  [ "$codigo" = "$esperado" ] && ok="✅ OK" || ok="❌ FALLÓ (esperado $esperado)"

  {
    echo "============================================================"
    echo "$titulo"
    echo "Petición : $metodo $ruta"
    [ -n "$cuerpo" ] && echo "Body     : $cuerpo"
    echo "Código   : $codigo  $ok"
    echo "Respuesta:"
    echo "$cuerpo_resp" | bonito
    echo
  } | tee -a "$SALIDA"
}

prueba "1) Listar todos los turnos" 200 GET /api/turnos

prueba "2) Obtener un turno por id" 200 GET /api/turnos/1

prueba "3) Crear turno PRIORITARIO (recargo N x 2 = 2%)" 201 POST /api/turnos \
'{"nombreCliente":"Valentina Ospina","nombreMascota":"Rocky","tipoServicio":"Spa completo","fechaHora":"2026-12-05T15:30:00","precioBase":50000,"prioritario":true}'

prueba "4) Crear turno NORMAL (sin recargo)" 201 POST /api/turnos \
'{"nombreCliente":"Andrés Mejía","nombreMascota":"Nala","tipoServicio":"Baño","fechaHora":"2026-12-06T10:00:00","precioBase":30000}'

prueba "5) Validación: campos faltantes y precio inválido" 400 POST /api/turnos \
'{"nombreCliente":"","nombreMascota":"Rocky","tipoServicio":"Baño","fechaHora":"no-es-una-fecha","precioBase":-5000}'

prueba "6) Validación: precioBase igual a cero" 400 POST /api/turnos \
'{"nombreCliente":"Laura","nombreMascota":"Toby","tipoServicio":"Corte","fechaHora":"2026-12-07T09:00:00","precioBase":0}'

prueba "7) Turno inexistente" 404 GET /api/turnos/999

echo "📄 Resultados guardados en $SALIDA"
