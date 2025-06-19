import { Result } from "./types";


const sseConnections = new Map();

export function addSSEConnection(userId: string, videoId: string, res: any) {
  const key = `${userId}-${videoId}`;
  sseConnections.set(key, res);
}

export function removeSSEConnection(userId:string,videoId:string,res:any) {
  const key = `${userId}-${videoId}`;
  if (sseConnections.has(key)) {
      sseConnections.delete(key);
  }
}

export function notifySSEClients(userId:string,videoId:string,result:Result) {
  const key = `${userId}-${videoId}`;
  if (sseConnections.has(key)) {
    const res = sseConnections.get(key);
    res.write(`data: ${JSON.stringify(result)}\n\n`);
    
    // Only delete the connection if the status is 'close' or 'error'
    if (result.status === 'close' || result.status === 'error') {
      sseConnections.delete(key);
    }
  }
}