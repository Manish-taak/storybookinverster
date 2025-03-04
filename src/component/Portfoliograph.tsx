"use client";

import React from "react";
import PropertyStack from "./PropertyStack";

export interface PropertyData {
    propertyName: string;
    amounts: {
        projectedValue: number;
        outstandingLoan: number;
        equity: number;
    };
    milestones: {
        loanComplete: 0 | 1;
        propertySold: 0 | 1;
        propertyAdded: 0 | 1;
        investmentOpportunity: 0 | 1;
    };
}

export interface GraphData {
    year: string;
    properties: PropertyData[];
}

export interface colorcode {
    lonecomplete: string;
    propertysold: string;
    propertyadded: string;
    investmentopportunity: string;
    projectedvalue: string;
    equity: string;
    outstandingloan: string;
}


interface CircleProps {
    width: number;
    data: GraphData[];
    color: colorcode;
}


const Portfoliograph: React.FC<CircleProps> = ({ width, data, color }) => {
    const leftLabels = [
        { color: color.projectedvalue, text: "Projected Value" },
        { color: color.outstandingloan, text: "Outstanding Loan" },
        { color: color.equity, text: "Equity" },
    ];

    const rightLabels = [
        { color: color.lonecomplete, text: "Loan Complete" },
        { color: color.propertysold, text: "Property Sold" },
        { color: color.propertyadded, text: "Property Added" },
        { color: color.investmentopportunity, text: "Investment Opportunity" },
    ];

    const displayYears = ["2035", "2040", "2045", "2050", "2055", "2060", "2025", "2030"];
    const totalSpans = data.length;
    const angleStep = 360 / totalSpans;

    return (
        <>
            <div style={{ width: `${width}px`, marginTop: "80px", marginLeft: "80px" }}>
                <h1
                    style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#121212",
                        textAlign: "center",
                        paddingTop: "14px"
                    }}
                >
                    Overall Portfolio
                </h1>
                <div
                    style={{
                        width: "517px",
                        height: "500px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/* Display years around the circle */}
                        {displayYears.map((year, index) => {
                            const angle = (index * 45 * Math.PI) / 180;
                            const distance = 225;
                            const labelX = Math.cos(angle) * distance;
                            const labelY = Math.sin(angle) * distance;
                            return (
                                <div
                                    key={`year-${year}`}
                                    style={{
                                        position: "absolute",
                                        padding: "2.5px 10px",
                                        borderRadius: "9999px",
                                        border: "1px solid #EEEEEE",
                                        fontWeight: 500,
                                        fontSize: "12px",
                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                        transform: `translate(${labelX}px, ${labelY}px)`,
                                        zIndex: 10
                                    }}
                                >
                                    {year}
                                </div>
                            );
                        })}

                        {/* Main Circular Graph */}
                        <div
                            style={{
                                width: "360px",
                                height: "360px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                transform: "rotate(-90deg)"
                            }}
                        >
                            {data.map((item, index) => {
                                const activeProperties = item.properties.filter(
                                    (property) =>
                                        property.milestones.propertyAdded ||
                                        property.milestones.loanComplete ||
                                        property.milestones.propertySold ||
                                        property.milestones.investmentOpportunity
                                );

                                const validProperties = activeProperties.length > 0 ? activeProperties : item.properties;

                                return (
                                    <div
                                        key={item.year}
                                        style={{
                                            position: "absolute",
                                            backgroundColor: "#ECECF0",
                                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                                            borderRadius: "8px",
                                            transform: `rotate(${index * angleStep}deg) translate(150px) rotate(90deg)`,
                                            clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
                                            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,1))"
                                        }}
                                    >
                                        <PropertyStack
                                            color={color}
                                            values={{
                                                projected: validProperties.reduce(
                                                    (sum, property) => sum + property.amounts.projectedValue,
                                                    0
                                                ),
                                                Equity: validProperties.reduce(
                                                    (sum, property) => sum + property.amounts.equity,
                                                    0
                                                ),
                                                outstanding: validProperties.reduce(
                                                    (sum, property) => sum + property.amounts.outstandingLoan,
                                                    0
                                                ),
                                                details: activeProperties.map((property) => ({
                                                    title: `${property.propertyName} (${item.year})`,
                                                    value: property.amounts.projectedValue.toString(),
                                                    loan: property.amounts.outstandingLoan.toString(),
                                                    equity: property.amounts.equity.toString(),
                                                    milestones: {
                                                        loanComplete: !!property.milestones.loanComplete,
                                                        propertySold: !!property.milestones.propertySold,
                                                        propertyAdded: !!property.milestones.propertyAdded,
                                                        investmentOpportunity: !!property.milestones.investmentOpportunity,
                                                    },
                                                })),
                                                propertyAdded: activeProperties.some((property) => property.milestones.propertyAdded) || false,
                                                loanComplete: activeProperties.some((property) => property.milestones.loanComplete) || false,
                                                propertySold: activeProperties.some((property) => property.milestones.propertySold) || false,
                                                investmentOpportunity: activeProperties.some((property) => property.milestones.investmentOpportunity) || false,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        padding: "16px",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {leftLabels.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    backgroundColor: "#FAFAFA",
                                    padding: "4px 12px",
                                    borderRadius: "9999px",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <span
                                    style={{
                                        backgroundColor: item.color,
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "9999px"
                                    }}
                                />
                                <span
                                    style={{
                                        color: "#121212",
                                        fontWeight: 400,
                                        fontSize: "12px"
                                    }}
                                >
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderRadius: "8px", backgroundColor: "white" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {rightLabels.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        backgroundColor: "#FAFAFA",
                                        alignItems: "center",
                                        gap: "2px"
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px solid #EEEEEE",
                                            borderRadius: "5px 0 0 5px"
                                        }}
                                    >
                                        <div
                                            style={{
                                                backgroundColor: item.color,
                                                width: "12px",
                                                height: "12px",
                                                border: "1px dashed #FFFFFF",
                                                borderRadius: "9999px",
                                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
                                            }}
                                        ></div>
                                    </div>
                                    <span
                                        style={{
                                            color: "#121212",
                                            fontSize: "12px",
                                            padding: "4px",
                                            border: "1px solid #EEEEEE",
                                            width: "100%"
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Portfoliograph;