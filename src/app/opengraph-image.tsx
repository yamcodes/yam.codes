// biome-ignore-all lint/performance/noImgElement: We're using Node.js runtime with local assets
// Read: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#using-nodejs-runtime-with-local-assets

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yam Borodetsky";
export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				background: "white",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				padding: "40px",
			}}
		>
			<img
				src="https://github.com/yamcodes.png"
				alt="Yam Borodetsky"
				style={{
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					marginBottom: "20px",
				}}
			/>
			<div
				style={{
					fontSize: 60,
					fontWeight: "bold",
					textAlign: "center",
				}}
			>
				Yam Borodetsky
			</div>
			<div
				style={{
					fontSize: 30,
					color: "#666",
					textAlign: "center",
				}}
			>
				Software Engineer
			</div>
		</div>,
		{
			...size,
		},
	);
}
