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
const float MITER_LIMIT = 4.0f;

// Squared length below which a segment counts as degenerate. Tile coordinates
// are quantised to u_extent, so distinct source points routinely collapse onto
// each other and must never reach normalize().
const float EPS2 = 1e-12f;

// Constant overshoot, in design pixels, added to every line end on top of the
// square cap. The cap alone extends by the line's OWN half width, so a narrow
// road fill extends less than the wider casing beneath it and the casing shows
// through at joins. A constant term is independent of width, so fills meet
// across a tile boundary regardless of the casing width under them.
const float OVERSHOOT_PX = 1.0f;

vec4 styleTexel(float style, float texel) {
    float x = (style * 4.0f + texel + 0.5f) / u_styleTexelWidth;
    return texture(u_styleData, vec2(x, 0.5f));
}

void main() {
    v_style = a_style;

    vec2 position = a_position;

    // Design pixels -> tile units, the same conversion the half width uses.
    float toTile = (u_extent / u_designTileSize) * u_devicePixelRatio;
    float overshoot = OVERSHOOT_PX * toTile;

    if(u_isLine > 0.5f) {
        vec4 widthData = styleTexel(a_style, 1.0f);
        float width = widthData.y;
        float scale0 = widthData.z;
        float scale1 = widthData.w;
        float zoomScale = mix(scale0, scale1, u_deltaZoom) * exp2(-u_deltaZoom);
        float halfWidth = width * zoomScale * toTile * 0.5f;

        // Segment vectors. Lengths are tested before any normalize() so a
        // zero-length segment cannot yield NaN and silently delete triangles.
        vec2 d0 = a_position - a_previous;
        vec2 d1 = a_next - a_position;
        bool has0 = dot(d0, d0) > EPS2;
        bool has1 = dot(d1, d1) > EPS2;

        vec2 t0 = has0 ? d0 * inversesqrt(dot(d0, d0)) : vec2(0.0f);
        vec2 t1 = has1 ? d1 * inversesqrt(dot(d1, d1)) : vec2(0.0f);

        vec2 offset;

        if(has0 && has1) {
            // Interior vertex: mitre the join.
            vec2 sum = t0 + t1;
            vec2 tangent;
            if(dot(sum, sum) > EPS2) {
                tangent = sum * inversesqrt(dot(sum, sum));
            } else {
                // Line doubles back: t0 == -t1 and the mitre is undefined.
                tangent = t1;
            }

            vec2 mitreNormal = vec2(-tangent.y, tangent.x);
            vec2 segNormal = vec2(-t1.y, t1.x);
            float cosHalf = dot(mitreNormal, segNormal);
            float mitreScale = 1.0f / max(abs(cosHalf), 1.0f / MITER_LIMIT);

            offset = mitreNormal * a_side * halfWidth * mitreScale;
        } else if(has0 || has1) {
            // Endpoint: extrude sideways, and extend along the line by one half
            // width PLUS a constant overshoot so fills connect over casings.
            vec2 dir = has1 ? t1 : t0;
            float along = has1 ? -1.0f : 1.0f;
            vec2 normal = vec2(-dir.y, dir.x);
            offset = normal * a_side * halfWidth + dir * along * (halfWidth + overshoot);
        } else {
            offset = vec2(0.0f);
        }

        position += offset;
    }

    vec2 pixel = position * u_tileScale + u_tileOffset;
    vec2 clip = pixel / u_viewport * 2.0f - 1.0f;
    gl_Position = vec4(clip.x, -clip.y, 0.0f, 1.0f);
    v_lineDistance = 0.0f;
}
