"use client";

import React, { useLayoutEffect, useRef } from 'react';

export default function Globe() {
  const chartDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let am5Root: any;
    let isDisposed = false;

    // Dynamic import to prevent SSR 'window is not defined' error
    Promise.all([
      import("@amcharts/amcharts5"),
      import("@amcharts/amcharts5/map"),
      import("@amcharts/amcharts5-geodata/worldLow"),
      import("@amcharts/amcharts5/themes/Animated")
    ]).then(([am5, am5map, am5geodata_worldLow, am5themes_Animated]) => {
      
      if (isDisposed || !chartDiv.current) return;
      
      // Clean up any existing root on this container (Strict Mode safety)
      am5.array.each(am5.registry.rootElements, function (r: any) {
        if (r && r.dom === chartDiv.current) {
          r.dispose();
        }
      });

      const root = am5.Root.new(chartDiv.current);
      am5Root = root;

      // Dark brutalist theme colors
      const bgCol = am5.color(0x030303);
      const accCol = am5.color(0xccff00);
      const polyFill = am5.color(0x1a1a1a);
      const polyStroke = am5.color(0x333333);

      root.setThemes([am5themes_Animated.default.new(root)]);

      // Create the map chart
      const chart = root.container.children.push(am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        rotationX: -75, // Starting position roughly over India
        rotationY: -20,
        zoomLevel: 1,
        minZoomLevel: 1,
        maxZoomLevel: 1,
        wheelY: "none",  // Disables zooming with mouse wheel
        wheelX: "none"   // Disables zooming with trackpad
      }));

      // Background polygon (the "ocean")
      const bgSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      bgSeries.mapPolygons.template.setAll({
        fill: bgCol,
        fillOpacity: 0, // Make ocean transparent to blend with website bg
        strokeOpacity: 0
      });
      
      bgSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

      // Graticule series (the grid lines on the globe)
      const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
      graticuleSeries.mapLines.template.setAll({
        stroke: accCol,
        strokeOpacity: 0.05,
        strokeWidth: 0.5
      });

      // Main polygon series (countries)
      const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow.default
      }));
      
      polygonSeries.mapPolygons.template.setAll({
        fill: polyFill,
        stroke: polyStroke,
        strokeWidth: 0.5,
        strokeOpacity: 0.8,
        interactive: true
      });
      
      // Highlight India
      const hubId = "IN";
      const targetIds = ["US", "GB", "DE", "AE", "SG", "AU", "JP", "FR"];

      polygonSeries.events.on("datavalidated", function () {
        am5.array.each(polygonSeries.dataItems, function (di: any) {
          const id = di.get("id");
          if (id === hubId) {
            // Bright Neon Green for India
            di.get("mapPolygon").setAll({ fill: accCol, fillOpacity: 0.8 });
          } else if (targetIds.includes(id)) {
            // Subtly lighter gray for client regions
            di.get("mapPolygon").setAll({ fill: am5.color(0x2a2a2a) });
          }
        });
      });

      // Sankey / Flow lines
      const sankeySeries = chart.series.push(am5map.MapSankeySeries.new(root, {
        polygonSeries: polygonSeries,
        maxWidth: 2,
        controlPointDistance: 0.4,
        resolution: 60,
        nodePadding: 0.3
      }));

      sankeySeries.mapPolygons.template.setAll({
        fill: accCol,
        fillOpacity: 0.2, // Subtle line
        strokeOpacity: 0,
        tooltipText: "{sourceNode.name} to {targetNode.name}"
      });

      sankeySeries.nodes.mapPolygons.template.setAll({
        fill: accCol,
        stroke: am5.color(0x000000),
        strokeWidth: 1,
        fillOpacity: 1,
        strokeOpacity: 1
      });

      // Add animated bullets (data flowing)
      sankeySeries.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 0,
          autoRotate: true,
          sprite: am5.Circle.new(root, {
            radius: 3,
            fill: accCol,
            shadowColor: accCol,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0
          })
        });
      });

      sankeySeries.data.setAll([
        { sourceId: "IN", targetId: "US", value: 100 },
        { sourceId: "IN", targetId: "GB", value: 60 },
        { sourceId: "IN", targetId: "DE", value: 50 },
        { sourceId: "IN", targetId: "AE", value: 80 },
        { sourceId: "IN", targetId: "SG", value: 90 },
        { sourceId: "IN", targetId: "AU", value: 70 },
        { sourceId: "IN", targetId: "JP", value: 40 },
        { sourceId: "IN", targetId: "FR", value: 30 }
      ]);

      const countryNames: Record<string, string> = {
        IN: "India (Global Hub)", US: "United States", GB: "United Kingdom",
        DE: "Germany", AE: "UAE", SG: "Singapore", AU: "Australia",
        JP: "Japan", FR: "France"
      };

      sankeySeries.events.on("datavalidated", function () {
        am5.array.each(sankeySeries.nodes.dataItems, function (di: any) {
          const id = di.get("id");
          if (id && countryNames[id]) {
            di.set("name", countryNames[id]);
          }
        });

        // Trigger animations
        am5.array.each(sankeySeries.dataItems, function (dataItem: any) {
          const bullets = dataItem.bullets;
          if (bullets) {
            am5.array.each(bullets, function (bullet: any) {
              const randomDur = 2000 + Math.random() * 2000;
              const delay = Math.random() * 2000;
              setTimeout(function () {
                const sprite = bullet.get("sprite");
                if (sprite) {
                    bullet.animate({
                        key: "locationX",
                        from: 0,
                        to: 1,
                        duration: randomDur,
                        easing: am5.ease.linear,
                        loops: Infinity
                    });
                }
              }, delay);
            });
          }
        });
      });

      // Auto rotation
      let rotationAnimation: any = chart.animate({
        key: "rotationX",
        from: -75,
        to: -75 + 360,
        duration: 90000,
        loops: Infinity,
        easing: am5.ease.linear
      });

      // Pause rotation on interaction
      chart.chartContainer.events.on("pointerdown", function () {
        if (rotationAnimation) {
          rotationAnimation.stop();
          rotationAnimation = undefined;
        }
      });
      
      chart.appear(1000, 100);
    });

    return () => {
      isDisposed = true;
      if (am5Root) {
        am5Root.dispose();
      }
    };
  }, []);

  return <div ref={chartDiv} className="w-full h-[500px] lg:h-[700px] cursor-grab active:cursor-grabbing outline-none border-none"></div>;
}
