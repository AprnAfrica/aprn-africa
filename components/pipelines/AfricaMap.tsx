"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRY_COUNTS, countryToSlug } from "@/lib/pipelines/data";

const ROUTE_COUNTRY: Record<string, string> = {
  "West African Gas Pipeline":        "Nigeria",
  "Trans-Saharan Gas Pipeline":       "Nigeria",
  "Nigeria–Morocco Gas Pipeline":     "Nigeria",
  "Trans-Mediterranean Gas Pipeline": "Algeria",
  "Maghreb–Europe Gas Pipeline":      "Algeria",
  "EACOP (Uganda–Tanzania)":          "Uganda",
  "Trans Nigeria Gas Pipeline":       "Nigeria",
  "Hassi R'Mel–Arzew Gas Pipeline":   "Algeria",
  "South Valley Gas Pipeline":        "Egypt",
  "Greater Nile Oil Pipeline":        "Sudan",
  "Tazama Oil Pipeline":              "Tanzania",
  "Niger–Benin Oil Pipeline":         "Niger",
  "Mozambique Gas Corridor":          "Mozambique",
};

interface AfricaPlotly {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config?: unknown) => Promise<HTMLElement>;
  purge: (el: HTMLElement) => void;
}

type PipelineFuelType = "Gas" | "Oil";
type PipelineStatusType = "operating" | "construction" | "proposed" | "shelved" | "cancelled" | "retired";
type FuelFilter = "all" | "Gas" | "Oil";

const PIPELINE_ROUTES: Array<{
  name: string;
  fuel: PipelineFuelType;
  status: PipelineStatusType;
  lats: number[];
  lons: number[];
}> = [
  {
    name: "West African Gas Pipeline",
    fuel: "Gas",
    status: "operating",
    lats: [6.6, 6.4, 6.1, 5.6],
    lons: [3.3, 2.4, 1.2, -0.1],
  },
  {
    name: "Trans-Saharan Gas Pipeline",
    fuel: "Gas",
    status: "shelved",
    lats: [12.0, 13.8, 16.9, 22.8, 32.9, 36.8],
    lons: [8.5, 8.9, 7.9, 5.5, 3.3, 3.0],
  },
  {
    name: "Nigeria–Morocco Gas Pipeline",
    fuel: "Gas",
    status: "proposed",
    lats: [4.8, 5.5, 6.3, 6.1, 5.6, 5.3, 6.3, 8.5, 9.5, 11.8, 14.7, 18.1, 23.7, 30.4, 33.6, 35.8],
    lons: [7.0, 5.0, 2.4, 1.2, -0.2, -4.0, -10.8, -13.2, -13.7, -15.6, -17.4, -15.9, -15.9, -9.6, -7.6, -5.8],
  },
  {
    name: "Trans-Mediterranean Gas Pipeline",
    fuel: "Gas",
    status: "operating",
    lats: [36.8, 37.1, 37.5, 38.2, 38.7],
    lons: [3.0, 8.5, 10.2, 13.5, 15.1],
  },
  {
    name: "Maghreb–Europe Gas Pipeline",
    fuel: "Gas",
    status: "operating",
    lats: [32.9, 34.2, 35.8, 36.1, 37.3, 38.1, 40.4],
    lons: [3.3, -1.5, -5.8, -5.5, -5.3, -4.9, -3.7],
  },
  {
    name: "EACOP (Uganda–Tanzania)",
    fuel: "Oil",
    status: "construction",
    lats: [0.2, -0.5, -1.5, -3.5, -5.1],
    lons: [31.5, 32.8, 33.5, 35.8, 39.1],
  },
  {
    name: "Trans Nigeria Gas Pipeline",
    fuel: "Gas",
    status: "construction",
    lats: [7.4, 9.1, 10.5, 12.0],
    lons: [6.7, 7.2, 7.4, 8.5],
  },
  {
    name: "Hassi R'Mel–Arzew Gas Pipeline",
    fuel: "Gas",
    status: "operating",
    lats: [32.9, 33.8, 35.7],
    lons: [3.3, 1.8, -0.2],
  },
  {
    name: "South Valley Gas Pipeline",
    fuel: "Gas",
    status: "operating",
    lats: [24.1, 26.8, 29.5, 31.2, 30.1],
    lons: [32.9, 30.9, 30.6, 31.2, 31.5],
  },
  {
    name: "Greater Nile Oil Pipeline",
    fuel: "Oil",
    status: "operating",
    lats: [10.5, 13.2, 15.6, 19.1],
    lons: [31.7, 32.5, 32.8, 37.3],
  },
  {
    name: "Tazama Oil Pipeline",
    fuel: "Oil",
    status: "operating",
    lats: [-5.1, -8.9, -13.0, -15.4],
    lons: [39.1, 35.7, 32.9, 28.3],
  },
  {
    name: "Niger–Benin Oil Pipeline",
    fuel: "Oil",
    status: "operating",
    lats: [17.0, 13.5, 9.3, 6.4],
    lons: [8.0, 8.8, 2.0, 2.4],
  },
  {
    name: "Mozambique Gas Corridor",
    fuel: "Gas",
    status: "proposed",
    lats: [-10.7, -13.0, -14.9, -19.8, -25.9],
    lons: [40.7, 40.5, 40.7, 34.8, 32.6],
  },
];

// Color = fuel type; dash pattern = operational status
const FUEL_COLOR: Record<PipelineFuelType, string> = {
  Gas: "#4a90c2",
  Oil: "#D4A017",
};

const STATUS_DASH: Record<PipelineStatusType, { dash: string; width: number }> = {
  operating:    { dash: "solid",   width: 2.5 },
  construction: { dash: "dot",     width: 2.5 },
  proposed:     { dash: "dashdot", width: 2   },
  shelved:      { dash: "dash",    width: 1.5 },
  cancelled:    { dash: "dash",    width: 1.5 },
  retired:      { dash: "dash",    width: 1.5 },
};

const INACTIVE = new Set(["shelved", "cancelled", "retired"]);

function getRouteStyle(fuel: PipelineFuelType, status: PipelineStatusType) {
  return {
    color: INACTIVE.has(status) ? "#7c8b98" : FUEL_COLOR[fuel],
    ...STATUS_DASH[status],
  };
}

export default function AfricaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [fuelFilter, setFuelFilter] = useState<FuelFilter>("all");

  useEffect(() => {
    const el = mapRef.current;
    let mounted = true;

    const render = () => {
      if (!mounted || !el || !window.Plotly) return;
      const Plotly = window.Plotly as unknown as AfricaPlotly;

      const visibleRoutes = fuelFilter === "all"
        ? PIPELINE_ROUTES
        : PIPELINE_ROUTES.filter((p) => p.fuel === fuelFilter);

      const countries = Object.keys(COUNTRY_COUNTS);
      const values = Object.values(COUNTRY_COUNTS);

      const choropleth = {
        type: "choropleth",
        locationmode: "country names",
        locations: countries,
        z: values,
        colorscale: [
          [0,    "#132d42"],
          [0.04, "#1e4a62"],
          [0.15, "#c97a2b"],
          [0.45, "#d4a017"],
          [1.0,  "#e5b83b"],
        ],
        showscale: false,
        marker: { line: { color: "#071B2A", width: 0.8 } },
        hovertemplate: "<b>%{location}</b><br><span style='color:#D4A017'>%{z} segments</span><br><span style='color:#7c8b98;font-size:11px'>Click to explore →</span><extra></extra>",
        name: "",
      };

      const routeTraces = visibleRoutes.map((p) => {
        const style = getRouteStyle(p.fuel, p.status);
        return {
          type: "scattergeo",
          lat: p.lats,
          lon: p.lons,
          mode: "lines",
          name: p.name,
          line: { width: style.width, color: style.color, dash: style.dash },
          hovertemplate: `<b>%{meta}</b><extra></extra>`,
          meta: p.name,
          showlegend: false,
        };
      });

      const terminals = {
        type: "scattergeo",
        lat: [6.6, 4.8, 12.0, 5.6, 0.2, -5.1, 32.9, 30.1, 36.8, -10.7],
        lon: [3.3, 7.0, 8.5, -0.1, 31.5, 39.1, 3.3, 31.5, 3.0, 40.7],
        mode: "markers",
        name: "Key terminals",
        text: ["Lagos", "Port Harcourt", "Kano", "Tema", "Kabaale", "Tanga", "Hassi R'Mel", "Khartoum", "Algiers", "Rovuma"],
        hovertemplate: "%{text}<extra></extra>",
        marker: {
          size: 6,
          color: "#D4A017",
          symbol: "circle",
          line: { color: "#071B2A", width: 1.5 },
          opacity: 0.9,
        },
        showlegend: false,
      };

      const layout = {
        geo: {
          scope: "africa",
          showland: true,
          landcolor: "#0a2035",
          showocean: true,
          oceancolor: "#071B2A",
          showlakes: true,
          lakecolor: "#071B2A",
          showcountries: true,
          countrycolor: "#1E3D56",
          countrywidth: 0.6,
          showcoastlines: true,
          coastlinecolor: "#1E3D56",
          bgcolor: "#071B2A",
          projection: { type: "mercator" },
          lataxis: { range: [-38, 40] },
          lonaxis: { range: [-22, 52] },
        },
        paper_bgcolor: "#071B2A",
        plot_bgcolor: "#071B2A",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: false,
        hoverlabel: {
          bgcolor: "#0D2436",
          bordercolor: "#D4A017",
          font: { color: "#ffffff", size: 13, family: "Inter, sans-serif" },
        },
        dragmode: false,
      };

      void Plotly.newPlot(
        el,
        [choropleth, ...routeTraces, terminals],
        layout,
        { responsive: true, displayModeBar: false, scrollZoom: false },
      ).then(() => {
        if (!mounted || !el) return;
        type PlotPoint = { location?: string; data?: { name?: string } };
        type PlotlyEl = HTMLElement & { on?: (ev: string, cb: (d: { points: PlotPoint[] }) => void) => void };
        (el as PlotlyEl).on?.("plotly_click", (data) => {
          const pt = data?.points?.[0];
          if (!pt) return;
          if (pt.location && COUNTRY_COUNTS[pt.location]) {
            router.push(`/intelligence/pipelines/${countryToSlug(pt.location)}`);
            return;
          }
          const routeName = pt.data?.name;
          if (routeName && ROUTE_COUNTRY[routeName]) {
            router.push(`/intelligence/pipelines/${countryToSlug(ROUTE_COUNTRY[routeName])}`);
          }
        });
      });
    };

    const poll = () => {
      if (!mounted) return;
      window.Plotly ? render() : setTimeout(poll, 150);
    };
    poll();

    return () => {
      mounted = false;
      if (el && window.Plotly) (window.Plotly as unknown as AfricaPlotly).purge(el);
    };
  }, [router, fuelFilter]);

  const filters: Array<{ label: string; value: FuelFilter; accent: string }> = [
    { label: "All Pipelines", value: "all",  accent: "#D4A017" },
    { label: "Gas",           value: "Gas",  accent: "#4a90c2" },
    { label: "Crude Oil",     value: "Oil",  accent: "#D4A017" },
  ];

  return (
    <div>
      {/* Fuel type filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", color: "#7c8b98", textTransform: "uppercase", marginRight: 4 }}>
          Show:
        </span>
        {filters.map(({ label, value, accent }) => {
          const active = fuelFilter === value;
          return (
            <button
              key={value}
              onClick={() => setFuelFilter(value)}
              style={{
                padding: "5px 14px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase" as const,
                border: "1px solid",
                cursor: "pointer",
                transition: "all 0.15s ease",
                background: active ? accent : "transparent",
                borderColor: active ? accent : "rgba(255,255,255,0.12)",
                color: active ? "#071B2A" : "#9fb0bd",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        ref={mapRef}
        className="w-full h-72 sm:h-96 md:h-120 lg:h-145"
        style={{ border: "1px solid rgba(255,255,255,.08)", cursor: "pointer" }}
      />

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: 16, fontSize: 12, color: "#7c8b98" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 2.5, background: "#4a90c2", display: "inline-block" }} />
          Gas
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 2.5, background: "#D4A017", display: "inline-block" }} />
          Crude Oil
        </div>

        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)", alignSelf: "center" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 2.5, background: "#9fb0bd", display: "inline-block" }} />
          Operating
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 0, borderBottom: "2px dotted #9fb0bd", display: "inline-block" }} />
          Construction
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 24, height: 0, borderBottom: "2px dashed #9fb0bd", display: "inline-block" }} />
          Proposed / Shelved
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {["#132d42", "#1e4a62", "#c97a2b", "#d4a017", "#e5b83b"].map((bg) => (
              <div key={bg} style={{ width: 20, height: 10, background: bg }} />
            ))}
          </div>
          <span>Pipeline density</span>
        </div>
      </div>
    </div>
  );
}
