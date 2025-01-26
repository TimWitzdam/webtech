export default interface Course {
  _id: string;
  name: string;
  emoji: string;
  lastChanged: string;
  progress: { current: number; total: number };
}
