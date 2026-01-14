import { ImageResponse } from "next/og";
import { getTranslation } from "@/lib/i18n";
import Logo from "./dicecho.svg";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Default banner image URL
const DEFAULT_BANNER_URL =
  "https://file.dicecho.com/mod/600af94a44f096001d6e49df/2021033103382254.png";

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng);

  const title = t("metadata.ogTitle");
  const subtitle = t("metadata.ogDescription").slice(0, 100);
  const cta = t("metadata.ogCTA");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#3d3d4a",
        }}
      >
        {/* Top Content Area - 55% */}
        <div
          style={{
            height: "55%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px 20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo and Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Logo
              width={48}
              height={48}
              style={{
                marginRight: 12,
              }}
            />
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#9396f7",
                letterSpacing: "-0.01em",
              }}
            >
              Dicecho
            </span>
          </div>

          {/* Title */}
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            {title}
          </span>

          {/* Subtitle */}
          <span
            style={{
              fontSize: 18,
              color: "#a1a1aa",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 800,
              marginBottom: 20,
            }}
          >
            {subtitle}
          </span>

          {/* CTA Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#9396f7",
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              padding: "12px 32px",
              borderRadius: 40,
              boxShadow: "0 4px 16px rgba(147, 150, 247, 0.4)",
            }}
          >
            {cta}
          </div>
        </div>

        {/* Bottom Screenshot Area - 45% */}
        <div
          style={{
            height: "45%",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "0 60px",
            position: "relative",
          }}
        >
          {/* Browser Window Frame */}
          <div
            style={{
              width: "100%",
              maxWidth: 1000,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px 12px 0 0",
              overflow: "hidden",
              boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Browser Header Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: "#2d2d3a",
                gap: 8,
              }}
            >
              {/* Window Controls */}
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: "#28c840",
                }}
              />
              {/* URL Bar */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 16,
                  padding: "6px 16px",
                  backgroundColor: "#27272f",
                  borderRadius: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "#71717a",
                  }}
                >
                  dicecho.com
                </span>
              </div>
            </div>

            {/* Screenshot Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={DEFAULT_BANNER_URL}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
