#version 300 es

precision highp float;
precision highp int;

uniform sampler2D edges;
uniform int count;
uniform int texWidth;
uniform vec2 origin;
uniform float distRange;

out vec4 color;

void main() {
  vec2 p = origin + gl_FragCoord.xy;
  float md = distRange;
  int wind = 0;

  for(int i = 0; i < count; i++) {
    vec4 e = texelFetch(edges, ivec2(i % texWidth, i / texWidth), 0);
    vec2 a = e.xy, b = e.zw, v = b - a;
    float t = clamp(dot(p - a, v) / max(dot(v, v), 1e-20f), 0.f, 1.f);
    md = min(md, length(p - (a + t * v)));
    float side = (b.x - a.x) * (p.y - a.y) - (p.x - a.x) * (b.y - a.y);
    if(a.y <= p.y && b.y > p.y && side > 0.f)
      wind++;
    else if(a.y > p.y && b.y <= p.y && side < 0.f)
      wind--;
  }

  float signedD = wind != 0 ? md : -md;

  color = vec4(clamp(.5f + signedD / (2.f * distRange), 0.f, 1.f), 0.f, 0.f, 1.f);
}