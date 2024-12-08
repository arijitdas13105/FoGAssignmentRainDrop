import React, { useEffect, useState } from "react";

const GRID_ROWS = 15;
const GRID_COLUMNS = 20;

const Rain = () => {
  const [drops, setDrops] = useState([]);
  const [colorSetIndex, setColorSetIndex] = useState(0);

  const colorSets = [
    ["#ff0044", "#ff2244", "#ff4466", "#ff6688", "#ff88aa", "#ffaaee"],
    ["#0044ff", "#2266ff", "#4488ff", "#66aaff", "#88ccff", "#aadfff"], 
    ["#44ff00", "#66ff22", "#88ff44", "#aaff66", "#ccff88", "#eeffaa"],

  useEffect(() => {
    const colorChangeInterval = setInterval(() => {
      setColorSetIndex((prevIndex) => (prevIndex + 1) % colorSets.length);
    }, 2500);

    return () => clearInterval(colorChangeInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prevDrops) => {
        // Update all existing drops
        const updatedDrops = prevDrops
          .map((drop) => ({
            ...drop,
            trail: [
              ...drop.trail,
              drop.trail[drop.trail.length - 1] + 1, 
            ].slice(-6), 
          }))
          .filter((drop) => drop.trail[0] < GRID_ROWS); 

        if (Math.random() < 0.3) {
          const newDrops = [];
          for (let col = 0; col < GRID_COLUMNS; col++) {
            if (Math.random() < 0.2) {
              newDrops.push({
                column: col,
                trail: [0], 
              });
            }
          }
          return [...updatedDrops, ...newDrops];
        }

        return updatedDrops;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getTrailColor = (trailIndex) => {
    const currentColors = colorSets[colorSetIndex];
    return currentColors[trailIndex] || currentColors[currentColors.length - 1];
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div
        className="grid border border-gray-700"
        style={{
          gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
          gap: "2px",
          width: "80%",
          height: "80%",
        }}
      >
        {Array.from({ length: GRID_ROWS * GRID_COLUMNS }).map((_, index) => {
          const row = Math.floor(index / GRID_COLUMNS);
          const column = index % GRID_COLUMNS;

          const cellDrops = drops.filter(
            (drop) => drop.column === column && drop.trail.includes(row)
          );

          const trailIndex = Math.max(
            ...cellDrops.map((drop) => drop.trail.indexOf(row)),
            -1
          );

          return (
            <div
              key={index}
              className="w-full h-full border border-gray-700"
              style={{
                backgroundColor:
                  trailIndex >= 0 ? getTrailColor(trailIndex) : "transparent",
                transition: "background-color 0.1s",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Rain;
