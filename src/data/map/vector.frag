#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_palette;
uniform sampler2D u_styleData;
uniform float u_isLine;

in float v_style;
in vec2 v_pos;
in vec2 v_capCenter;
in float v_capRadius; // PIXELS; 0.0 -> not a cap
in vec2 v_capOut; // 0.0 -> skip the half-plane test (isolated point: full disc)

out vec4 outColor;

// capJoinData.x cap style: 0 = butt, 1 = round, 2 = square
const float CAP_ROUND = 1.0f;
const float CAP_SQUARE = 2.0f;

vec4 styleTexel(float style, float texel) {
    int i = int(style * 4.0f + texel + 0.5f);
    return texelFetch(u_styleData, ivec2(i, 0), 0);
}

vec4 paletteColor(float index) {
    int i = int(index + 0.5f); // index arrives as a float; round, don't truncate
    return texelFetch(u_palette, ivec2(i, 0), 0);
}

void main() {
    vec4 colorData = styleTexel(v_style, 0.0f);
    vec4 opacityData = styleTexel(v_style, 1.0f);
    vec4 capJoinData = styleTexel(v_style, 2.0f);

    float paletteIndex = u_isLine > 0.5f ? colorData.y : colorData.x;
    float localOpacity = u_isLine > 0.5f ? colorData.w : colorData.z;

    if(paletteIndex < -0.5f)
        discard;

    // Derivatives must be evaluated in uniform control flow, so compute the
    // signed distance and its screen-space gradient before any cap branching.

    // sd is in PIXELS from the rim: negative inside, positive outside. Using a
    // normalised radius here instead makes fwidth() equal 1/radius, so the
    // antialiasing band widens as lines get thinner and eats the whole cap at
    // small widths. In pixel units fwidth(sd) stays ~1.0 at every radius.
    vec2 d = v_pos - v_capCenter;

    if(v_capRadius > 0.0f) {
        float capStyle = capJoinData.x;

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

    vec4 color = paletteColor(paletteIndex);
    float opacity = opacityData.x * localOpacity * color.a;
    outColor = vec4(color.rgb, opacity);
}
