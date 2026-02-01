const normalizeNumber = (number) => String(number).padStart(2, "0");

export class MDTG {
	#currentDate = null;
	static months = [
		"jan",
		"feb",
		"mar",
		"apr",
		"may",
		"jun",
		"jul",
		"aug",
		"sep",
		"oct",
		"nov",
		"dec",
	];

	static offset = {
		Y: 12,
		X: 11,
		W: 10,
		V: 9,
		U: 8,
		T: 7,
		S: 6,
		R: 5,
		Q: 4,
		P: 3,
		O: 2,
		N: 1,
		Z: 0,
		A: -1,
		B: -2,
		C: -3,
		D: -4,
		E: -5,
		F: -6,
		G: -7,
		H: -8,
		I: -9,
		J: -10,
		K: -11,
		L: -12,
		M: -13,
	};

	constructor(date) {
		const now = new Date();
		this.#currentDate =
			date ??
			new Date(
				Date.UTC(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
					now.getUTCMinutes(),
					now.getUTCSeconds(),
					now.getUTCMilliseconds(),
				),
			);
	}

	static isShortFormat(str) {
		return /^[0-9]{6}[A-Z]$/.test(str);
	}

	static isShortenedFormat(str) {
		return /^[0-9]{6}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i.test(
			str,
		);
	}

	static isLongFormat(str) {
		return /^[0-9]{8}[A-Z](jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i.test(
			str,
		);
	}

	#toShortMDT(timezone = "Z") {
		if (!/^[A-Z]$/.test(timezone.toUpperCase())) {
			timezone = "Z";
		}
		const newDate = new Date(
			Date.UTC(
				this.#currentDate.getUTCFullYear(),
				this.#currentDate.getUTCMonth(),
				this.#currentDate.getUTCDate(),
				this.#currentDate.getUTCHours() - MDTG.offset[timezone.toUpperCase()],
				this.#currentDate.getUTCMinutes(),
			),
		);
		const shortMDT = [
			newDate.getUTCDate(),
			newDate.getUTCHours(),
			newDate.getUTCMinutes(),
		]
			.map(normalizeNumber)
			.concat(timezone.toUpperCase())
			.join("");
		if (!MDTG.isShortFormat(shortMDT)) {
			throw new Error("There was an error while building short MDT");
		}
		return shortMDT;
	}

	#toLongMDT(timezone = "Z") {
		if (!/^[A-Z]$/.test(timezone.toUpperCase())) {
			timezone = "Z";
		}
		const newDate = new Date(
			Date.UTC(
				this.#currentDate.getUTCFullYear(),
				this.#currentDate.getUTCMonth(),
				this.#currentDate.getUTCDate(),
				this.#currentDate.getUTCHours() - MDTG.offset[timezone.toUpperCase()],
				this.#currentDate.getUTCMinutes(),
				this.#currentDate.getUTCSeconds(),
			),
		);
		const longMDT = [
			newDate.getUTCDate(),
			newDate.getUTCHours(),
			newDate.getUTCMinutes(),
			newDate.getUTCSeconds(),
		]
			.map(normalizeNumber)
			.concat(
				timezone.toUpperCase(),
				MDTG.months[newDate.getUTCMonth()],
				normalizeNumber(newDate.getUTCFullYear() % 2000),
			)
			.join("");
		if (!MDTG.isLongFormat(longMDT)) {
			throw new Error("There was an error while building long MDT");
		}
		return longMDT;
	}

	#toShortenedMDT(timezone = "Z") {
		if (!/^[A-Z]$/.test(timezone.toUpperCase())) {
			timezone = "Z";
		}
		const newDate = new Date(
			Date.UTC(
				this.#currentDate.getUTCFullYear(),
				this.#currentDate.getUTCMonth(),
				this.#currentDate.getUTCDate(),
				this.#currentDate.getUTCHours() - MDTG.offset[timezone.toUpperCase()],
				this.#currentDate.getUTCMinutes(),
				this.#currentDate.getUTCSeconds(),
			),
		);
		const shortenedMDT = [
			this.#toShortMDT(timezone.toUpperCase()),
			MDTG.months[newDate.getUTCMonth()],
			normalizeNumber(newDate.getUTCFullYear() % 2000),
		].join("");
		if (!MDTG.isShortenedFormat(shortenedMDT)) {
			throw new Error("There was an error while building shortened MDT");
		}
		return shortenedMDT;
	}

	toMDT(options) {
		if (options?.form === "short") {
			return this.#toShortMDT(options?.timezone);
		} else if (options?.form === "shortened") {
			return this.#toShortenedMDT(options?.timezone);
		} else {
			return this.#toLongMDT(options?.timezone);
		}
	}

	static parse(str) {
		if (MDTG.isShortFormat(str)) {
			const day = Number.parseInt(str.slice(0, 2), 10);
			const hours = Number.parseInt(str.slice(2, 4), 10);
			const minutes = Number.parseInt(str.slice(4, 6), 10);
			const timezoneOffset = str.slice(-1).toUpperCase();

			const today = new Date();
			const date = new Date(
				Date.UTC(
					today.getUTCFullYear(),
					today.getUTCMonth(),
					day,
					hours + MDTG.offset[timezoneOffset],
					minutes,
					0,
					0,
				),
			);
			return date;
		} else if (MDTG.isShortenedFormat(str)) {
			const day = Number.parseInt(str.slice(0, 2), 10);
			const hours = Number.parseInt(str.slice(2, 4), 10);
			const minutes = Number.parseInt(str.slice(4, 6), 10);
			const timezoneOffset = str.slice(6, 7).toUpperCase();
			const month = MDTG.months.indexOf(str.slice(7, 10).toLowerCase());
			const year = 2000 + Number.parseInt(str.slice(10, 12), 10);
			const date = new Date(
				Date.UTC(
					year,
					month,
					day,
					hours + MDTG.offset[timezoneOffset],
					minutes,
					0,
					0,
				),
			);
			return date;
		} else if (MDTG.isLongFormat(str)) {
			const day = Number.parseInt(str.slice(0, 2), 10);
			const hours = Number.parseInt(str.slice(2, 4), 10);
			const minutes = Number.parseInt(str.slice(4, 6), 10);
			const seconds = Number.parseInt(str.slice(6, 8), 10);
			const timezoneOffset = str.slice(8, 9).toUpperCase();
			const month = MDTG.months.indexOf(str.slice(9, 12).toLowerCase());
			const year = 2000 + Number.parseInt(str.slice(12, 14), 10);
			const date = new Date(
				Date.UTC(
					year,
					month,
					day,
					hours + MDTG.offset[timezoneOffset],
					minutes,
					seconds,
					0,
				),
			);
			return date;
		} else {
			throw Error(`There was an error while parsing the string "${str}"`);
		}
	}

	toDate() {
		return this.#currentDate;
	}
}
