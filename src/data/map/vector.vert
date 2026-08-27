#version 300 es
precision highp float;
precision highp int;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_previous;
layout(location = 2) in vec2 a_next;
layout(location = 3) in float a_side;
layout(location = 4) in float a_style;

uniform vec2 u_tileScale;
uniform vec2 u_tileOffset;
uniform vec2 u_viewport;
uniform float u_deltaZoom;
uniform sampler2D u_styleData;
uniform float u_styleTexelWidth;
uniform float u_isLine;
uniform float u_extent;
uniform float u_designTileSize;
uniform float u_devicePixelRatio;

out float v_style;
out float v_lineDistance;

// Maximum factor a mitred join may stretch the half width before being cut
// back, so sharp bends cannot spike arbitrarily far.
const float MITER_LIMIT = 1.0f;

// Squared length below which a segment counts as degenerate. Tile coordinates
// are quantised to u_extent, so distinct source points routinely collapse onto
// each other and must never reach normalize().
const float EPS2 = 1e-12; // 1e-6 * 1e-6

vec4 styleTexel(float style, float texel) {
    float x = (style * 4.0f + texel + 0.5f) / u_styleTexelWidth;
    return texture(u_styleData, vec2(x, 0.5f));
}

void main() {
    v_style = a_style;

    vec2 position = a_position;

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

        if(has0 && has1) {
            // Interior vertex: mitre the join.
            vec2 sum = t0 + t1;
            vec2 tangent;
            if(dot(sum, sum) > EPS2) {
                tangent = sum * inversesqrt(dot(sum, sum));
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
            // Endpoint: extrude sideways AND extend along the line by one half
            // width, turning the butt cap into a square cap. Where a polyline
            // was cut at a tile boundary the two halves now overlap instead of
            // leaving a wedge-shaped hole at the join.
            vec2 dir = has1 ? t1 : t0;
            float along = has1 ? -1.0f : 1.0f;
            vec2 normal = vec2(-dir.y, dir.x);
            offset = normal * a_side * halfWidth + dir * along * halfWidth;
        } else {
            // Fully degenerate vertex: no direction information at all.
            offset = vec2(0.0f);
        }

        position += offset;
    }

    vec2 pixel = position * u_tileScale + u_tileOffset;
    vec2 clip = pixel / u_viewport * 2.0f - 1.0f;
    gl_Position = vec4(clip.x, -clip.y, 0.0f, 1.0f);
    v_lineDistance = 0.0f;
}
