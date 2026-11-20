import { FontIndex, Glyph, GlyphShard, GlyphShardWire, decodeCmap, decodeShard, fetchGzipJSON } from './glyph-types';
/** Read-only, worker-safe contour loader. No WebGL or browser font APIs. */
export class ContourFontSource {
  private cmap: Map<number, number>;
  private shards = new Map<number, Promise<GlyphShard>>();
  constructor(
    readonly glyphUrl: (id: string) => string,
    readonly index: FontIndex,
    readonly maxShards = 16
  ) {
    if (index.version !== 2 || index.weight !== 400 || !(index.unitsPerEm > 0) || !(index.shardSize > 0)) throw Error('Unsupported contour font');
    this.cmap = decodeCmap(index);
  }
  static async open(glyphUrl: (id: string) => string): Promise<ContourFontSource> {
    return new ContourFontSource(glyphUrl, await fetchGzipJSON<FontIndex>(glyphUrl('index')));
  }
  private shard(id: number): Promise<GlyphShard> {
    let p = this.shards.get(id);
    if (p) {
      this.shards.delete(id);
      this.shards.set(id, p);
      return p;
    }
    p = fetchGzipJSON<GlyphShardWire>(this.glyphUrl(`glyphs-${id}`)).then((w) => {
      if (w.base !== id * this.index.shardSize) throw Error('Invalid shard base');
      return decodeShard(w, this.index);
    });
    this.shards.set(id, p);
    p.catch(() => {
      if (this.shards.get(id) === p) this.shards.delete(id);
    });
    while (this.shards.size > this.maxShards) this.shards.delete(this.shards.keys().next().value!);
    return p;
  }
  /** Load the complete set needed by a tile. Missing characters use an invisible one-em placeholder. */
  async getGlyphs(texts: Iterable<string>): Promise<Map<number, Glyph>> {
    const needed = new Map<number, number>();
    const result = new Map<number, Glyph>();
    // Missing codepoints render no outline and reserve one em as an explicit approximation.
    const blank: Glyph = { id: -1, advance: this.index.unitsPerEm, lsb: 0, bbox: null, commands: [] };
    for (const text of texts)
      for (const ch of text) {
        const cp = ch.codePointAt(0)!,
          id = this.cmap.get(cp);
        if (id === undefined) result.set(cp, blank);
        else needed.set(cp, id);
      }
    const grouped = new Map<number, number[]>();
    for (const id of new Set(needed.values())) {
      const shard = Math.floor(id / this.index.shardSize);
      const list = grouped.get(shard) || [];
      list.push(id);
      grouped.set(shard, list);
    }
    const queue = Array.from(grouped.entries()),
      byId = new Map<number, Glyph>();
    let next = 0;
    await Promise.all(
      Array.from({ length: Math.min(4, queue.length) }, async () => {
        while (next < queue.length) {
          const [id, gids] = queue[next++];
          const shard = await this.shard(id);
          for (const gid of gids) {
            const g = shard.glyphs[gid - shard.base];
            if (!g || g.id !== gid) throw Error('Corrupt glyph shard');
            byId.set(gid, g);
          }
        }
      })
    );
    for (const [cp, gid] of needed) result.set(cp, byId.get(gid)!);
    return result;
  }
}
