import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession';

export type EventHandler = (...args: any[]) => void
export type EventHandlerConnecting = (session: RTCSession, event: ConnectingEvent) => void
export type EventHandlerProgress = (session: RTCSession, event: IncomingEvent | OutgoingEvent) => void
export type EventHandlerAccepted = (session: RTCSession, event: IncomingEvent | OutgoingEvent) => void
export type EventHandlerEnded = (session: RTCSession, event: EndEvent) => void
export type EventHandlerFailed = (session: RTCSession, event: EndEvent) => void
