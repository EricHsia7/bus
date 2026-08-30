#version 300 es
precision highp float;
precision highp int;

// attributes
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_previous;
layout(location = 2) in vec2 a_next;
layout(location = 3) in float a_side;
layout(location = 4) in float a_style;
layout(location = 5) in float a_cap; // 0: segment vertex, 1: cap quad base, 2: cap quad tip

// uniforms
uniform vec2 u_tileScale;
uniform vec2 u_tileOffset;
uniform vec2 u_viewport;
uniform float u_deltaZoom;
uniform sampler2D u_styleData;
uniform float u_styleTexelWidth;
uniform float u_isLine;
uniform float u_extent;
uniform float u_designTileSize;

out float v_style;

// NOT flat. All four vertices of a cap quad write identical cap values, so
// interpolating them reproduces the constant exactly. Marking them flat would
// let a segment triangle inherit cap values from whichever vertex happens to
// be provoking, which is what painted whole segments in the debug pass.
out vec2 v_pos; // per-fragment position in pixels
out vec2 v_capCenter; // true endpoint in pixels
out float v_capRadius; // cap radius in pixels (0 -> not a cap)
out vec2 v_capOut; // unit outward dir pixels (0 -> skip half-plane test)

// Maximum factor a mitred join may stretch the half width before being cut
// back, so sharp bends cannot spike arbitrarily far.
const float MITER_LIMIT = 4.0f;

// Squared length below which a segment counts as degenerate. Tile coordinates
// are quantised to u_extent, so distinct source points routinely collapse onto
// each other and must never reach normalize().
const float EPS2 = 1e-12f; // 1e-6 * 1e-6

vec4 styleTexel(float style, float texel) {
    float x = (style * 4.0f + texel + 0.5f) / u_styleTexelWidth;
    return texture(u_styleData, vec2(x, 0.5f));
}

void main() {
    v_style = a_style;

    vec2 position = a_position;

    // Defaults. v_capRadius stays 0 on every path except the cap-quad branch,
    // which is the ONLY place allowed to make it nonzero.
    v_capCenter = vec2(0.0f);
    v_capRadius = 0.0f;
    v_capOut = vec2(0.0f);

    if(u_isLine > 0.5f) {
        vec4 widthData = styleTexel(a_style, 1.0f);
        float width = widthData.y;
        float scale0 = widthData.z;
        float scale1 = widthData.w;
        float zoomScale = mix(scale0, scale1, u_deltaZoom) * exp2(-u_deltaZoom);
        float halfWidth = width * zoomScale * (u_extent / u_designTileSize) * 0.5f;

        // Segment vectors. Lengths are tested before any normalize() so a
        // zero-length segment cannot yield NaN and silently delete triangles.
        vec2 d0 = a_position - a_previous;
        vec2 d1 = a_next - a_position;
        bool has0 = dot(d0, d0) > EPS2;
        bool has1 = dot(d1, d1) > EPS2;

        vec2 t0 = has0 ? normalize(d0) : vec2(0.0f);
        vec2 t1 = has1 ? normalize(d1) : vec2(0.0f);

        vec2 offset;

        if(a_cap > 0.5f) {
            // Cap quad
            float extend = a_cap - 1.0f; // 1 -> 0.0 (base), 2 -> 1.0 (tip)

            vec2 dir;
            float along;
            if(has1) {
                dir = t1;      // start of the line
                along = -1.0f; // outward = backwards
            } else if(has0) {
                dir = t0;      // end of the line
                along = 1.0f;  // outward = forwards
            } else {
                dir = vec2(1.0f, 0.0f); // isolated point
                along = 1.0f;
            }

            vec2 normal = vec2(-dir.y, dir.x);
            offset = (normal * a_side + dir * along * extend) * halfWidth;

            v_capCenter = a_position * u_tileScale + u_tileOffset;
            v_capRadius = halfWidth * u_tileScale.x; // tile units -> pixels
            if(has0 || has1) {
                v_capOut = normalize(dir * along * u_tileScale);
            }
        } else if(has0 && has1) {
            // Interior vertex: mitre the join
            vec2 sum = t0 + t1;
            vec2 tangent;
            if(dot(sum, sum) > EPS2) {
                tangent = normalize(sum);
            } else {
                // Line doubles back: t0 == -t1 and the mitre is undefined.
                // Fall back rather than normalising a zero vector.
                tangent = t1;
            }

            vec2 mitreNormal = vec2(-tangent.y, tangent.x);
            vec2 segNormal = vec2(-t1.y, t1.x);

            // Lengthen the offset so the mitred edge stays flush with both
            // segment edges instead of pinching inwards at the bend.
            float cosHalf = dot(mitreNormal, segNormal);
            float mitreScale = 1.0f / max(abs(cosHalf), 1.0f / MITER_LIMIT);

            offset = mitreNormal * a_side * halfWidth * mitreScale;
        } else if(has0 || has1) {
            // Segment endpoint: BUTT
            // No along-the-line extension any more. The dedicated cap quad
            // supplies the end; extending here would double-cover it and leave
            // the circle carve nothing to bite on.
            vec2 dir = has1 ? t1 : t0;
            vec2 normal = vec2(-dir.y, dir.x);
            offset = normal * a_side * halfWidth;
        } else {
            // Fully degenerate vertex with no cap quad: nothing to draw.
            offset = vec2(0.0f);
        }

        position += offset;
    }

    vec2 pixel = position * u_tileScale + u_tileOffset;
    vec2 clip = pixel / u_viewport * 2.0f - 1.0f;
    gl_Position = vec4(clip.x, -clip.y, 0.0f, 1.0f);
    v_pos = pixel;
}
