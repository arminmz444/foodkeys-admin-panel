import React, { useState } from 'react';
import { Stage, Layer, Rect, Arrow, Text } from 'react-konva';

function FlowGenerator() {
	const [nodes, setNodes] = useState([
		{ id: 1, x: 50, y: 50, name: 'Service A' },
		{ id: 2, x: 200, y: 150, name: 'Service B' }
	]);

	const [connections, setConnections] = useState([{ from: 1, to: 2 }]);

	const handleDragMove = (e) => {
		const { id } = e.target.attrs;
		const newNodes = nodes.map((node) => (node.id === id ? { ...node, x: e.target.x(), y: e.target.y() } : node));
		setNodes(newNodes);
	};

	const getNodePosition = (id) => {
		const node = nodes.find((n) => n.id === id);
		return node ? { x: node.x + 50, y: node.y + 25 } : { x: 0, y: 0 };
	};

	return (
		<Stage
			width={800}
			height={500}
			style={{ border: '1px solid black' }}
		>
			<Layer>
				{connections.map((conn, i) => {
					const fromPos = getNodePosition(conn.from);
					const toPos = getNodePosition(conn.to);
					return (
						<Arrow
							key={i}
							points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
							stroke="black"
						/>
					);
				})}

				{nodes.map((node) => (
					<React.Fragment key={node.id}>
						<Rect
							id={node.id}
							x={node.x}
							y={node.y}
							width={100}
							height={50}
							fill="lightblue"
							draggable
							onDragMove={handleDragMove}
						/>
						<Text
							x={node.x + 10}
							y={node.y + 15}
							text={node.name}
							fontSize={16}
						/>
					</React.Fragment>
				))}
			</Layer>
		</Stage>
	);
}

export default FlowGenerator;
