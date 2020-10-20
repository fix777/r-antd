## RTable

### API

#### exportOptions

##### rangeTypes: `string[]=['ALL', 'SELECTED', 'RESULT']`

This prop indicates which exporting range radios will be rendered on the exporting modal.

We provided 3 values below out of the box:

* `ALL`: all records.
* `SELECTED`: selected records.
* `RESULT`: the filtered records.

The radios will be rendered order by this prop. i.e. if you set it to `['SELECTED', 'RESULT', 'ALL']`, then you get the `ALL` radio placed after the other two. If you want to show some specific radios, you can set the specific values only.

##### customizedRanges: `Array<{ label: string; value: string }>=[]`

You can use this prop to append customized exporting range radios.
