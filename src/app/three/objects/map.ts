type argumentProps = {
	value: number;
	inMin: number;
	inMax: number;
	outMin: number;
	outMax: number;
};

export function Map({ value, inMin, inMax, outMin, outMax }: argumentProps) {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
