type ArgumentProps = {
	value: number;
	inMin: number;
	inMax: number;
	outMin: number;
	outMax: number;
};

export function mapFunction({
	value,
	inMin,
	inMax,
	outMin,
	outMax,
}: ArgumentProps) {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
