from fastapi import APIRouter, Query, WebSocket, WebSocketDisconnect

from app.services.auth_service import decode_token
from app.ws_manager import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/{couple_id}")
async def websocket_endpoint(couple_id: str, ws: WebSocket, token: str = Query(...)):
    user_id = decode_token(token)
    if not user_id:
        await ws.close(code=4001)
        return

    await manager.connect(couple_id, ws)
    try:
        while True:
            await ws.receive_text()  # keep alive; client sends pings
    except WebSocketDisconnect:
        manager.disconnect(couple_id, ws)
