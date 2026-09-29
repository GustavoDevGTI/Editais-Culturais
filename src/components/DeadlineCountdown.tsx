import { useEffect, useState } from "react";
import styles from "./DeadlineCountdown.module.css";

interface DeadlineCountdownProps {
  deadlineAt: string;
}

const countdownWindowSeconds = 3 * 24 * 60 * 60;

export function DeadlineCountdown({ deadlineAt }: DeadlineCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = window.setInterval(refresh, 1000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const remainingSeconds = Math.max(0, Math.ceil((Date.parse(deadlineAt) - now) / 1000));
  if (remainingSeconds === 0) return <>Encerrado</>;
  if (remainingSeconds > countdownWindowSeconds) return <>Aberto</>;

  const days = Math.floor(remainingSeconds / 86_400);
  const hours = Math.floor((remainingSeconds % 86_400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const time = `${days > 0 ? `${days}d ` : ""}${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}min ${String(seconds).padStart(2, "0")}s`;

  return (
    <span
      className={styles.countdown}
      role="timer"
      aria-live="off"
      aria-label={`Encerra em ${days} ${days === 1 ? "dia" : "dias"}, ${hours} ${hours === 1 ? "hora" : "horas"}, ${minutes} ${minutes === 1 ? "minuto" : "minutos"} e ${seconds} ${seconds === 1 ? "segundo" : "segundos"}`}
    >
      Encerra em {time}
    </span>
  );
}
