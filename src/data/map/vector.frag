#version 300 es
precision highp float;
precision highp int;

uniform sampler2D u_palette;
uniform sampler2D u_styleData;
uniform float u_paletteWidth;
uniform float u_styleTexelWidth;
uniform float u_isLine;

in float v_style;
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

    float paletteIndex = u_isLine > 0.5f ? colorData.y : colorData.x;
    float localOpacity = u_isLine > 0.5f ? colorData.w : colorData.z;

    if(paletteIndex < -0.5f)
        discard;

    vec4 color = paletteColor(paletteIndex);
    float opacity = opacityData.x * localOpacity * color.a;
    outColor = vec4(color.rgb, opacity);
}
