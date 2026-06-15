import { MODEL_VERSION, send } from './_lib';

export default function handler(_req: any, res: any): void {
  send(res, { status: 'ok', model: MODEL_VERSION, timestamp: new Date().toISOString() });
}
