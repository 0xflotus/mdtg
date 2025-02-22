export class MDTG {
    #currentDate = null;
    static months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    constructor(date) {
        this.#currentDate = date ?? new Date();
    }

    static isShortFormat(str) {
        return /^[0-9]{6}Z$/.test(str);
    }

    static isShortenedFormat(str) {
        return /^[0-9]{6}Z(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i.test(str);
    }

    static isLongFormat(str) {
        return /^[0-9]{8}Z(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[0-9]{2}$/i.test(str);
    }

    #toShortMDT() {
        const shortMDT = String(this.#currentDate.getDate()).padStart(2, "0") +
                         String(this.#currentDate.getHours()).padStart(2, "0") +
                         String(this.#currentDate.getMinutes()).padStart(2, "0") + "Z";
        if (!MDTG.isShortFormat(shortMDT)) {
            throw new Error('There was an error while building short MDT');
        }
        return shortMDT;
    }

    #toLongMDT() {
        const longMDT = String(this.#currentDate.getDate()).padStart(2, "0") +
                        String(this.#currentDate.getHours()).padStart(2, "0") +
                        String(this.#currentDate.getMinutes()).padStart(2, "0") +
                        String(this.#currentDate.getSeconds()).padStart(2, "0") + "Z" +
                        MDTG.months[this.#currentDate.getMonth()] + 
                        String(this.#currentDate.getFullYear() % 2000).padStart(2, "0")
        if (!MDTG.isLongFormat(longMDT)) {
            throw new Error('There was an error while building long MDT');
        }
        return longMDT;
    }

    #toShortenedMDT() {
        const shortenedMDT = this.#toShortMDT() + MDTG.months[this.#currentDate.getMonth()]
                            + String(this.#currentDate.getFullYear() % 2000).padStart(2, "0");
        if (!MDTG.isShortenedFormat(shortenedMDT)) {
            throw new Error('There was an error while building shortened MDT');
        }
        return shortenedMDT;
    }

    toMDT(options) {
        if (options?.form === "short") {
            return this.#toShortMDT();
        } else if (options?.form === "shortened") {
            return this.#toShortenedMDT();
        } else {
            return this.#toLongMDT();
        }
    }

    static parse(str) {
        if (MDTG.isShortFormat(str)) {
            const day = Number.parseInt(str.slice(0, 2));
            const hours = Number.parseInt(str.slice(2, 4));
            const minutes = Number.parseInt(str.slice(4, 6));
            const _timezone = str.slice(-1);

            const today = new Date();
            const date = new Date(today.getFullYear(), today.getMonth(), day, hours, minutes, 0, 0);
            return date;
        } else if (MDTG.isShortenedFormat(str)) {
            const day = Number.parseInt(str.slice(0, 2));
            const hours = Number.parseInt(str.slice(2, 4));
            const minutes = Number.parseInt(str.slice(4, 6));
            const _timezone = str.slice(6, 7);
            const month = MDTG.months.indexOf(str.slice(7, 10).toLowerCase());
            const year = 2000 + Number.parseInt(str.slice(10, 12));
            const date = new Date(year, month, day, hours, minutes, 0, 0);
            return date;
        } else if (MDTG.isLongFormat(str)) {
            const day = Number.parseInt(str.slice(0, 2));
            const hours = Number.parseInt(str.slice(2, 4));
            const minutes = Number.parseInt(str.slice(4, 6));
            const seconds = Number.parseInt(str.slice(6, 8));
            const _timezone = str.slice(8, 9);
            const month = MDTG.months.indexOf(str.slice(9, 12).toLowerCase());
            const year = 2000 + Number.parseInt(str.slice(12, 14));
            const date = new Date(year, month, day, hours, minutes, seconds, 0);
            return date;
        } else {
            throw Error('There was an error while parsing the string ' + str);
        }
    }

    toDate() {
        return this.#currentDate;
    }
}