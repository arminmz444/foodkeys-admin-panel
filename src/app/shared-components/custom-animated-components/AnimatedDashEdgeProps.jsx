// AnimatedDashEdge.tsx
import React, { useMemo } from 'react';
import { getBezierPath } from 'reactflow';
import './AnimatedDashEdge.css'; // We'll define the CSS animation here


function AnimatedDashEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style,
    onEdgeRemove,
  } = props;

  // 1) Calculate a path for the line (Bezier or any shape you prefer)
  const [edgePath, labelX, labelY] = useMemo(() => {
    return getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);

  // 2) The "middle" of the edge is given by (labelX, labelY) from getBezierPath
  // We'll place a <foreignObject> there to render a button.

  const handleRemoveClick = (event) => {
    event.stopPropagation(); // don't select the edge
    onEdgeRemove && onEdgeRemove(id);
  };

  return (
    <>
      {/* The animated dashed path */}
      <path
        id={id}
        className="animated-dash-edge"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />

      {/* The remove button in the middle of the edge */}
      <foreignObject
        width={24}
        height={24}
        x={labelX - 12}
        y={labelY - 12}
        style={{ overflow: 'visible' }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={handleRemoveClick}
        >
          ✕
        </div>
      </foreignObject>
    </>
  );
}

export default AnimatedDashEdge;
