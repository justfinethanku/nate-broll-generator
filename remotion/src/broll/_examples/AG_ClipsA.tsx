import React from "react";
import { useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import {
  BRollTemplate,
  GfxZone,
  OB1,
  FONTS,
  ease,
  fadeInUp,
  bouncePop,
  slideIn,
  countUp,
  stagger,
  pulse,
} from "../shared";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  AudioLines,
  Brain,
  Sparkles,
  Camera,
  Mail,
  Music,
  Globe,
  Calendar,
  MapPin,
  MessageSquare,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";

type ClipSpec = {
  id: string;
  title: string;
  subtitle?: string;
  bottomLabel: string;
  bottomAccent?: string;
  render: (frame: number, fps: number, zone: GfxZone) => React.ReactNode;
};

const clipSpecs: ClipSpec[] = [
  {
    id: "AG-001-MassiveInstallBase",
    title: "Install Base",
    subtitle: "Apple's advantage",
    bottomLabel: "1.5 billion users is the moat",
    bottomAccent: "1.5 billion",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = countUp(sceneFrame, 0, 90, 1.5);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Radiating rings */}
          {[1, 2, 3, 4].map((ring) => {
            const delay = ring * 15;
            const pulseVal = pulse(sceneFrame - delay, 0.03);
            const ringOpacity = ease(sceneFrame, delay, delay + 20) * (0.3 - ring * 0.05) * (0.5 + pulseVal * 0.5);
            const ringScale = 0.3 + ring * 0.2;

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: zone.width * ringScale,
                  height: zone.width * ringScale,
                  borderRadius: "50%",
                  border: `${Math.round(3 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Apple logo center */}
          <div
            style={{
              ...bouncePop(sceneFrame, 10, fps),
              marginBottom: zone.height * 0.05,
              zIndex: 1,
            }}
          >
            <Img
              src={staticFile("logos/apple.svg")}
              style={{
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          {/* Counter */}
          <div
            style={{
              ...fadeInUp(sceneFrame, 20),
              fontSize: Math.round(72 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 700,
              color: OB1.WHITE,
              marginBottom: zone.height * 0.08,
              zIndex: 10,
              position: "relative",
            }}
          >
            {count.toFixed(1)}B
          </div>

          {/* Stat callouts */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.04,
              alignItems: "flex-end",
              zIndex: 10,
              position: "relative",
            }}
          >
            {[
              { label: "iPhone", value: 1.2, color: OB1.ORANGE, delay: 40 },
              { label: "iPad", value: 0.6, color: OB1.CYAN, delay: 50 },
              { label: "Mac", value: 0.3, color: OB1.STEEL, delay: 60 },
            ].map((stat) => {
              const barHeight = ease(sceneFrame, stat.delay, stat.delay + 30) * (zone.height * 0.15 * (stat.value / 1.2));
              return (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: Math.round(8 * zone.scale),
                  }}
                >
                  <div
                    style={{
                      width: zone.width * 0.12,
                      height: barHeight,
                      backgroundColor: stat.color,
                      borderRadius: Math.round(4 * zone.scale),
                    }}
                  />
                  <div
                    style={{
                      fontSize: Math.round(18 * zone.scale),
                      fontFamily: FONTS.heading,
                      fontWeight: 600,
                      color: OB1.WHITE,
                      opacity: ease(sceneFrame, stat.delay + 20, stat.delay + 30),
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    id: "AG-002-TractionThatAnthropic",
    title: "Enterprise Shift",
    subtitle: "competitive landscape",
    bottomLabel: "Anthropic is gaining ground fast",
    bottomAccent: "gaining ground",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            gap: zone.width * 0.05,
            padding: `0 ${zone.width * 0.08}px`,
          }}
        >
          {/* OpenAI - declining */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, stagger(0, 10, 15)),
            }}
          >
            <Img
              src={staticFile("logos/openai.svg")}
              style={{
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div style={{ position: "relative", height: zone.height * 0.3 }}>
              <div
                style={{
                  width: zone.width * 0.15,
                  height: zone.height * 0.3 * (1 - ease(sceneFrame, 40, 90) * 0.4),
                  backgroundColor: OB1.DIM,
                  borderRadius: Math.round(6 * zone.scale),
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </div>
            <ArrowDown
              size={Math.round(40 * zone.scale)}
              color={OB1.RED}
              style={{
                opacity: ease(sceneFrame, 50, 70),
              }}
            />
          </div>

          {/* Anthropic - rising */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, stagger(1, 10, 15)),
            }}
          >
            <Img
              src={staticFile("logos/anthropic.svg")}
              style={{
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div style={{ position: "relative", height: zone.height * 0.3 }}>
              <div
                style={{
                  width: zone.width * 0.15,
                  height: zone.height * 0.3 * ease(sceneFrame, 40, 90) * 0.85,
                  backgroundColor: OB1.GREEN,
                  borderRadius: Math.round(6 * zone.scale),
                  position: "absolute",
                  bottom: 0,
                }}
              />
            </div>
            <ArrowUp
              size={Math.round(40 * zone.scale)}
              color={OB1.GREEN}
              style={{
                opacity: ease(sceneFrame, 50, 70),
              }}
            />
          </div>

          {/* Apple - waiting */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(20 * zone.scale),
              ...fadeInUp(sceneFrame, stagger(2, 10, 15)),
            }}
          >
            <Img
              src={staticFile("logos/apple.svg")}
              style={{
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div style={{ position: "relative", height: zone.height * 0.3 }}>
              <div
                style={{
                  width: zone.width * 0.15,
                  height: zone.height * 0.3 * 0.5,
                  backgroundColor: OB1.STEEL,
                  borderRadius: Math.round(6 * zone.scale),
                  position: "absolute",
                  bottom: 0,
                  opacity: ease(sceneFrame, 40, 60),
                }}
              />
            </div>
            <Clock
              size={Math.round(40 * zone.scale)}
              color={OB1.AMBER}
              style={{
                opacity: ease(sceneFrame, 50, 70) * (0.7 + pulse(sceneFrame, 0.05) * 0.3),
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "AG-003-MultiBillionUser",
    title: "The Shift",
    subtitle: "H2 2026",
    bottomLabel: "A multi-billion user migration is coming",
    bottomAccent: "multi-billion",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);
      const count = countUp(sceneFrame, 0, 120, 2);

      const gridCols = 40;
      const gridRows = 20;
      const dotSize = Math.min(zone.width / gridCols, zone.height / gridRows) * 0.6;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Dot grid */}
          <div
            style={{
              position: "absolute",
              display: "grid",
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
              gap: Math.round(2 * zone.scale),
              width: zone.width * 0.9,
              height: zone.height * 0.7,
              zIndex: 0,
            }}
          >
            {Array.from({ length: gridRows * gridCols }).map((_, i) => {
              const col = i % gridCols;
              const row = Math.floor(i / gridCols);
              const waveDelay = col * 2 + row * 1;
              const waveProgress = ease(sceneFrame, waveDelay, waveDelay + 40);
              const dotColor = waveProgress > 0.5 ? OB1.CYAN : OB1.DIM;

              return (
                <div
                  key={i}
                  style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: "50%",
                    backgroundColor: dotColor,
                    opacity: 0.3 + waveProgress * 0.7,
                  }}
                />
              );
            })}
          </div>

          {/* Counter overlay */}
          <div
            style={{
              ...bouncePop(sceneFrame, 20, fps),
              fontSize: Math.round(96 * zone.scale),
              fontFamily: FONTS.heading,
              fontWeight: 800,
              color: OB1.WHITE,
              textShadow: `0 0 ${Math.round(40 * zone.scale)}px ${OB1.BG_DARK}`,
              zIndex: 10,
              position: "relative",
            }}
          >
            {count.toFixed(1)}B+
          </div>
        </div>
      );
    },
  },
  {
    id: "AG-004-StandaloneApp",
    title: "Signal 1: Siri",
    subtitle: "standalone chatbot",
    bottomLabel: "Siri becomes a standalone AI app",
    bottomAccent: "standalone",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Phone outline */}
          <div
            style={{
              width: zone.width * 0.4,
              height: zone.height * 0.85,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.STEEL}`,
              borderRadius: Math.round(32 * zone.scale),
              backgroundColor: OB1.BG_DARK,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              padding: zone.height * 0.08,
              ...bouncePop(sceneFrame, 0, fps),
            }}
          >
            {/* Apple logo in corner */}
            <Img
              src={staticFile("logos/apple.svg")}
              style={{
                width: Math.round(24 * zone.scale),
                height: Math.round(24 * zone.scale),
                filter: "brightness(0) invert(1)",
                position: "absolute",
                top: Math.round(16 * zone.scale),
                left: Math.round(16 * zone.scale),
                opacity: ease(sceneFrame, 10, 20),
              }}
            />

            {/* Siri waveform icon - fades out */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: Math.max(0, 1 - ease(sceneFrame, 40, 60)),
                zIndex: 1,
              }}
            >
              <AudioLines size={Math.round(80 * zone.scale)} color={OB1.ORANGE} />
            </div>

            {/* Chat bubbles - fade in */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: Math.round(12 * zone.scale),
                alignItems: "flex-start",
                marginTop: zone.height * 0.15,
              }}
            >
              {[
                { delay: 50, align: "flex-start", color: OB1.STEEL },
                { delay: 65, align: "flex-end", color: OB1.ORANGE },
                { delay: 80, align: "flex-start", color: OB1.STEEL },
                { delay: 95, align: "flex-end", color: OB1.ORANGE },
              ].map((bubble, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: bubble.align as "flex-start" | "flex-end",
                    ...slideIn(sceneFrame, bubble.delay, 15, bubble.align === "flex-start" ? "left" : "right", 30),
                  }}
                >
                  <div
                    style={{
                      width: zone.width * 0.25,
                      height: Math.round(32 * zone.scale),
                      backgroundColor: bubble.color,
                      borderRadius: Math.round(16 * zone.scale),
                      opacity: 0.8,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "AG-005-EmbeddedLinkLayered",
    title: "Layered Access",
    subtitle: "cross-app AI",
    bottomLabel: "Siri connects every app on the phone",
    bottomAccent: "every app",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: zone.height * 0.1,
          }}
        >
          {/* Top layer - iOS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            <Img
              src={staticFile("logos/apple.svg")}
              style={{
                width: Math.round(48 * zone.scale),
                height: Math.round(48 * zone.scale),
                filter: "brightness(0) invert(1)",
              }}
            />
            <div
              style={{
                fontSize: Math.round(32 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              iOS
            </div>
          </div>

          {/* Connection line 1 */}
          <svg width={Math.round(4 * zone.scale)} height={zone.height * 0.08} style={{ opacity: ease(sceneFrame, 20, 40) }}>
            <line
              x1={Math.round(2 * zone.scale)}
              y1="0"
              x2={Math.round(2 * zone.scale)}
              y2={zone.height * 0.08 * ease(sceneFrame, 20, 40)}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
            />
          </svg>

          {/* Middle layer - Siri Intelligence */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: Math.round(16 * zone.scale),
              padding: `${Math.round(16 * zone.scale)}px ${Math.round(32 * zone.scale)}px`,
              backgroundColor: OB1.BG_MID,
              borderRadius: Math.round(12 * zone.scale),
              border: `${Math.round(2 * zone.scale)}px solid ${OB1.ORANGE}`,
              ...bouncePop(sceneFrame, 30, fps),
              boxShadow: `0 0 ${Math.round(30 * zone.scale)}px ${OB1.ORANGE}${Math.round(ease(sceneFrame, 40, 60) * 0.4 * 255).toString(16).padStart(2, "0")}`,
            }}
          >
            <Brain size={Math.round(40 * zone.scale)} color={OB1.ORANGE} />
            <div
              style={{
                fontSize: Math.round(28 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              Siri Intelligence
            </div>
            <Sparkles size={Math.round(32 * zone.scale)} color={OB1.CYAN} />
          </div>

          {/* Connection line 2 */}
          <svg width={Math.round(4 * zone.scale)} height={zone.height * 0.08} style={{ opacity: ease(sceneFrame, 50, 70) }}>
            <line
              x1={Math.round(2 * zone.scale)}
              y1="0"
              x2={Math.round(2 * zone.scale)}
              y2={zone.height * 0.08 * ease(sceneFrame, 50, 70)}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
            />
          </svg>

          {/* Bottom layer - Apps */}
          <div
            style={{
              display: "flex",
              gap: zone.width * 0.06,
              alignItems: "center",
            }}
          >
            {[
              { Icon: Camera, delay: 70, color: OB1.STEEL },
              { Icon: Mail, delay: 80, color: OB1.ORANGE },
              { Icon: Music, delay: 90, color: OB1.PURPLE },
              { Icon: Globe, delay: 100, color: OB1.CYAN },
            ].map(({ Icon, delay, color }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: Math.round(56 * zone.scale),
                  height: Math.round(56 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(12 * zone.scale),
                  ...bouncePop(sceneFrame, delay, fps),
                }}
              >
                <Icon size={Math.round(32 * zone.scale)} color={color} />
              </div>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    id: "AG-006-AmbientIntelligence",
    title: "Ambient AI",
    subtitle: "always present",
    bottomLabel: "Intelligence embedded in every interaction",
    bottomAccent: "every interaction",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      const phoneWidth = zone.width * 0.25;
      const phoneHeight = zone.height * 0.6;

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* Pulsing rings */}
          {[1, 2, 3, 4, 5].map((ring) => {
            const delay = ring * 12;
            const pulseVal = pulse(sceneFrame - delay, 0.025);
            const ringOpacity = ease(sceneFrame, delay, delay + 20) * (0.25 - ring * 0.03) * (0.6 + pulseVal * 0.4);
            const ringRadius = (zone.width * 0.2) + (ring * zone.width * 0.08);

            return (
              <div
                key={ring}
                style={{
                  position: "absolute",
                  width: ringRadius * 2,
                  height: ringRadius * 2,
                  borderRadius: "50%",
                  border: `${Math.round(2 * zone.scale)}px solid ${OB1.CYAN}`,
                  opacity: ringOpacity,
                  zIndex: 0,
                }}
              />
            );
          })}

          {/* Center phone */}
          <div
            style={{
              width: phoneWidth,
              height: phoneHeight,
              border: `${Math.round(4 * zone.scale)}px solid ${OB1.ORANGE}`,
              borderRadius: Math.round(24 * zone.scale),
              backgroundColor: OB1.BG_MID,
              ...bouncePop(sceneFrame, 0, fps),
              zIndex: 1,
            }}
          />

          {/* Context icons around rings */}
          {[
            { Icon: Calendar, angle: 0, ring: 4, delay: 40, color: OB1.ORANGE },
            { Icon: MapPin, angle: 60, ring: 5, delay: 50, color: OB1.GREEN },
            { Icon: MessageSquare, angle: 120, ring: 4, delay: 60, color: OB1.CYAN },
            { Icon: Camera, angle: 180, ring: 5, delay: 70, color: OB1.PURPLE },
            { Icon: Music, angle: 240, ring: 4, delay: 80, color: OB1.AMBER },
            { Icon: ShoppingCart, angle: 300, ring: 5, delay: 90, color: OB1.STEEL },
          ].map(({ Icon, angle, ring, delay, color }, i) => {
            const ringRadius = (zone.width * 0.2) + (ring * zone.width * 0.08);
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * ringRadius;
            const y = Math.sin(radian) * ringRadius;

            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              >
              <div style={{ ...bouncePop(sceneFrame, delay, fps) }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: Math.round(48 * zone.scale),
                    height: Math.round(48 * zone.scale),
                    backgroundColor: OB1.BG_DARK,
                    borderRadius: "50%",
                    border: `${Math.round(2 * zone.scale)}px solid ${color}`,
                  }}
                >
                  <Icon size={Math.round(28 * zone.scale)} color={color} />
                </div>
              </div>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "AG-007-LikeAppIntents",
    title: "Signal 2: App Intents",
    subtitle: "agentic framework",
    bottomLabel: "Developers wire apps for AI interaction",
    bottomAccent: "AI interaction",
    render: (frame, fps, zone) => {
      const sceneFrame = Math.max(0, frame - 90);

      return (
        <div
          style={{
            width: zone.width,
            height: zone.height,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${zone.width * 0.08}px`,
          }}
        >
          {/* Left - User */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              ...fadeInUp(sceneFrame, 0),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(80 * zone.scale),
                height: Math.round(80 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: "50%",
                border: `${Math.round(3 * zone.scale)}px solid ${OB1.STEEL}`,
              }}
            >
              <User size={Math.round(48 * zone.scale)} color={OB1.WHITE} />
            </div>
            <div
              style={{
                fontSize: Math.round(20 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 600,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              User
            </div>
          </div>

          {/* Arrow line to center */}
          <svg width={zone.width * 0.15} height={Math.round(4 * zone.scale)} style={{ opacity: ease(sceneFrame, 20, 40) }}>
            <line
              x1="0"
              y1={Math.round(2 * zone.scale)}
              x2={zone.width * 0.15 * ease(sceneFrame, 20, 40)}
              y2={Math.round(2 * zone.scale)}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
            />
          </svg>

          {/* Center - App Intents Router */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Math.round(12 * zone.scale),
              ...bouncePop(sceneFrame, 30, fps),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(100 * zone.scale),
                height: Math.round(100 * zone.scale),
                backgroundColor: OB1.ORANGE,
                borderRadius: Math.round(20 * zone.scale),
                boxShadow: `0 0 ${Math.round(40 * zone.scale)}px ${OB1.ORANGE}${Math.round(pulse(sceneFrame, 0.04) * 0.6 * 255).toString(16).padStart(2, "0")}`,
              }}
            >
              <Zap size={Math.round(60 * zone.scale)} color={OB1.WHITE} />
            </div>
            <div
              style={{
                fontSize: Math.round(20 * zone.scale),
                fontFamily: FONTS.heading,
                fontWeight: 700,
                color: OB1.WHITE,
                zIndex: 10,
                position: "relative",
              }}
            >
              App Intents
            </div>
          </div>

          {/* Arrow line to right */}
          <svg width={zone.width * 0.15} height={Math.round(4 * zone.scale)} style={{ opacity: ease(sceneFrame, 50, 70) }}>
            <line
              x1="0"
              y1={Math.round(2 * zone.scale)}
              x2={zone.width * 0.15 * ease(sceneFrame, 50, 70)}
              y2={Math.round(2 * zone.scale)}
              stroke={OB1.CYAN}
              strokeWidth={Math.round(3 * zone.scale)}
            />
          </svg>

          {/* Right - Target apps */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: Math.round(16 * zone.scale),
            }}
          >
            {[
              { Icon: Camera, delay: 70, color: OB1.STEEL },
              { Icon: Mail, delay: 80, color: OB1.ORANGE },
              { Icon: Globe, delay: 90, color: OB1.CYAN },
            ].map(({ Icon, delay, color }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: Math.round(48 * zone.scale),
                  height: Math.round(48 * zone.scale),
                  backgroundColor: OB1.BG_MID,
                  borderRadius: Math.round(12 * zone.scale),
                  border: `${Math.round(2 * zone.scale)}px solid ${color}`,
                  ...bouncePop(sceneFrame, delay, fps),
                }}
              >
                <Icon size={Math.round(28 * zone.scale)} color={color} />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.round(48 * zone.scale),
                height: Math.round(48 * zone.scale),
                backgroundColor: OB1.BG_MID,
                borderRadius: Math.round(12 * zone.scale),
                ...bouncePop(sceneFrame, 100, fps),
              }}
            >
              <Img
                src={staticFile("logos/amazonwebservices.svg")}
                style={{
                  width: Math.round(32 * zone.scale),
                  height: Math.round(32 * zone.scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            </div>
          </div>
        </div>
      );
    },
  },
];

const makeClip = (spec: ClipSpec): React.FC => {
  const ClipComponent: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return (
      <BRollTemplate
        title={spec.title}
        subtitle={spec.subtitle}
        bottomLabel={spec.bottomLabel}
        bottomAccent={spec.bottomAccent}
        scenes={[
          {
            start: 90,
            end: 300,
            render: (_f, _progress, zone) => spec.render(frame, fps, zone),
          },
        ]}
      />
    );
  };
  ClipComponent.displayName = spec.id;
  return ClipComponent;
};

export const AG_CLIPS_A = clipSpecs.map((spec) => ({
  id: spec.id,
  component: makeClip(spec),
}));
