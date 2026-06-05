import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { accessTokenAtom } from "../atoms/auth";
import { coupleAtom } from "../atoms/couple";
import { wsStatusAtom } from "../atoms/ws";
import { usePlans } from "./usePlans";

export function useCoupleWebSocket() {
  const token = useAtomValue(accessTokenAtom);
  const couple = useAtomValue(coupleAtom);
  const setWsStatus = useSetAtom(wsStatusAtom);
  const { refreshPlan } = usePlans();
  const wsRef = useRef<WebSocket | null>(null);
  const retryDelay = useRef(1000);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!token || !couple) return;

    function connect() {
      if (!mounted.current) return;
      setWsStatus("connecting");

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.host;
      const ws = new WebSocket(`${protocol}://${host}/ws/${couple!.id}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mounted.current) return ws.close();
        setWsStatus("connected");
        retryDelay.current = 1000;
        // Send ping every 30s to keep alive
        const ping = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send("ping");
          else clearInterval(ping);
        }, 30000);
      };

      ws.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === "plan_updated" && payload.plan_id) {
            refreshPlan(payload.plan_id);
          }
        } catch {}
      };

      ws.onclose = () => {
        if (!mounted.current) return;
        setWsStatus("disconnected");
        wsRef.current = null;
        retryTimeout.current = setTimeout(() => {
          retryDelay.current = Math.min(retryDelay.current * 2, 30000);
          connect();
        }, retryDelay.current);
      };

      ws.onerror = () => ws.close();
    }

    connect();

    return () => {
      mounted.current = false;
      wsRef.current?.close();
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
    };
  }, [token, couple?.id]);
}
