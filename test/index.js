(async function () {
    await testModalBuilder();

    await testModalData();

    await testCommandData();
})();

async function testModalBuilder() {
    const params = require('./context/button-interaction.json');

    const { ModalBuilder } = require('../index.js');

    const modal = new ModalBuilder(params.event.token);

    modal.setModalId("modal_id")
        .setTitle("title")
        .addShortText({
            custom_id: 'short',
            label: 'label'
        })
        .addParagraph({
            custom_id: 'paragraph',
            label: 'label',
            placeholder: 'placeholder',
            min_length: 1,
            max_length: 1000,
            required: false
        });

    const expected = {
        "token": "A_UNIQUE_TOKEN",
        "custom_id": "modal_id",
        "title": "title",
        "components": [
            {
                "type": 1,
                "components": [{
                    "type": 4,
                    "custom_id": "short",
                    "label": "label",
                    "style": 1
                }]
            },
            {
                "type": 1,
                "components": [{
                    "type": 4,
                    "custom_id": "paragraph",
                    "label": "label",
                    "style": 2,
                    "required": false,
                    "min_length": 1,
                    "max_length": 1000,
                    "placeholder": "placeholder"
                }]
            }
        ]
    };

    console.log("testModalBuilder Passed: ", JSON.stringify(modal.asJson()) == JSON.stringify(expected));
}

async function testModalData() {
    const params = require('./context/modal-submit.json');

    const { ModalData } = require('../index.js');

    const modal = new ModalData(params.event);

    const value1 = modal.get("SAMPLE_CUSTOM_ID1");
    const value2 = modal.get("SAMPLE_CUSTOM_ID2");

    const expected1 = "SAMPLE_VALUE1";
    const expected2 = "SAMPLE_VALUE2";

    console.log("testModalData Passed: ", value1 === expected1 && value2 === expected2);
}

async function testCommandData() {
    const params = require('./context/command-interaction.json');

    const { CommandData } = require('../index.js');

    const options = new CommandData(params.event);

    const value = options.get("TEST_OPTION_NAME");

    const expected = "TEST OPTION VALUE";

    console.log("testCommandData Passed: ", value === expected);
}