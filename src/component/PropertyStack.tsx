"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { colorcode } from "./Portfoliograph";

const PropertyStack = ({
  values,
  color
}: {
  color: {
    lonecomplete: string;
    propertysold: string;
    propertyadded: string;
    investmentopportunity: string;
    projectedvalue: string;
    equity: string;
    outstandingloan: string;
  };
  values: {
    projected: number;
    Equity: number;
    outstanding: number;
    details: Array<{
      title: string;
      value: string;
      loan: string;
      equity: string;
      milestones?: {
        propertySold?: boolean;
        loanComplete?: boolean;
        propertyAdded?: boolean;
        investmentOpportunity?: boolean;
      };
    }>;
    propertyAdded?: boolean;
    loanComplete?: boolean;
    propertySold?: boolean;
    investmentOpportunity?: boolean;
  };
}) => {
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [isAnimated, setIsAnimated] = useState(false);
  const spanRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  // Function to update tooltip position
  const updateTooltipPosition = () => {
    if (hovered && dotRef.current) {
      const dotRect = dotRef.current.getBoundingClientRect();
      const tooltipElement = tooltipRef.current;
      const tooltipHeight = tooltipElement?.offsetHeight || 50; // Default height if ref is null
      const tooltipWidth = tooltipElement?.offsetWidth || 204; // Default width if ref is null

      setTooltipPos({
        top: dotRect.top + window.scrollY - tooltipHeight - 5,
        left: dotRect.left + window.scrollX - tooltipWidth / 2 + dotRect.width / 2,
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (hovered) {
        updateTooltipPosition(); // Update position on scroll
      }
    };

    if (hovered) {
      updateTooltipPosition(); // Set initial position on hover
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hovered]);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = (event: React.MouseEvent) => {
    if (tooltipRef.current?.contains(event.relatedTarget as Node)) {
      return;
    }
    setHovered(false);
  };

  const sortedColors = Object.entries(values)
    .filter(([key]) => ["projected", "Equity", "outstanding"].includes(key))
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  const activeOptions = [
    "projectedValue",
    "loanComplete",
    "outstandingLoan",
    "propertySold",
    "propertyAdded",
    "equity",
    "investmentOpportunity",
  ].filter((option) => values[option as keyof typeof values]);

  const optionColors: Record<string, string> = {
    projectedValue: color.projectedvalue,
    loanComplete: color.lonecomplete,
    outstandingLoan: color.outstandingloan,
    propertySold: color.propertysold,
    propertyAdded: color.propertyadded,
    equity: color.equity,
    investmentOpportunity: color.investmentopportunity,
  };

  const getMilestoneColor = (milestones: any, color: colorcode) => {
    const milestoneColors = {
      propertySold: color.propertysold,
      loanComplete: color.lonecomplete,
      propertyAdded: color.propertyadded,
      investmentOpportunity: color.investmentopportunity,
    };

    for (const key in milestoneColors) {
      if (milestones[key as keyof typeof milestoneColors]) return milestoneColors[key as keyof typeof milestoneColors];
    }
    return "gray";
  };

  return (
    <>
      <div style={{ overflow: "visible" }}>
        <div
          ref={spanRef}
          style={{
            position: "relative",
            width: "21px",
            height: "95px",
            backgroundColor: "#ECECF0",
            borderTopLeftRadius: "2px",
            borderTopRightRadius: "2px",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            overflow: "visible",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            style={{
              width: "100%",
              backgroundColor: "#ECECF0",
              borderRadius: "12px",
              height: "100px",
              position: "relative",
            }}
          >
            {activeOptions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: "5px",
                  zIndex: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {activeOptions.map((option, index) => (
                  <div
                    style={{
                      backgroundColor: optionColors[option],
                      width: "12px",
                      height: "12px",
                      border: "1.5px dashed #FFFFFF",
                      borderRadius: "9999px",
                      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                    key={option}
                    ref={index === 0 ? dotRef : null}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {sortedColors.map(([colors, value]) => (
            <div
              key={colors}
              style={{
                width: "100%",
                borderTopLeftRadius: "7px",
                borderTopRightRadius: "7px",
                marginBottom: "-1px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                transition: "all 200ms ease-out",
                backgroundColor:
                  colors === "projected"
                    ? color.projectedvalue
                    : colors === "Equity"
                      ? color.equity
                      : color.outstandingloan,
                height: isAnimated ? `${value}%` : "0%",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,1))",
              }}
            />
          ))}
        </div>
      </div>

      {hovered &&
        values.details &&
        Array.isArray(values.details) &&
        (values.propertyAdded ||
          values.loanComplete ||
          values.propertySold ||
          values.investmentOpportunity) &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              backgroundColor: "white",
              boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
              padding: "4px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "1px solid #D1D5DB",
              width: "204px",
              zIndex: 9999,
              top: tooltipPos.top,
              left: tooltipPos.left,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "-6px",
                width: "16px",
                height: "16px",
                backgroundColor: "white",
                transform: "translateX(-50%) rotate(45deg)",
                borderRadius: "1px",
              }}
            ></div>

            {values.details.map((detail, index) => (
              <div
                key={index}
                style={{
                  padding: "4px",
                  ...(index !== values.details.length - 1 && {
                    borderBottom: "1px solid #D1D5DB",
                    paddingBottom: "8px",
                    marginBottom: "8px",
                  }),
                }}
              >
                <div style={{ display: "flex", padding: "4px", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      border: "1px dashed #FFFFFF",
                      boxShadow: "-20px 1px 100px 50px rgba(0, 0, 0, 0.1)",
                      borderRadius: "9999px",
                      backgroundColor: getMilestoneColor(detail.milestones, color),
                    }}
                  ></span>
                  <h2 style={{ fontSize: "12px", fontWeight: 500, margin: 0 }}>{detail.title}</h2>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", padding: "4px", alignItems: "center", gap: "8px", width: "fit-content" }}>
                    <span style={{ minWidth: "12px", height: "12px", backgroundColor: "#10B981", borderRadius: "9999px" }}></span>

                    <p style={{ color: "#6D6D6D", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", margin: 0 }}>
                      Value:
                      <span style={{ fontWeight: 500, fontSize: "12px", color: "#121212", margin: 0 }}>${detail.value}</span>
                    </p>

                  </div>
                  <div style={{ display: "flex", padding: "4px", alignItems: "center", gap: "8px", width: "fit-content" }}>
                    <div
                      style={{
                        backgroundColor: color.lonecomplete,
                        minWidth: "12px",
                        height: "12px",
                        border: "1px dashed #FFFFFF",
                        borderRadius: "9999px",
                        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                      }}
                    ></div>
                    <p style={{ color: "#6D6D6D", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", margin: 0 }}>
                      Loan:{" "}
                      <span style={{ fontWeight: 500, fontSize: "12px", color: "#121212" }}>${detail.loan}</span>
                    </p>
                  </div>
                  <div style={{ display: "flex", padding: "4px", alignItems: "center", gap: "8px", width: "fit-content" }}>
                    <div style={{ backgroundColor: color.equity, minWidth: "12px", height: "12px", borderRadius: "9999px" }}></div>
                    <p style={{ color: "#6D6D6D", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", margin: 0 }}>
                      Equity:{" "}
                      <span style={{ fontWeight: 500, fontSize: "12px", color: "#121212" }}>${detail.equity}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default PropertyStack;