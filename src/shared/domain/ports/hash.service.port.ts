export abstract class HashServicePort {
  abstract generate(data: string, round: number): Promise<string>;
  abstract compare(data: string, hashed: string): Promise<boolean>;
}
