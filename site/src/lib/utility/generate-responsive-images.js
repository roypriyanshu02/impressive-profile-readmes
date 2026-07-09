import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Generate responsive image sizes for a single screenshot
 * @param {String} inputPath - Path to the original screenshot
 * @param {String} outputPath - Path to save responsive images
 * @param {String} username - Username for filename
 * @return {Promise<Object>} - Generated image info
 */
const generateResponsiveImages = async (inputPath, outputPath, username) => {
	const sizes = [
		{ width: 400, suffix: 'small' },
		{ width: 800, suffix: 'medium' },
		{ width: 1200, suffix: 'large' }
	];

	const results = [];

	try {
		// Ensure output directory exists
		await mkdir(outputPath, { recursive: true });

		for (const size of sizes) {
			const outputPathName = join(outputPath, `${username}-${size.suffix}.webp`);

			await sharp(inputPath)
				.resize(size.width, null, {
					kernel: 'lanczos3',
					fit: 'inside',
					withoutEnlargement: true
				})
				.webp({
					quality: 65,
					effort: 6,
					nearLossless: true,
					alphaQuality: 80,
					smartSubsample: true,
					reductionEffort: 6
				})
				.toFile(outputPathName);

			results.push({
				size: size.suffix,
				width: size.width,
				path: outputPathName
			});
		}

		return { success: true, images: results };
	} catch (error) {
		console.error(`Error generating responsive images for ${username}:`, error);
		return { success: false, error: error.message };
	}
};

export default generateResponsiveImages;
