// JavaScript that converts a number to a shorter, human-readable format with suffixes 'k' (thousands), 'm' (millions), and 'b' (billions)
const formatNumber = (num) => {
	// Check if the number is greater than or equal to 1 billion
	if (num >= 1e9) {
		return (num / 1e9).toFixed(1).replace(/\.0+$/, '') + 'B';
	}
	// Check if the number is greater than or equal to 1 million
	if (num >= 1e6) {
		return (num / 1e6).toFixed(1).replace(/\.0+$/, '') + 'M';
	}
	// Check if the number is greater than or equal to 1 thousand
	if (num >= 1e3) {
		return (num / 1e3).toFixed(1).replace(/\.0+$/, '') + 'K';
	}
	// Return the number rounded to zero decimal places
	return Number(num).toFixed(0);
};

export { formatNumber };
