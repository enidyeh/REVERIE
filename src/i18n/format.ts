// 数字与量词的格式化工具：中文没有复数变化，英文按单复数取词。

/** 英文单复数：`plural(1, 'ticket', 'tickets')`。 */
export function plural(count: number, one: string, many: string): string {
  return count === 1 ? one : many
}
