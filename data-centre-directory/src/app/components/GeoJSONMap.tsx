'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Props = {
  geojsonUrl: string;
  layerName?: string;
};

export default function GeoJSONMap({
  geojsonUrl,
  layerName = 'geojson'
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          },
          [layerName]: {
            type: 'geojson',
            data: geojsonUrl
          }
        },
        layers: [
          { id: 'osm', type: 'raster', source: 'osm' },

          // Subtle grid fill
          {
            id: `${layerName}-fill`,
            type: 'fill',
            source: layerName,
            paint: {
              'fill-color': '#000000',
              'fill-opacity': 0.04
            }
          },

          // Hairline grid outline
          {
            id: `${layerName}-outline`,
            type: 'line',
            source: layerName,
            paint: {
              'line-color': '#000000',
              'line-width': 0.25,
              'line-opacity': 0.15
            }
          }
        ]
      },
      center: [-79.3832, 43.6532],
      zoom: 9
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', async () => {
      // Fit to GeoJSON bounds (works best for polygons/lines; still okay for points)
      try {
        const res = await fetch(geojsonUrl);
        const gj = await res.json();

        // Compute bounds manually without extra libs
        const coords: number[][] = [];
        const pushCoord = (c: any) => {
          if (typeof c?.[0] === 'number' && typeof c?.[1] === 'number')
            coords.push([c[0], c[1]]);
          else if (Array.isArray(c)) c.forEach(pushCoord);
        };

        if (gj.type === 'FeatureCollection')
          gj.features.forEach((f: any) => pushCoord(f.geometry?.coordinates));
        else if (gj.type === 'Feature') pushCoord(gj.geometry?.coordinates);
        else pushCoord(gj.coordinates);

        if (coords.length) {
          let minX = coords[0][0],
            minY = coords[0][1],
            maxX = coords[0][0],
            maxY = coords[0][1];
          for (const [x, y] of coords) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
          map.fitBounds(
            [
              [minX, minY],
              [maxX, maxY]
            ],
            { padding: 40, duration: 300 }
          );
        }
      } catch {
        // If fetch/bounds fails, we just keep the default center/zoom
      }
    });

    // Click interaction: show properties in a popup
    const clickableLayers = [`${layerName}-fill`, `${layerName}-outline`];

    map.on('click', e => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: clickableLayers
      });
      const f = features?.[0];
      if (!f) return;

      const props = f.properties ?? {};
      const html = `
        <div style="max-width:280px">
          <div style="font-weight:700;margin-bottom:6px">Feature</div>
          <pre style="white-space:pre-wrap;margin:0">${escapeHtml(JSON.stringify(props, null, 2))}</pre>
        </div>
      `;

      new maplibregl.Popup().setLngLat(e.lngLat).setHTML(html).addTo(map);
    });

    // Cursor hint
    clickableLayers.forEach(id => {
      map.on(
        'mouseenter',
        id,
        () => (map.getCanvas().style.cursor = 'pointer')
      );
      map.on('mouseleave', id, () => (map.getCanvas().style.cursor = ''));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geojsonUrl, layerName]);

  return <div ref={containerRef} style={{ width: '100%', height: '650px' }} />;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return c;
    }
  });
}
