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
        float t = clamp(u_deltaZoom, 0.0f, 1.0f);
        float zoomScale = mix(scale0, scale1, t) * exp2(-t);
        float halfWidth = width * zoomScale * (u_extent / u_designTileSize) * u_devicePixelRatio * 0.5f;

        vec2 tangent;
        if(a_position == a_previous) {
            tangent = normalize(a_next - a_position);
        } else if(a_position == a_next) {
            tangent = normalize(a_position - a_previous);
        } else {
            vec2 t0 = normalize(a_position - a_previous);
            vec2 t1 = normalize(a_next - a_position);
            tangent = normalize(t0 + t1);
            if(length(tangent) < 0.0001f)
                tangent = t1;
        }

        vec2 normal = vec2(-tangent.y, tangent.x);
        position += normal * a_side * halfWidth;
    }

    vec2 pixel = position * u_tileScale + u_tileOffset;
    vec2 clip = pixel / u_viewport * 2.0f - 1.0f;
    gl_Position = vec4(clip.x, -clip.y, 0.0f, 1.0f);
    v_lineDistance = 0.0f;
}
