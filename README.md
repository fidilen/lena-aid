# lena-aid
The Autocode Interaction Data package is an efficient and powerful tool that simplifies the process of building modals and managing chat input commands.

## Usage

### Modal Builder
```js
const { ModalBuilder } = require('lena-aid');

const modal = new ModalBuilder(context.params.event.token);

modal.setModalId("modal_id");
modal.setTitle("title");

modal.addShortText({
    custom_id: 'short',
    label: 'label'
});

modal.addParagraph({
    custom_id: 'paragraph',
    label: 'label',
    placeholder: 'placeholder',
    min_length: 1,
    max_length: 1000,
    required: true
});

const json = modal.asJson(); // Use this JSON to your Discord API request

// Autocode platform
await lib.discord.interactions.responses.modals.create(json);
```

### Modal Data
```js
const { ModalData } = require('lena-aid');

const data = new ModalData(context.params.event);

const value = data.get("custom_id"); // custom_id of the target component

console.log(value);
```

### Command Data
```js
const { CommandData } = require('lena-aid');

const data = new CommandData(context.params.event);

const value = data.get("option_name"); // name of the target option

console.log(value);
```

### Sleep
```js
const { sleep } = require('lena-aid');

await sleep(300);
```

### GoogleSheets
```js
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});   // Autocode lib
const { GoogleSheets } = require('lena-aid');

const googlesheets = new GoogleSheets(lib.googlesheets);

await googlesheets.insertOrUpdate({
  range: `A:B`,
  bounds: 'FULL_RANGE',
  where: [
    {
      'column1__is': `value1`
    }
  ],
  fields: {
        'column1': `value1`,
        'column2': `value2`,
        'column3': `value3`
    }
});
```

## Support
Feel free to join our [Discord server](https://fidilen.com/discord)!

## Author
Made with ♥ by [fidilen](https://fidilen.com)