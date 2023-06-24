'use strict';

const Type = {
    ActionRow: 1,
    TextInput: 4
};

// Reference: https://discord.com/developers/docs/interactions/message-components#text-inputs-text-input-styles
const TextInputStyle = {
    Short: 1,
    Paragraph: 2
};

/**
 * Modal Builder
 * - Utility for creating Discord Modals.
 * - Optionally initialize this class with an interaction token, especially in Autocode platform.
 */
class ModalBuilder {
    constructor(token) {
        this.token = token;
        this.rows = [];
    }

    setModalId(modal_id) {
        this.modal_id = modal_id;

        return this;
    }

    setTitle(title) {
        this.title = title;

        return this;
    }

    addShortText(params) {
        params.type = Type.TextInput;
        params.style = TextInputStyle.Short;

        validateParams(params);

        this.rows.push(componentJson(params));

        return this;
    }

    addParagraph(params) {
        params.type = Type.TextInput;
        params.style = TextInputStyle.Paragraph;

        validateParams(params);

        this.rows.push(componentJson(params));

        return this;
    }

    asJson() {
        validateModal(this);

        return modalJson(this);
    }
}

// Functions for Modal Builder

// ---------- JSON
function modalJson(data) {
    const modal = {
        token: data.token,
        custom_id: data.modal_id,
        title: data.title,
    };

    const components = data.rows.map(row => {
        return {
            type: Type.ActionRow,
            components: [row]
        }
    });

    modal["components"] = components;

    return modal;
}

function componentJson(params) {
    let component = {
        type: params.type,
        custom_id: params.custom_id,
        label: params.label,
        style: params.style,
        required: true
    };

    if (params.min_length) component["min_length"] = params.min_length;
    if (params.max_length) component["max_length"] = params.max_length;
    if (params.placeholder) component["placeholder"] = params.placeholder;
    if (!params.required) component["required"] = params.required;

    return component;
}

// ---------- Validations and Exceptions
function validateModal(data) {
    if (!data.modal_id) {
        throw new Error("Missing modal id. Please use setModalId() to set the identifier.");
    } else if (data.modal_id.length > 100) {
        throw new Error("Maximum character length for modal_id is 100.");
    }

    if (!data.title) {
        throw new Error("Missing title. Please use setTitle() to set the title.");
    }

    if (data.rows.length == 0) {
        throw new Error("No action rows. Please add a row using addShortText(...) or addParagraph(...)");
    } else {
        validateCustomIds(data.rows);
    }
}

function validateParams(params) {
    if (!params.custom_id) {
        throw new Error('Missing custom_id. Please add "custom_id" to your action row parameters.');
    } else if (params.custom_id.length > 100) {
        throw new Error("Maximum character length for custom_id is 100.");
    }

    if (!params.label) {
        throw new Error('Missing label. Please add "label" to your action row parameters.');
    } else if (params.label.length > 45) {
        throw new Error("Maximum character length for label is 45.");
    }

    if (params.min_length && (params.min_length < 0 || params.min_length > 4000)) {
        throw new Error("Minimum value for min_length is 0; maximum is 4000.");
    }

    if (params.max_length && (params.max_length < 1 || params.max_length > 4000)) {
        throw new Error("Minimum value for max_length is 1; maximum is 4000.");
    }

    if (params.value && params.value?.length > 4000) {
        throw new Error("Maximum character length for value is 4000.");
    }

    if (params.placeholder && params.placeholder?.length > 100) {
        throw new Error("Maximum character length for placeholder is 100.");
    }
}

function validateCustomIds(rows) {
    const ids = [];

    for (let row of rows) {
        if (ids.includes(row.custom_id)) {
            throw new Error(`Duplicate custom_id. Row with custom_id "${row.custom_id}" is already existing.`);
        } else {
            ids.push(row.custom_id);
        }
    }
}

/**
 * Modal Data
 * - Utility for retrieving Modal components.
 * - Initialize this class with an interaction event.
 */
class ModalData {
    constructor(event) {
        this.components = event.data.components;
    }

    get(custom_id) {
        const component = this.components.find(row => row?.components?.find(c => c.custom_id == custom_id))?.components;

        return component?.shift()?.value;
    }
}

/**
 * Command Data
 * - Utility for retrieving Chat Input Command options.
 * - Initialize this class with an interaction event.
 */
class CommandData {
    constructor(event) {
        this.options = event.data.options;
    }

    get(name) {
        const value = this.options?.find(option => option?.name === name)?.value;

        return value;
    }
}

/**
 * GoogleSheets
 * - Utility for Autocode lib Google Sheets API.
 * - Initialize this class with lib.googlesheets.
 */
class GoogleSheets {
    constructor(googlesheets) {
        this.googlesheets = googlesheets;
    }

    async updateOrInsert(params) {
        const existingRecord = await this.googlesheets.query.select(params)
            .then(result => { return result?.rows?.map(row => { return row.fields }) || [] });

        if (existingRecord.length > 0) {
            await this.googlesheets.query.update({
                range: params.range,
                bounds: params.bounds,
                where: params.where,
                fields: params.fields,
            });
        } else {
            await this.googlesheets.query.insert({
                range: params.range,
                bounds: params.bounds,
                fieldsets: [params.fields],
            });
        }
    }
}

/**
 * sleep
 * - asynchronous setTimeOut()
 * @param {number} ms - milliseconds
 */
async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms || 0);
    });
}

module.exports = { ModalBuilder, ModalData, CommandData, GoogleSheets, sleep };