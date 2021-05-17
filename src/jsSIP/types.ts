import { JsSIP } from '@/jsSIP/plugin'
import { ConnectingEvent, EndEvent, IncomingEvent, OutgoingEvent, RTCSession } from 'jssip/lib/RTCSession'

export type EventHandler = (...args: any[]) => void
export type EventHandlerConnecting = (self: JsSIP, session: RTCSession, event: ConnectingEvent) => void
export type EventHandlerProgress = (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => void
export type EventHandlerAccepted = (self: JsSIP, session: RTCSession, event: IncomingEvent | OutgoingEvent) => void
export type EventHandlerEnded = (self: JsSIP, session: RTCSession, event: EndEvent) => void
export type EventHandlerFailed = (self: JsSIP, session: RTCSession, event: EndEvent) => void
