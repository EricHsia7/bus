#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_palette;
uniform sampler2D u_styleData;
uniform float u_paletteWidth;
uniform float u_styleTexelWidth;
uniform float u_isLine;

in float v_style;
in vec2 v_pos;
flat in vec2 v_capOut;
flat in vec2 v_capCenter;
flat in float v_capRadius;   // 0.0 => not a cap
out vec4 outColor;

vec4 styleTexel(float style, float texel) {
    float x = (style * 4.0f + texel + 0.5f) / u_styleTexelWidth;
    return texture(u_styleData, vec2(x, 0.5f));
}

vec4 paletteColor(float index) {
    float x = (index + 0.5f) / u_paletteWidth;
    return texture(u_palette, vec2(x, 0.5f));
}

void main() {
    vec4 colorData = styleTexel(v_style, 0.0f);
    vec4 opacityData = styleTexel(v_style, 1.0f);
    vec4 capJoinData = styleTexel(v_style, 2.0f);

    float paletteIndex = u_isLine > 0.5f ? colorData.y : colorData.x;
    float localOpacity = u_isLine > 0.5f ? colorData.w : colorData.z;

    if(paletteIndex < -0.5f)
        discard;

    vec2 d = v_pos - v_capCenter;      // v_pos must be smooth, not flat
    float dist = length(d);
    float r = dist / max(v_capRadius, 1e-6f);
    float aa = fwidth(r);

    // round cap
    float capCoverage = 1.0f;
    if(capJoinData.x > 0.5f && capJoinData.x < 1.5f) {
        if(v_capRadius > 0.0f && dot(d, v_capOut) > 0.0f) {
            capCoverage = 1.0f - smoothstep(1.0f - aa, 1.0f, r);
            if(capCoverage <= 0.0f)
                discard;
        }
    }

    vec4 color = paletteColor(paletteIndex);
    float opacity = opacityData.x * localOpacity * color.a;
    outColor = vec4(color.rgb, opacity);
}
