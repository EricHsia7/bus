#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_palette;
uniform sampler2D u_styleData;
uniform float u_isLine;
uniform float u_isCircle;
uniform float u_darkMode;
uniform float u_deltaZoom;

in float v_style;
in vec2 v_pos;
in vec2 v_capCenter;
in float v_capRadius; // PIXELS; 0.0 -> not a cap
in vec2 v_capOut; // 0.0 -> skip the half-plane test (isolated point: full disc)
in vec2 v_circleCenter;
in float v_circleRadius;
out vec4 outColor;

const float CAP_ROUND = 1.0f;
const float CAP_SQUARE = 2.0f;
const float MIN_V = 0.12f;

vec4 styleTexel(float style, float texel) {
    int i = int(style * 4.0f + texel + 0.5f);
    return texelFetch(u_styleData, ivec2(i, 0), 0);
}

vec4 paletteColor(float index) {
    int i = int(index + 0.5f); // index arrives as a float; round, don't truncate
    vec4 color0 = texelFetch(u_palette, ivec2(i, 0), 0);
    vec4 color1 = texelFetch(u_palette, ivec2(i, 1), 0);
    return mix(color0, color1, u_deltaZoom);
}

vec3 saturate(vec3 color, float amount) {
    float m = min(color.r, min(color.g, color.b));
    return m + amount * (color - m);
}

void main() {
    vec4 appearanceData = styleTexel(v_style, 0.0f);
    float paletteIndex = appearanceData.x; // fill = polygon-fill, circle-fill, stroke

    // if(paletteIndex < -0.5f)
    //     discard;

    // Derivatives must be evaluated in uniform control flow, so compute the
    // signed distance and its screen-space gradient before any cap branching.

    // sd is in PIXELS from the rim: negative inside, positive outside. Using a
    // normalised radius here instead makes fwidth() equal 1/radius, so the
    // antialiasing band widens as lines get thinner and eats the whole cap at
    // small widths. In pixel units fwidth(sd) stays ~1.0 at every radius.

    if(u_isLine > 0.5f && v_capRadius > 0.0f) {
        vec2 d = v_pos - v_capCenter;
        vec4 strokeData = styleTexel(v_style, 1.0f);
        float capStyle = strokeData.z;

        // v_capOut is zero only for an isolated point, where dot() == 0.0
        // fails and the full disc is carved instead of a semicircle.
        bool beyondEnd = dot(d, v_capOut) > 0.0f;

        if(capStyle < CAP_ROUND - 0.5f) {
            // Butt: throw the extension away
            if(beyondEnd)
                discard;
        } else if(capStyle < CAP_SQUARE - 0.5f) {
            // Round
            if(beyondEnd || v_capOut == vec2(0.0f)) {
                if(dot(d, d) > v_capRadius * v_capRadius)
                    discard;
            }
        }
        // Square: keep the quad as-is
    }

    if(u_isCircle > 0.5f && v_circleRadius > 0.0f) {
        vec2 d = v_pos - v_circleCenter;
        if(dot(d, d) > v_circleRadius * v_circleRadius)
            discard;
    }

    vec4 color = paletteColor(paletteIndex);
    float opacity = appearanceData.y * appearanceData.z * color.a;

    if(u_darkMode > 0.5f) {
        float v = max(max(color.r, color.g), color.b);
        float newV = 0.05f + 0.95f * pow(1.0f - v, 1.25f);
        outColor = vec4(saturate(color.rgb * newV, 5.0f), opacity);
    } else {
        outColor = vec4(color.rgb, opacity);
    }
}
