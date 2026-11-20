#version 300 es

const vec2 p[3] = vec2[3](vec2(-1.f, -1.f), vec2(3.f, -1.f), vec2(-1.f, 3.f));

void main() {
  gl_Position = vec4(p[gl_VertexID], 0.f, 1.f);
}