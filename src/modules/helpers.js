import moment from "moment/moment"

class DateHelper {
    constructor(date) {
        this.date = moment(date)
    }

    addYears(years) {
        this.date.add(years, "years")
        return this
    }

    subtractYears(years) {
        this.date.subtract(years, "years")
        return this
    }

    addMonths(months) {
        this.date.add(months, "months")
        return this
    }

    subtractMonths(months) {
        this.date.subtract(months, "months")
        return this
    }

    addDays(days) {
        this.date.add(days, "days")
        return this
    }

    subtractDays(days) {
        this.date.subtract(days, "days")
        return this
    }

    addHours(hours) {
        this.date.add(hours, "hours")
        return this
    }

    subtractHours(hours) {
        this.date.subtract(hours, "hours")
        return this
    }

    addMinutes(minutes) {
        this.date.add(minutes, "minutes")
        return this
    }

    subtractMinutes(minutes) {
        this.date.subtract(minutes, "minutes")
        return this
    }

    addSeconds(seconds) {
        this.date.add(seconds, "seconds")
        return this
    }

    subtractSeconds(seconds) {
        this.date.subtract(seconds, "seconds")
        return this
    }

    toDate() {
        return this.date.toDate()
    }
}
function transformEmployeeData(data) {
    if (!data) return
    // Helper function to handle missing fields
    const validateField = (field, fallback = null) => {
        if (field === undefined || field === null) {
            console.error(`Missing field: ${field}`);
            return fallback;
        }
        return field;
    };

    try {
        return {
            user: {
                email: validateField(data.email, ""),
                username: validateField(data.username, ""),
                user_type: validateField(data.user_type, ""),
                job_role: validateField(data.job_role, ""),
                first_name: validateField(data.first_name, ""),
                last_name: validateField(data.last_name, ""),
                senior: validateField(data.senior, null),
                company: validateField(data.company, null),
                store: validateField(data.store, null),
                department: validateField(data.department, null),
            },
            employee_work_email: validateField(data.employee_detail?.employee_work_email, ""),
            gender: validateField(data.employee_detail?.gender, ""),
            dob: validateField(data.employee_detail?.dob, ""),
            phone_number: validateField(data.employee_detail?.phone_number, ""),
            employee_residential_address: validateField(data.employee_detail?.employee_residential_address, ""),
            city: validateField(data.employee_detail?.city, ""),
            state: validateField(data.employee_detail?.state, ""),
            zip_code: validateField(data.employee_detail?.zip_code, ""),
            emergency_contact_person: validateField(data.employee_detail?.emergency_contact_person, ""),
            emergency_contact_relationship: validateField(data.employee_detail?.emergency_contact_relationship, ""),
            emergency_contact_phone: validateField(data.employee_detail?.emergency_contact_phone, ""),
            employment_status: validateField(data.employee_detail?.employment_status, ""),
            employment_type: validateField(data.employee_detail?.employment_type, ""),
            hire_date: validateField(data.employee_detail?.hire_date, ""),
            notes: validateField(data.employee_detail?.notes, ""),
            manager: validateField(data.manager_name, null),
            address_line_2: validateField(data.employee_detail?.address_line_2, ""),
            employee_country: validateField(data.employee_detail?.employee_country, ""),
            specify_employment_type: validateField(data.employee_detail?.specify_employment_type, ""),
        };
    } catch (error) {
        console.error("Error transforming employee data:", error);
        return null;
    }
}



function formatDate(date, format = "MM-DD-YYYY") {
    return moment(date).format(format)
}
function createFormData(data) {
    const formData = new FormData()

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key]

            if (Array.isArray(value)) {
                for (const item of value) {
                    formData.append(key, item)
                }
            } else if (value instanceof FileList) {
                for (const item of value) {
                    formData.append(key, item)
                }
            } else if (typeof value === "Object") {
                formData.append(key, JSON.stringify(value))
            } else value && formData.append(key, value)
        }
    }

    return formData
}
function objectToQueryString(obj) {
    return Object.keys(obj)
        .filter(key => obj[key])
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join("&")
}

const getCurrentURLParameters = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const params = {}
    for (const [key, value] of searchParams) {
        params[key] = value
    }
    return params
}
const getURLQuery = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const params = {}
    for (const [key, value] of searchParams) {
        params[key] = value
    }
    return params
}
const copyToClipboard = text => {
    const textarea = document.createElement("textarea")
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
}
const getRandomColor = () => {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`
}
const getAsBool = value => {
    return value == "true" || value == "True"
}
const formattedPrice = price => {
    return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD", // Adjust the currency code as needed
        minimumFractionDigits: 0
    })
}
function TypeCheck(value) {
    return {
        isUndefined: () => typeof value === "undefined",
        isNull: () => value === null,
        isBoolean: () => typeof value === "boolean",
        isNumber: () => typeof value === "number",
        isString: () => typeof value === "string",
        isObject: () => typeof value === "object",
        isArray: () => Array.isArray(value),
        isObjectNotArray: () => typeof value === "object" && !Array.isArray(value),
        isFunction: () => typeof value === "function",
        isSymbol: () => typeof value === "symbol",
        isBigInt: () => typeof value === "bigint"
    }
}

const extractId = dataObj => {
    if (TypeCheck().isObjectNotArray(dataObj)) return dataObj._id
    else return dataObj
}
const ChangedValues = (initialValues, currentValues) => {
    return Object.keys(currentValues).reduce((acc, key) => {
        if (currentValues[key] !== initialValues[key]) {
            acc[key] = currentValues[key];
        }
        return acc;
    }, {});
};
const getChangedValues = (initialValues, currentValues) => {
    return Object.keys(currentValues).reduce((acc, key) => {
        if (currentValues[key] !== initialValues[key]) {
            acc[key] = currentValues[key];
        }
        return acc;
    }, {});
};
export {
    getChangedValues,
    createFormData,
    DateHelper,
    formatDate,
    objectToQueryString,
    getCurrentURLParameters,
    copyToClipboard,
    getRandomColor,
    getAsBool,
    formattedPrice,
    TypeCheck,
    extractId,
    ChangedValues,
    transformEmployeeData
}