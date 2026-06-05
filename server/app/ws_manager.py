import json

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = {}

    async def connect(self, couple_id: str, ws: WebSocket):
        await ws.accept()
        self.rooms.setdefault(couple_id, []).append(ws)

    def disconnect(self, couple_id: str, ws: WebSocket):
        room = self.rooms.get(couple_id, [])
        if ws in room:
            room.remove(ws)
        if not room:
            self.rooms.pop(couple_id, None)

    async def broadcast(self, couple_id: str, payload: dict):
        room = self.rooms.get(couple_id, [])
        dead = []
        for ws in room:
            try:
                await ws.send_text(json.dumps(payload))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(couple_id, ws)


manager = ConnectionManager()
