
export interface Game {
  name: string,
  coverUrl: string,
  description?: string,
  platforms?: { name: string; color: string }[],
  genre?: string[]
}